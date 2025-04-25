import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RecordEntry } from './record-entry.schema';

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({ required: true })
  patientId: string;

  @Prop({ type: [Object], default: [] })
  records: RecordEntry[];
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
