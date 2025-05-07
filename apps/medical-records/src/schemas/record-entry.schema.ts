import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class RecordEntry {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ type: Object })
  diagnosis?: Record<string, any>;

  @Prop({ type: Object })
  treatment?: Record<string, any>;

  @Prop({ type: Object })
  labResults?: Record<string, any>;

  @Prop()
  notes: string[];

  @Prop([String])
  sharedWithDoctors: string[];
}

export const RecordEntrySchema = SchemaFactory.createForClass(RecordEntry);
