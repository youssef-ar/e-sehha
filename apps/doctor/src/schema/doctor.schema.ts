import { Schema, Document } from 'mongoose';

export const DoctorSchema = new Schema({
  name: String,
  email: String,
  specialty: String,
  qualifications: [String],
  phone: String,
  bio: String,
  verified: { type: Boolean, default: false },
});

export interface Doctor extends Document {
  name: string;
  email: string;
  specialty: string;
  qualifications: string[];
  phone: string;
  bio: string;
  verified: boolean;
}
