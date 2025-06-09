import { Inject, Injectable } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications/notifications.patterns';

@Injectable()
export class DoctorService {
  constructor(
    private readonly repo: DoctorRepository,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy) {}

  // doctor.service.ts
  /* async registerDoctor(dto: CreateDoctorDto) {
    const { userId, ...rest } = dto;
    return this.repo.create({
      _id: userId,
      verified: false,
      ...rest,
    });
  } */
  async registerDoctor(dto: CreateDoctorDto) {
    //const { userId, ...rest } = dto;
    console.log("Registering doctor with DTO:", dto);
    const doctor =  this.repo.create({
      ...dto,
      verified: false,
  
    });
    this.notificationsClient.emit(
          NOTIFICATIONS_PATTERNS.DOCTOR_REGISTERED,
          {
            doctorEmail: dto.email,
            message: dto,
            title: 'Doctor Registration',
            channels: ['email'],
            type: NOTIFICATIONS_PATTERNS.DOCTOR_REGISTERED,
            email: "youssefaridhi1@gmail.com",
            //phone: phone,
          },
        );
        return doctor;
    
  }

  async getDoctorProfile(id: string) {
    return this.repo.findById(id);
  }

  async getDoctors() {
    return this.repo.findAll();
  }

  async verifyDoctor(id: string) {
    return this.repo.verifyDoctor(id);
  }
}
