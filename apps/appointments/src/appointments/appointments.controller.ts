import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto,
  Appointment,
} from '@app/contracts/appointments';
import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';
import { PaginatedResponseDto } from '@app/contracts/pagination';

@Controller()
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @MessagePattern(APPOINTMENTS_PATTERNS.CREATE_APPOINTMENT)
  async create(
    @Payload() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    this.logger.debug(
      `Creating appointment: ${JSON.stringify(createAppointmentDto)}`,
    );
    try {
      const result =
        await this.appointmentsService.create(createAppointmentDto);
      this.logger.debug(`Appointment created successfully`);
      return result;
    } catch (error) {
      this.logger.error('Failed to create appointment');
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.FIND_ALL_APPOINTMENTS)
  async findAll(
    @Payload() query: FindAllAppointmentsQueryDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    this.logger.debug(
      `Finding all appointments with query: ${JSON.stringify(query)}`,
    );
    try {
      const result = await this.appointmentsService.findAll(query);
      this.logger.debug('Retrieved appointments');
      return result;
    } catch (error) {
      this.logger.error('Failed to find all appointments');
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.FIND_ONE_APPOINTMENT)
  async findOne(@Payload() id: string): Promise<Appointment> {
    this.logger.debug(`Finding appointment with ID: ${id}`);
    try {
      const result = await this.appointmentsService.findOne(id);
      this.logger.debug(`Found appointment with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to find appointment ${id}`);
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.UPDATE_APPOINTMENT_STATUS)
  async update(
    @Payload()
    payload: {
      id: string;
      updateAppointmentStatusDto: UpdateAppointmentStatusDto;
    },
  ): Promise<Appointment> {
    this.logger.debug(
      `Updating appointment status ${payload.id} with: ${JSON.stringify(payload.updateAppointmentStatusDto)}`,
    );
    try {
      const result = await this.appointmentsService.updateStatus(
        payload.id,
        payload.updateAppointmentStatusDto,
      );
      this.logger.debug(
        `Successfully updated appointment status: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to update appointment ${payload.id}`);
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.REMOVE_APPOINTMENT)
  async remove(@Payload() id: string): Promise<Appointment> {
    this.logger.debug(`Removing appointment with ID: ${id}`);
    try {
      const result = await this.appointmentsService.remove(id);
      this.logger.debug(`Removed appointment with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to remove appointment ${id}`);
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.RESCHEDULE_APPOINTMENT)
  async reschedule(
    @Payload() payload: { id: string; rescheduleDto: RescheduleAppointmentDto },
  ): Promise<Appointment> {
    this.logger.debug(
      `Rescheduling appointment: ${JSON.stringify(payload.rescheduleDto)}`,
    );
    try {
      const result = await this.appointmentsService.reschedule(
        payload.id,
        payload.rescheduleDto,
      );
      this.logger.debug(`Appointment rescheduled successfully`);
      return result;
    } catch (error) {
      this.logger.error('Failed to reschedule appointment');
      throw error;
    }
  }
}
