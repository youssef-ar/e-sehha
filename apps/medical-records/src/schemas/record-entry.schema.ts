import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RecordEntry {
  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  visitDate: Date;

  @Prop({ type: Object })
  diagnosis?: Record<string, any>;

  @Prop({ type: Object })
  treatment?: Record<string, any>;

  @Prop({ type: Object })
  labResults?: Record<string, any>;

  @Prop()
  notes: string[];

  @Prop([String])
  sharedWithDoctors: string[]; // Optional sharing per entry
}