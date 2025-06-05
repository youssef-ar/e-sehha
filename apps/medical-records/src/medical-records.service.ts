import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { RecordEntry } from './schemas/record-entry.schema';
import { RpcException } from '@nestjs/microservices';
import { MedicalRecordEncryptionService } from './encryption';

@Injectable()
export class RecordService {
  private readonly logger = new Logger(RecordService.name);  constructor(
    @InjectModel(MedicalRecord.name)
    private readonly medicalRecordModel: Model<MedicalRecord>,
    private readonly encryptionService: MedicalRecordEncryptionService,
  ) {}

  private buildAuthorizedRecordsAggregation(
    doctorId: string,
    patientId?: string,
    skip = 0,
    limit = 10,
  ) {
    const matchStage: any = {};
    if (patientId) {
      matchStage.patientId = patientId;
    }

    return [
      { $match: matchStage },
      {
        $project: {
          patientId: 1,
          records: {
            $filter: {
              input: '$records',
              as: 'record',
              cond: {
                $or: [
                  { $eq: ['$$record.doctorId', doctorId] },
                  { $in: [doctorId, '$$record.sharedWithDoctors'] },
                ],
              },
            },
          },
        },
      },
      { $match: { 'records.0': { $exists: true } } },
      { $skip: skip },
      { $limit: limit },
    ];
  }

  async addOrUpdateMedicalRecord(
    patientId: string,
    newEntry: RecordEntryDto,
  ): Promise<MedicalRecord> {
    this.logger.debug(`Creating or updating record for patient: ${patientId}`);
    this.logger.debug(`New entry: ${JSON.stringify(newEntry)}`);
    if (!patientId || !newEntry?.doctorId) {
      throw new RpcException('Missing required patient or doctor information');

    }

    try {
      const existing = await this.medicalRecordModel.findOne({ patientId });      if (existing) {
        const newRecord = this.toRecord(newEntry);
        // Encrypt sensitive data before saving
        const encryptedRecord = this.encryptionService.encryptRecordEntry(newRecord);
        existing.records.push(encryptedRecord);
        const saved = await existing.save();
        // Convert to plain object and return decrypted data
        const plainObj = saved.toObject();
        return this.encryptionService.decryptMedicalRecord(plainObj);
      } else {
        const newRecord = this.toRecord(newEntry);
        // Encrypt sensitive data before saving
        const encryptedRecord = this.encryptionService.encryptRecordEntry(newRecord);
        const created = new this.medicalRecordModel({
          patientId,
          records: [encryptedRecord],
        });
        const saved = await created.save();
        // Return decrypted data as plain object
        const plainObj = saved.toObject();
        return this.encryptionService.decryptMedicalRecord(plainObj);
      }
    } catch (error) {
      console.error('Error saving medical record:', error);
      throw new RpcException('Failed to save medical record');
    }
    
  }
  async findAll(doctorId: string, page = 1, pageSize = 10) {
    if (!doctorId) throw new RpcException('Doctor ID is required');

    const skip = (page - 1) * pageSize;
    const pipeline = this.buildAuthorizedRecordsAggregation(
      doctorId,
      undefined,
      skip,
      pageSize,
    );    const results = await this.medicalRecordModel.aggregate(pipeline);
    // Decrypt data before returning (results from aggregation are already plain objects)
    return results.map(record => this.encryptionService.decryptMedicalRecord(record));
  }

  async findOne(patientId: string, doctorId: string) {
    if (!doctorId || !patientId) {
      throw new RpcException('Patient ID and Doctor ID are required');
    }

    const pipeline = this.buildAuthorizedRecordsAggregation(
      doctorId,
      patientId,
    );    const result = await this.medicalRecordModel.aggregate(pipeline);

    if (!result.length) {
      throw new RpcException(
        'Medical record not found or access denied',
      );
    }

    // Decrypt data before returning
    return this.encryptionService.decryptMedicalRecord(result[0]);
  }
  async updateRecord(
    patientId: string,
    recordId: string,
    newEntry: RecordEntryDto,
  ) {
    if (!patientId || !recordId) {
      throw new RpcException('Patient ID and Record ID are required');
    }

    const medicalRecord = await this.medicalRecordModel.findOne({ patientId });
    if (!medicalRecord) {
      throw new RpcException('Medical record not found');
    }

    const record = medicalRecord.records.find(
      (record) => record._id.toString() === recordId,
    );
    if (!record) {
      throw new RpcException('Record not found');
    }    // Encrypt the updated data
    const encryptedEntry = this.encryptionService.encryptRecordEntryDto(newEntry);
    Object.assign(record, encryptedEntry);
    await medicalRecord.save();

    return { message: 'Record updated successfully' };
  }

  async remove(patientId: string) {
    if (!patientId) throw new RpcException('Patient ID is required');

    const deleted = await this.medicalRecordModel.findOneAndDelete({
      patientId,
    });

    if (!deleted) {
      throw new RpcException('Medical record not found');
    }

    return { message: 'Record deleted successfully', patientId };
  }

  async giveDoctorAuthorizationToAuditRecord(
    doctorId: string,
    patientId: string,
    recordId: string,
    doctorIdToAdd: string
  )
  {
    if (!doctorId || !recordId || !doctorIdToAdd) {
      throw new RpcException('Doctor ID, Record ID, and Doctor ID to add are required');
    }
    const medicalRecord = await this.medicalRecordModel.findOne({ patientId: patientId });
    if (!medicalRecord) {
      this.logger.error(`Medical record not found for patient: ${patientId}`);
      throw new RpcException('Medical record not found');
    }
    const record = medicalRecord.records.find((record) => record?._id?.toString() === recordId);
    if (!record) {
      this.logger.error(`Record not found for ID: ${recordId}`);
      throw new RpcException('Record not found');
    }
    if (record.sharedWithDoctors.includes(doctorIdToAdd)) {
      this.logger.error(`Doctor ${doctorIdToAdd} already has access to this record`);
      throw new RpcException('Doctor already has access to this record');
    }
    record.sharedWithDoctors.push(doctorIdToAdd);
    await medicalRecord.save();
    return { message: 'Doctor authorization updated successfully' };
  }  private toRecord(entry: RecordEntryDto): RecordEntry {
    return {
      _id: new Types.ObjectId(),
      doctorId: entry.doctorId,
      diagnosis: entry.diagnosis || {},
      treatment: entry.treatment || {},
      labResults: entry.labResults || {},
      notes: (() => {
        if (entry.notes) {
          return Array.isArray(entry.notes) ? entry.notes : [entry.notes];
        }
        return [];
      })(),
      sharedWithDoctors: entry.sharedWithDoctors || [],
    } as RecordEntry;
  }
}

