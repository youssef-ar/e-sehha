// doctor.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { VerifyDoctorDto } from '@app/contracts/doctor/verify-doctor.dto';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';

@Controller()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @MessagePattern(DOCTOR_PATTERNS.REGISTER)
  registerDoctor(data: CreateDoctorDto) {
    return this.doctorService.registerDoctor(data);
  }
}
