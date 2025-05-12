import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { VerifyDoctorDto } from '@app/contracts/doctor/verify-doctor.dto';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from '../utils/error-handler.util';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';
import {
  APPOINTMENTS_SERVICE,
  DOCTOR_SERVICE,
  MEDICAL_RECORDS_SERVICE,
} from '../constants';
import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';
import { RescheduleAppointmentDto } from '@app/contracts/appointments';
import { AppointmentStatusEnum } from '@app/contracts/appointments/appointment-status.enum';
import { RecordEntryDto } from 'apps/medical-records/src/dto/record-entry.dto';
import { MEDICAL_RECORDS_PATTERNS } from '@app/contracts/medical_records/medical-records.pattern';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @Inject(DOCTOR_SERVICE) private doctorClient: ClientProxy,
    @Inject(APPOINTMENTS_SERVICE) private appointmentsClient: ClientProxy,
    @Inject(MEDICAL_RECORDS_SERVICE) private medicalRecordsClient: ClientProxy,
  ) {}

  async registerDoctor(dto: CreateDoctorDto) {
    this.logger.debug(`Registering doctor: ${JSON.stringify(dto)}`);
    try {
      const result = await lastValueFrom(
        this.doctorClient.send(DOCTOR_PATTERNS.REGISTER, dto),
      );
      this.logger.debug(`Registered doctor: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'register doctor');
    }
  }

  async acceptAppointment(id: string) {
    try {
      return await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.UPDATE_APPOINTMENT_STATUS,
          {
            id,
            updateAppointmentStatusDto: {
              status: AppointmentStatusEnum.CONFIRMED,
            },
          },
        ),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'accept appointment');
    }
  }

  async rescheduleAppointment(id: string, dto: RescheduleAppointmentDto) {
    try {
      return await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.RESCHEDULE_APPOINTMENT,
          {
            id,
            rescheduleDto: dto,
          },
        ),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'reschedule appointment');
    }
  }

  async cancelAppointment(id: string) {
    try {
      return await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.REMOVE_APPOINTMENT,
          id,
        ),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'cancel appointment');
    }
  }

  async addMedicalRecord(patientId: string, dto: RecordEntryDto) {
    try {
      return await lastValueFrom(
        this.medicalRecordsClient.send(
          MEDICAL_RECORDS_PATTERNS.CREATE_RECORD_ENTRY,
          dto,
        ),
      );
    } catch (err) {
      handleRpcError(err, this.logger, 'add medical record');
    }
  }

  async getPatientRecords(patientId: string, doctorId: string) {
    try {
      return await lastValueFrom(
        this.medicalRecordsClient.send(
          MEDICAL_RECORDS_PATTERNS.GET_RECORDS_BY_PATIENT,
          { patientId, doctorId },
        ),
      );
    } catch (err) {
      handleRpcError(err, this.logger, 'get patient records');
    }
  }
}
