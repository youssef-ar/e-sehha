import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RecordEntryDto } from './dto/record-entry.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { RecordEntry } from './schemas/record-entry.schema';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private readonly medicalRecordModel: Model<MedicalRecord>,
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
    if (!patientId || !newEntry?.doctorId) {
      throw new BadRequestException('Missing required patient or doctor information');
    }

    try {
      const existing = await this.medicalRecordModel.findOne({ patientId });

      if (existing) {
        existing.records.push(this.toRecord(newEntry));
        return await existing.save();
      } else {
        const created = new this.medicalRecordModel({
          patientId,
          records: [this.toRecord(newEntry)],
        });
        return await created.save();
      }
    } catch (error) {
      console.error('Error saving medical record:', error);
      throw new InternalServerErrorException('Failed to save medical record');
    }
  }

  async findAll(doctorId: string, page = 1, pageSize = 10) {
    if (!doctorId) throw new BadRequestException('Doctor ID is required');

    const skip = (page - 1) * pageSize;
    const pipeline = this.buildAuthorizedRecordsAggregation(
      doctorId,
      undefined,
      skip,
      pageSize,
    );

    return this.medicalRecordModel.aggregate(pipeline);
  }

  async findOne(patientId: string, doctorId: string) {
    if (!doctorId || !patientId) {
      throw new BadRequestException('Patient ID and Doctor ID are required');
    }

    const pipeline = this.buildAuthorizedRecordsAggregation(
      doctorId,
      patientId,
    );
    const result = await this.medicalRecordModel.aggregate(pipeline);

    if (!result.length) {
      throw new NotFoundException(
        'Medical record not found or access denied',
      );
    }

    return result[0];
  }

  async remove(patientId: string) {
    if (!patientId) throw new BadRequestException('Patient ID is required');

    const deleted = await this.medicalRecordModel.findOneAndDelete({ patientId });

    if (!deleted) {
      throw new NotFoundException('Medical record not found');
    }

    return { message: 'Record deleted successfully', patientId };
  }

  private toRecord(entry: RecordEntryDto): RecordEntry {
    return {
      doctorId: entry.doctorId,
      visitDate: new Date(entry.visitDate),
      diagnosis: entry.diagnosis || {},
      treatment: entry.treatment || {},
      labResults: entry.labResults || {},
      notes: entry.notes ? (Array.isArray(entry.notes) ? entry.notes : [entry.notes]) : [],
      sharedWithDoctors: entry.sharedWithDoctors || [],
    };
  }
}