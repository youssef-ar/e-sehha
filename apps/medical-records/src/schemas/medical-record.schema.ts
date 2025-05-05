import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RecordEntry, RecordEntrySchema } from './record-entry.schema';

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({ required: true })
  patientId: string;

  @Prop({ type: [RecordEntrySchema], default: [] })
  records: Types.DocumentArray<RecordEntry>;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
