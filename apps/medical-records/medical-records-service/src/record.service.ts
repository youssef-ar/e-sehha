import { Injectable } from '@nestjs/common';
import { RecordEntryDto } from './dto/record-entry.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medial-record.schema';


@Injectable()
export class RecordService {

  constructor(
    @InjectModel(MedicalRecord.name) private readonly MedicalRecordModel: Model<MedicalRecord>,
  ) {}

  async addOrUpdateMedicalRecord(patientId: string, newEntry: RecordEntryDto) : Promise<MedicalRecord> {
    const medicalRecord = await this.MedicalRecordModel.findOne({ patientId });
  
    //validate

    if (medicalRecord) {
      medicalRecord.records.push(newEntry.toRecord());
      return medicalRecord.save();
    } else {
      const newMedicalRecord = new this.MedicalRecordModel({
        patientId,
        records: [newEntry.toRecord()],
      });
      return newMedicalRecord.save();
    }
  }
  

  findAll(): Promise<MedicalRecord[]> {
    return this.MedicalRecordModel.find().exec();
  }

  async findOne(id: number): Promise<MedicalRecord> {
    const medicalRecord = await this.MedicalRecordModel.findById(id).exec();
    if (!medicalRecord) {
      throw new Error(`Medical record with id ${id} not found`);
    }
    return medicalRecord;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
  
}
