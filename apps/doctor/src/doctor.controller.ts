// doctor.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';

@Controller()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @MessagePattern(DOCTOR_PATTERNS.REGISTER)
  registerDoctor(@Payload() payload: CreateDoctorDto) {
    console.log("Registering doctor with payload:", payload);
    console.log("Doctor DTO:", payload);
    return this.doctorService.registerDoctor(payload);
  }

  @MessagePattern(DOCTOR_PATTERNS.GET_PROFILE)
  getDoctorProfile(@Payload() payload: { id: string }) {
    return this.doctorService.getDoctorProfile(payload.id);
  }

  @MessagePattern(DOCTOR_PATTERNS.GET_DOCTORS)
  getDoctors() {
    return this.doctorService.getDoctors();
  }

  @MessagePattern(DOCTOR_PATTERNS.VERIFY_DOCTOR)
  verifyDoctor(@Payload() payload: { id: string }) {
    return this.doctorService.verifyDoctor(payload.id);
  }
}
