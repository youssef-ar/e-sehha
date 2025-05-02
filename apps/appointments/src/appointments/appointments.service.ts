import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '@app/contracts/appointments';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      this.logger.debug(
        `Creating appointment: ${JSON.stringify(createAppointmentDto)}`,
      );
      const appointment = await this.prisma.appointment.create({
        data: {
          ...createAppointmentDto,
        },
      });
      this.logger.debug(`Created appointment with ID: ${appointment.id}`);
      return appointment;
    } catch {
      this.logger.error('Failed to create appointment');
      throw new RpcException('Could not create appointment.');
    }
  }

  async findAll() {
    try {
      this.logger.debug('Finding all appointments');
      const appointments = await this.prisma.appointment.findMany();
      this.logger.debug(`Found ${appointments.length} appointments`);
      return appointments;
    } catch {
      this.logger.error('Failed to find all appointments');
      throw new RpcException('Could not retrieve appointments.');
    }
  }

  async findOne(id: string) {
    this.logger.debug(`Finding appointment with ID: ${id}`);
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!appointment) {
      this.logger.debug(`Appointment with ID: ${id} not found`);
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    this.logger.debug(`Found appointment with ID: ${id}`);
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    this.logger.debug(
      `Updating appointment ${id}: ${JSON.stringify(updateAppointmentDto)}`,
    );

    // Check if appointment exists
    const exists = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new RpcException(`Appointment with ID: ${id} not found`);
    }

    const updated = await this.prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...updateAppointmentDto,
      },
    });

    this.logger.debug(`Updated appointment with ID: ${id}`);
    return updated;
  }

  async remove(id: string) {
    try {
      this.logger.debug(`Removing appointment with ID: ${id}`);

      // Check if appointment exists
      const exists = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new RpcException(`Appointment with ID: ${id} not found`);
      }

      const removed = await this.prisma.appointment.delete({
        where: {
          id,
        },
      });

      this.logger.debug(`Removed appointment with ID: ${id}`);
      return removed;
    } catch {
      this.logger.error(`Failed to remove appointment ${id}`);
      throw new RpcException(`Could not delete appointment with ID: ${id}.`);
    }
  }
}
