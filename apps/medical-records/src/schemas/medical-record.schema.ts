import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RecordEntry } from './record-entry.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({ required: true })
  patientId: string;

  @Prop({ type: [RecordEntry], default: [] })
  records: RecordEntry[];
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
