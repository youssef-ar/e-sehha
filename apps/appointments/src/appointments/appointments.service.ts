import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto, // Import from contracts
} from '@app/contracts/appointments';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @Inject(IAppointmentsRepository)
    private readonly appointmentsRepository: IAppointmentsRepository,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsRepository.create(createAppointmentDto);
  }

  async findAll(
    query: FindAllAppointmentsQueryDto,
  ): Promise<{ appointments: Appointment[]; total: number }> {
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

    this.logger.debug(`Updated appointment status with ID: ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.debug(`Removing appointment with ID: ${id}`);

    const exists = await this.appointmentsRepository.exists(id);

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const removed = await this.appointmentsRepository.delete(id);

    this.logger.debug(`Removed appointment with ID: ${id}`);
    return removed;
  }

  async reschedule(id: string, rescheduleDto: RescheduleAppointmentDto) {
    this.logger.debug(`Rescheduling appointment ${id} to new date`);

    const exists = await this.appointmentsRepository.exists(id);

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const updatedAppointment = await this.appointmentsRepository.reschedule(
      id,
      rescheduleDto,
    );

    this.logger.debug(`Successfully rescheduled appointment ${id}`);

    return updatedAppointment;
  }
}
