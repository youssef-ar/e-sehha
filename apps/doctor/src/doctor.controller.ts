// doctor.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';

@Controller()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @MessagePattern(DOCTOR_PATTERNS.REGISTER)
  registerDoctor(data: CreateDoctorDto) {
    return this.doctorService.registerDoctor(data);
  }

  @MessagePattern(DOCTOR_PATTERNS.GET_PROFILE)
  getDoctorProfile(data: string) {
    return this.doctorService.getDoctorProfile(data);
  }

  @MessagePattern(DOCTOR_PATTERNS.GET_DOCTORS)
  getDoctors() {
    return this.doctorService.getDoctors();
  }

  @MessagePattern(DOCTOR_PATTERNS.VERIFY_DOCTOR)
  verifyDoctor(data: string) {
    return this.doctorService.verifyDoctor(data);
  }
}
