import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordController } from './medical-records.controller';
import { RecordService } from './medical-records.service';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medical-record.schema';
import { RecordEntry, RecordEntrySchema } from './schemas/record-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: RecordEntry.name, schema: RecordEntrySchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/medical-records'),
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
