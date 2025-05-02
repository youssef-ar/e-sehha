import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';
import { lastValueFrom } from 'rxjs';
import {
  Appointment,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/contracts/appointments';
import { APPOINTMENTS_SERVICE } from '../constants';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @Inject(APPOINTMENTS_SERVICE) private appointmentsClient: ClientProxy,
  ) {}

  // Helper method to handle common error patterns
  private handleServiceError(error: any, operation: string): never {
    this.logger.error(`Failed to ${operation}`, error);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const errorMessage: string = error?.message || 'Unknown error';

    // Check for common error patterns
    if (errorMessage.includes('not found')) {
      console.log('Not found error');
      throw new NotFoundException(errorMessage);
    } else if (
      errorMessage.includes('unique constraint') ||
      errorMessage.includes('Foreign key constraint') ||
      errorMessage.includes('validation')
    ) {
      throw new BadRequestException(errorMessage);
    } else {
      throw new InternalServerErrorException(
        `An error occurred while ${operation}`,
      );
    }
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    this.logger.debug(
      `Creating appointment: ${JSON.stringify(createAppointmentDto)}`,
    );
    try {
      const result: Appointment = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.CREATE_APPOINTMENT,
          createAppointmentDto,
        ),
      );
      this.logger.debug(
        `Successfully created appointment with ID: ${result?.id}`,
      );
      return result;
    } catch (error) {
      return this.handleServiceError(error, 'create appointment');
    }
  }

  async findAll(): Promise<Appointment[]> {
    this.logger.debug('Finding all appointments');
    try {
      const appointments: Appointment[] = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.FIND_ALL_APPOINTMENTS,
          {},
        ),
      );
      this.logger.debug(`Found ${appointments?.length} appointments`);
      return appointments;
    } catch (error) {
      return this.handleServiceError(error, 'find all appointments');
    }
  }

  async findOne(id: string): Promise<Appointment> {
    this.logger.debug(`Finding appointment with ID: ${id}`);
    try {
      const appointment: Appointment = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.FIND_ONE_APPOINTMENT,
          id,
        ),
      );
      this.logger.debug(`Found appointment: ${JSON.stringify(appointment)}`);
      return appointment;
    } catch (error) {
      return this.handleServiceError(error, `find appointment ${id}`);
    }
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    this.logger.debug(
      `Updating appointment status ${id} with: ${JSON.stringify(updateAppointmentStatusDto)}`,
    );
    try {
      const updated: Appointment = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.UPDATE_APPOINTMENT_STATUS,
          {
            id,
            updateAppointmentStatusDto,
          },
        ),
      );
      this.logger.debug(
        `Successfully updated appointment status: ${JSON.stringify(updated)}`,
      );
      return updated;
    } catch (error) {
      return this.handleServiceError(error, `update appointment status ${id}`);
    }
  }
  async remove(id: string): Promise<Appointment> {
    this.logger.debug(`Removing appointment with ID: ${id}`);
    try {
      const removed: Appointment = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.REMOVE_APPOINTMENT,
          id,
        ),
      );
      this.logger.debug(
        `Successfully removed appointment: ${JSON.stringify(removed)}`,
      );
      return removed;
    } catch (error) {
      return this.handleServiceError(error, `remove appointment ${id}`);
    }
  }

  async reschedule(
    id: string,
    rescheduleDto: RescheduleAppointmentDto,
  ): Promise<Appointment> {
    this.logger.debug(`Rescheduling appointment with ID: ${id}`);
    try {
      const rescheduled: Appointment = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.RESCHEDULE_APPOINTMENT,
          { id, rescheduleDto },
        ),
      );
      this.logger.debug(
        `Successfully rescheduled appointment: ${JSON.stringify(rescheduled)}`,
      );
      return rescheduled;
    } catch (error) {
      return this.handleServiceError(error, `reschedule appointment ${id}`);
    }
  }
}
