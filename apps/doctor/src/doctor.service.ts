import { Injectable } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { VerifyDoctorDto } from '@app/contracts/doctor/verify-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly repo: DoctorRepository) {}

  // doctor.service.ts
  async registerDoctor(dto: CreateDoctorDto) {
    return this.repo.create({
      ...dto,
      verified: false,
    });
  }
}
