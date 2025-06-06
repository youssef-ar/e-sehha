import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schema/doctor.schema';

@Injectable()
export class DoctorRepository {
  constructor(
    @InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
  ) {}

  // doctor.repository.ts
  async create(data: Partial<Doctor>) {
    return this.doctorModel.create(data);
  }

  async findByEmail(email: string) {
    return this.doctorModel.findOne({ email });
  }

  async findById(id: string) {
    return this.doctorModel.findById(id);
  }
  // Add more queries as needed
}
