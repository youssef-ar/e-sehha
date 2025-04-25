import { Injectable } from '@nestjs/common';
import { RecordEntryDto } from './dto/record-entry.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medial-record.schema';


@Injectable()
export class RecordService {

  constructor(
    @InjectModel(MedicalRecord.name) private readonly recordModel: Model<MedicalRecord>,
  ) {}

  async addOrUpdateMedicalRecord(patientId: string, newEntry: RecordEntryDto) {
    const record = await this.recordModel.findOne({ patientId });
  
    if (record) {
      record.records.push(newEntry.toRecord());
      return record.save();
    } else {
      const newRecord = new this.recordModel({
        patientId,
        records: [newEntry.toRecord()],
      });
      return newRecord.save();
    }
  }
  

  create(createRecordDto: RecordEntryDto) {
    return 'This action adds a new record';
  }

  findAll() {
    return `This action returns all record`;
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: RecordEntryDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
  
}
