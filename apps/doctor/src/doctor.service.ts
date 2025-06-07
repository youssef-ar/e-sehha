import { Injectable } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly repo: DoctorRepository) {}

  // doctor.service.ts
  async registerDoctor(dto: CreateDoctorDto) {
    const { userId, ...rest } = dto;
    return this.repo.create({
      _id: userId,
      verified: false,
      ...rest,
    });
  }

  async getDoctorProfile(id: string) {
    return this.repo.findById(id);
  }
}
