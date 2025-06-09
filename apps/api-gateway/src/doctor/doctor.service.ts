import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from '../utils/error-handler.util';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';
import {
  APPOINTMENTS_SERVICE,
  DOCTOR_SERVICE,
  USERS_SERVICE,
} from '../constants';
import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';
import { RescheduleAppointmentDto } from '@app/contracts/appointments';
import { AppointmentStatusEnum } from '@app/contracts/appointments/appointment-status.enum';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { recordPatterns } from '@app/contracts/medical-records/records.patterns';
import { RECORD_SERVICE } from '@app/contracts/medical-records/constants';
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @Inject(DOCTOR_SERVICE) private doctorClient: ClientProxy,
    @Inject(APPOINTMENTS_SERVICE) private appointmentsClient: ClientProxy,
    @Inject(RECORD_SERVICE) private recordsClient: ClientProxy,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
  ) {}

  async registerDoctor(dto: CreateDoctorDto) {
    this.logger.debug(`Registering doctor: ${JSON.stringify(dto)}`);
    try {
      //this.usersClient.send(USERS_PATTERNS.CREATE_DOCTOR, dto.email);
      const result = await lastValueFrom(
        this.doctorClient.send(DOCTOR_PATTERNS.REGISTER, dto),
      );
      this.logger.debug(`Registered doctor: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'register doctor');
    }
  }

  async getDoctors() {
    try {
      return await lastValueFrom(
        this.doctorClient.send(DOCTOR_PATTERNS.GET_DOCTORS, {}),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'get doctors');
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

  async createOrUpdateMedicalRecord(patientId: string, entry: RecordEntryDto) {
    this.logger.debug(
      `Doctor creating/updating record for patient ${patientId}`,
    );
    try {
      return await lastValueFrom(
        this.recordsClient.send(recordPatterns.CREATE_UPDATE, {
          patientId,
          newEntry: entry,
        }),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'create/update medical record');
    }
  }

  async getAllPatientRecords(doctorId: string, page = 1, pageSize = 10) {
    this.logger.debug(`Doctor ${doctorId} retrieving all patient records`);
    try {
      return await lastValueFrom(
        this.recordsClient.send(recordPatterns.FIND_ALL, {
          doctorId,
          page,
          pageSize,
        }),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'retrieve all medical records');
    }
  }

  async getPatientRecord(patientId: string, requesterId: string) {
    this.logger.debug(
      `Doctor ${requesterId} requesting record for patient ${patientId}`,
    );
    try {
      return await lastValueFrom(
        this.recordsClient.send(recordPatterns.FIND_ONE, {
          patientId,
          requesterId,
        }),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'retrieve single medical record');
    }
  }

  async updateRecordEntry(
    patientId: string,
    recordId: string,
    entry: RecordEntryDto,
  ) {
    this.logger.debug(
      `Updating record entry ${recordId} for patient ${patientId}`,
    );
    try {
      return await lastValueFrom(
        this.recordsClient.send(recordPatterns.UPDATE_RECORD, {
          patientId,
          recordId,
          newEntry: entry,
        }),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'update record entry');
    }
  }

  async authorizeDoctorForRecord(
    doctorId: string,
    patientId: string,
    recordId: string,
    doctorIdToAdd: string,
  ) {
    this.logger.debug(
      `Doctor ${doctorId} authorizing Doctor ${doctorIdToAdd} on record ${recordId}`,
    );
    try {
      return await lastValueFrom(
        this.recordsClient.send(recordPatterns.GIVE_AUTHORIZATION, {
          doctorId,
          patientId,
          recordId,
          doctorIdToAdd,
        }),
      );
    } catch (error) {
      handleRpcError(
        error,
        this.logger,
        'give authorization to audit medical record',
      );
    }
  }

  async removePatientRecord(patientId: string) {
    this.logger.warn(`Removing record for patient ${patientId}`);
    try {
      return await lastValueFrom(
        this.recordsClient.send('record.remove', patientId),
      );
    } catch (error) {
      handleRpcError(error, this.logger, 'remove medical record');
    }
  }

  async getDoctorProfile(id: string) {
    this.logger.debug(`Getting profile for doctor ${id}`);
    try {
      const doctorData = await lastValueFrom(
        this.doctorClient.send(DOCTOR_PATTERNS.GET_PROFILE, id),
      );
      return doctorData;
    } catch (error) {
      handleRpcError(error, this.logger, 'get doctor profile');
    }
  }
}
