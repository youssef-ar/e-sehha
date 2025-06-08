import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordController } from './medical-records.controller';
import { RecordService } from './medical-records.service';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medical-record.schema';
import { RecordEntry, RecordEntrySchema } from './schemas/record-entry.schema';
import { ConfigModule } from '@nestjs/config';
import { EncryptionModule } from './encryption';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: RecordEntry.name, schema: RecordEntrySchema },
    ]),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-records'),
    EncryptionModule,
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
