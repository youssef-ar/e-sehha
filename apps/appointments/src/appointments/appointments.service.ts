import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto,
} from '@app/contracts/appointments';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { Appointment } from '@prisma/client';
import { PaginatedResponseDto } from '@app/contracts/pagination';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications/notifications.patterns';
import { lastValueFrom } from 'rxjs';
import { DOCTOR_PATTERNS } from '@app/contracts/doctor/doctor.patterns';
import { USERS_PATTERNS } from '@app/contracts';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @Inject(IAppointmentsRepository)
    private readonly appointmentsRepository: IAppointmentsRepository,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
    @Inject('DOCTOR_SERVICE')
    private readonly doctorClient: ClientProxy,
    @Inject('USER_SERVICE')
  private readonly userClient: ClientProxy,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    email?: string,
    phone?: string,
  ) {
    const appointment =
      await this.appointmentsRepository.create(createAppointmentDto);

    const doctor = await lastValueFrom(
        this.doctorClient.send(DOCTOR_PATTERNS.GET_PROFILE, appointment.doctorId));
    email = doctor.email || email;
    this.notificationsClient.emit(
      NOTIFICATIONS_PATTERNS.UPCUMMING_APPOINTMENTS,
      {
        userId: appointment.doctorId,
        message: `You have an upcoming appointment on ${appointment.date}`,
        title: 'Upcoming Appointment',
        channels: ['email', 'sms', 'sse'],
        type: NOTIFICATIONS_PATTERNS.UPCUMMING_APPOINTMENTS,
        email: email,
        phone: phone,
      },
    );
    return appointment;
  }

  async findAll(query: FindAllAppointmentsQueryDto): Promise<Appointment[]> {
    return this.appointmentsRepository.findAll(query);
  }

  async findOne(id: string) {
    this.logger.debug(`Finding appointment with ID: ${id}`);
    const appointment = await this.appointmentsRepository.findById(id);

    if (!appointment) {
      this.logger.debug(`Appointment with ID: ${id} not found`);
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    this.logger.debug(`Found appointment with ID: ${id}`);
    return appointment;
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    this.logger.debug(
      `Updating appointment status ${id}: ${JSON.stringify(updateAppointmentStatusDto)}`,
    );

    const exists = await this.appointmentsRepository.exists(id);

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const updated = await this.appointmentsRepository.updateStatus(
      id,
      updateAppointmentStatusDto,
    );
    if (updateAppointmentStatusDto.status === 'CONFIRMED') {
    
      // Get patient email
      const patient = await lastValueFrom(
        this.userClient.send(USERS_PATTERNS.GET_USER_BY_ID, updated.patientId)
      );
      
      this.notificationsClient.emit(
        NOTIFICATIONS_PATTERNS.CONFIRMED_APPOINTMENTS,
        {
          userId: updated.patientId,
          message: `Your appointment with Dr. ${updated.doctorName} on ${updated.date} has been confirmed.`,
          title: 'Appointment Confirmed',
          channels: ['email', 'sms', 'sse'],
          type: NOTIFICATIONS_PATTERNS.CONFIRMED_APPOINTMENTS,
          email: patient.email,
        },
      );
  }

    this.logger.debug(`Updated appointment status with ID: ${id}`);
    return updated;
  }

  async remove(id: string, email?: string, phone?: string) {
    this.logger.debug(`Removing appointment with ID: ${id}`);

    const exists = await this.appointmentsRepository.exists(id);

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const removed = await this.appointmentsRepository.delete(id);
    const patient = await lastValueFrom(
        this.userClient.send(USERS_PATTERNS.GET_USER_BY_ID, removed.patientId)
      );
    email = patient.email || email;
    this.notificationsClient.emit(
      NOTIFICATIONS_PATTERNS.CANCELED_APPOINTMENTS,
      {
        userId: removed.patientId,
        message: `Your appointment has been canceled.`,
        title: 'Appointment Canceled',
        channels: ['email', 'sms', 'sse'],
        type: NOTIFICATIONS_PATTERNS.CANCELED_APPOINTMENTS,
        email: email,
        phone: phone,
      },
    );

    this.logger.debug(`Removed appointment with ID: ${id}`);
    return removed;
  }

  async reschedule(
    id: string,
    rescheduleDto: RescheduleAppointmentDto,
    email?: string,
    phone?: string,
  ) {
    this.logger.debug(`Rescheduling appointment ${id} to new date`);

    const exists = await this.appointmentsRepository.exists(id);

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const updatedAppointment = await this.appointmentsRepository.reschedule(
      id,
      rescheduleDto,
    );

    this.notificationsClient.emit(
      NOTIFICATIONS_PATTERNS.RESCHEDULED_APPOINTMENTS,
      {
        userId: updatedAppointment.patientId,
        message: `Your appointment has been rescheduled to ${updatedAppointment.date}`,
        title: 'Appointment Rescheduled',
        channels: ['email', 'sms', 'sse'],
        type: NOTIFICATIONS_PATTERNS.RESCHEDULED_APPOINTMENTS,
        email: email,
        phone: phone,
      },
    );

    this.logger.debug(`Successfully rescheduled appointment ${id}`);

    return updatedAppointment;
  }
}
