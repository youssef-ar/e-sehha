import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';
import { lastValueFrom } from 'rxjs';
import {
  Appointment,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto,
} from '@app/contracts/appointments';
import { APPOINTMENTS_SERVICE } from '../constants';
import { PaginatedResponseDto } from '@app/contracts/pagination';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @Inject(APPOINTMENTS_SERVICE) private appointmentsClient: ClientProxy,
  ) {}

  private handleServiceError(error: any, operation: string): never {
    this.logger.error(`API Gateway: Failed to ${operation}`, error);

    if (error instanceof RpcException || (error?.message && error?.status)) {
      const rpcError = error.getError ? error.getError() : error;
      const message =
        typeof rpcError === 'string'
          ? rpcError
          : rpcError?.message || 'Unknown microservice error';
      const status = rpcError?.status || rpcError?.statusCode;

      if (message.includes('not found') || status === 404) {
        throw new NotFoundException(message);
      } else if (
        status === 400 ||
        message.toLowerCase().includes('validation') ||
        message.toLowerCase().includes('constraint')
      ) {
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(
        message || `An error occurred during ${operation}`,
      );
    }

    throw new InternalServerErrorException(
      `An unexpected error occurred while ${operation}`,
    );
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

  async findAll(
    query: FindAllAppointmentsQueryDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    this.logger.debug(
      `API Gateway: Sending findAll appointments request with query: ${JSON.stringify(query)}`,
    );
    try {
      const result: PaginatedResponseDto<Appointment> = await lastValueFrom(
        this.appointmentsClient.send(
          APPOINTMENTS_PATTERNS.FIND_ALL_APPOINTMENTS,
          query,
        ),
      );
      this.logger.debug(
        `API Gateway: Found ${result?.data?.length} appointments, total: ${result?.total}`,
      );
      return result;
    } catch (error) {
      this.handleServiceError(error, 'find all appointments');
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
