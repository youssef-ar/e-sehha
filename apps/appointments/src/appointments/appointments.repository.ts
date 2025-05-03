import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  AppointmentFilterCriteria,
} from '@app/contracts/appointments';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AppointmentsRepository implements IAppointmentsRepository {
  private readonly logger = new Logger(AppointmentsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      this.logger.debug(
        `Repository: Creating appointment: ${JSON.stringify(
          createAppointmentDto,
        )}`,
      );
      const appointment = await this.prisma.appointment.create({
        data: {
          ...createAppointmentDto,
        },
      });
      this.logger.debug(
        `Repository: Created appointment with ID: ${appointment.id}`,
      );
      return appointment;
    } catch (error: unknown) {
      this.logger.error(
        'Repository: Failed to create appointment',
        error instanceof Error ? error.stack : String(error),
      );
      throw new RpcException('Could not create appointment.');
    }
  }

  async findAll(
    page: number,
    pageSize: number,
    filterCriteria?: AppointmentFilterCriteria,
  ): Promise<{ appointments: Appointment[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const where: Prisma.AppointmentWhereInput = {};

    if (filterCriteria?.patientId) {
      where.patientId = filterCriteria.patientId;
    }
    if (filterCriteria?.doctorId) {
      where.doctorId = filterCriteria.doctorId;
    }
    if (filterCriteria?.status) {
      if (
        Object.values(AppointmentStatus).includes(
          filterCriteria.status as AppointmentStatus,
        )
      ) {
        where.status = filterCriteria.status as AppointmentStatus;
      } else {
        this.logger.warn(`Invalid status filter: ${filterCriteria.status}`);
      }
    }
    if (filterCriteria?.dateFrom || filterCriteria?.dateTo) {
      where.date = {};
      if (filterCriteria.dateFrom) {
        where.date.gte = filterCriteria.dateFrom;
      }
      if (filterCriteria.dateTo) {
        where.date.lte = filterCriteria.dateTo;
      }
    }

    try {
      this.logger.debug(
        `Repository: Finding appointments with filter: ${JSON.stringify(where)}, page: ${page}, pageSize: ${pageSize}`,
      );
      const [appointments, total] = await this.prisma.$transaction([
        this.prisma.appointment.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.appointment.count({ where }),
      ]);

      this.logger.debug(
        `Repository: Found ${appointments.length} appointments, total count: ${total}`,
      );
      return { appointments, total };
    } catch (error: unknown) {
      this.logger.error(
        'Repository: Failed to find appointments',
        error instanceof Error ? error.stack : String(error),
      );
      throw new RpcException('Could not retrieve appointments.');
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      this.logger.debug(`Repository: Finding appointment with ID: ${id}`);
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
      });
      if (appointment) {
        this.logger.debug(`Repository: Found appointment with ID: ${id}`);
      } else {
        this.logger.debug(`Repository: Appointment with ID: ${id} not found`);
      }
      return appointment;
    } catch (error: unknown) {
      this.logger.error(
        `Repository: Failed to find appointment ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new RpcException(`Could not retrieve appointment with ID: ${id}.`);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.appointment.count({
        where: { id },
      });
      return count > 0;
    } catch (error: unknown) {
      this.logger.error(
        `Repository: Failed to check existence for appointment ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new RpcException(
        `Could not check existence for appointment with ID: ${id}.`,
      );
    }
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    try {
      this.logger.debug(
        `Repository: Updating appointment status ${id}: ${JSON.stringify(
          updateAppointmentStatusDto,
        )}`,
      );
      const updated = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: updateAppointmentStatusDto.status,
        },
      });
      this.logger.debug(
        `Repository: Updated appointment status with ID: ${id}`,
      );
      return updated;
    } catch (error: unknown) {
      this.logger.error(
        `Repository: Failed to update status for appointment ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException(`Appointment with ID: ${id} not found`);
      }
      throw new RpcException(
        `Could not update status for appointment with ID: ${id}.`,
      );
    }
  }

  async delete(id: string): Promise<Appointment> {
    try {
      this.logger.debug(`Repository: Removing appointment with ID: ${id}`);
      const removed = await this.prisma.appointment.delete({
        where: { id },
      });
      this.logger.debug(`Repository: Removed appointment with ID: ${id}`);
      return removed;
    } catch (error: unknown) {
      this.logger.error(
        `Repository: Failed to remove appointment ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException(`Appointment with ID: ${id} not found`);
      }
      throw new RpcException(`Could not delete appointment with ID: ${id}.`);
    }
  }

  async reschedule(
    id: string,
    rescheduleDto: RescheduleAppointmentDto,
  ): Promise<Appointment> {
    const { newDate } = rescheduleDto;
    try {
      this.logger.debug(
        `Repository: Rescheduling appointment ${id} to new date`,
      );
      const updatedAppointment = await this.prisma.appointment.update({
        where: { id },
        data: { date: newDate },
      });
      this.logger.debug(
        `Repository: Successfully rescheduled appointment ${id}`,
      );
      return updatedAppointment;
    } catch (error: unknown) {
      this.logger.error(
        `Repository: Failed to reschedule appointment ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException(`Appointment with ID: ${id} not found`);
      }
      throw new RpcException(
        `Could not reschedule appointment with ID: ${id}.`,
      );
    }
  }
}
