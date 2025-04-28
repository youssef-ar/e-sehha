import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordEntryDto } from './dto/record-entry.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { RecordEntry } from './schemas/record-entry.schema';


@Injectable()
export class RecordService {

  constructor(
    @InjectModel(MedicalRecord.name) private readonly medicalRecordModel: Model<MedicalRecord>,
  ) {}

  private buildAuthorizedRecordsAggregation(
    doctorId: string,
    patientId?: string,
    skip = 0,
    limit = 10
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
              input: "$records",
              as: "record",
              cond: {
                $or: [
                  { $eq: ["$$record.doctorId", doctorId] },
                  { $in: [doctorId, "$$record.sharedWithDoctors"] }
                ]
              }
            }
          }
        }
      },
      { $match: { "records.0": { $exists: true } } },
      { $skip: skip },
      { $limit: limit },
    ];
  }

  async addOrUpdateMedicalRecord(patientId: string, newEntry: RecordEntryDto) : Promise<MedicalRecord> {
    const medicalRecord = await this.medicalRecordModel.findOne({ patientId });
  
    //validate

    if (medicalRecord) {
      medicalRecord.records.push(this.toRecord(newEntry));
      return medicalRecord.save();
    } else {
      const newMedicalRecord = new this.medicalRecordModel({
        patientId,
        records: [this.toRecord(newEntry)],
      });
      return newMedicalRecord.save();
    }
  }
  

  async findAll(doctorId: string, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const aggregation = this.buildAuthorizedRecordsAggregation(doctorId, undefined, skip, pageSize);
    return this.medicalRecordModel.aggregate(aggregation);
  }

  async findOne(patientId: string, doctorId: string) {
    const aggregation = this.buildAuthorizedRecordsAggregation(doctorId, patientId);
    const result = await this.medicalRecordModel.aggregate(aggregation);

    if (!result.length) {
      throw new NotFoundException('Medical record not found or access denied');
    }

    return result[0];
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }

  toRecord(entry: RecordEntryDto): RecordEntry {
    return {
        doctorId: entry.doctorId,
        visitDate: entry.visitDate,
        diagnosis: entry.diagnosis,
        treatment: entry.treatment,
        labResults: entry.labResults,
        notes: entry.notes ? [entry.notes] : [],
        sharedWithDoctors: entry.sharedWithDoctors || [],
    };
}
  
}