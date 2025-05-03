import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentsService } from './appointments.service';
import {
  AppointmentFilterCriteria,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/contracts/appointments';
import { APPOINTMENTS_PATTERNS } from '@app/contracts/appointments/appointments.patterns';

@Controller()
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @MessagePattern(APPOINTMENTS_PATTERNS.CREATE_APPOINTMENT)
  async create(@Payload() createAppointmentDto: CreateAppointmentDto) {
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
    @Payload()
    payload: {
      page?: number;
      pageSize?: number;
      filterCriteria?: AppointmentFilterCriteria;
    },
  ) {
    this.logger.debug(
      `Finding all appointments with payload: ${JSON.stringify(payload)}`,
    );
    try {
      const { page, pageSize, filterCriteria } = payload;
      const result = await this.appointmentsService.findAll(
        page,
        pageSize,
        filterCriteria,
      );
      this.logger.debug('Retrieved appointments');
      return result;
    } catch (error) {
      this.logger.error('Failed to find all appointments');
      throw error;
    }
  }

  @MessagePattern(APPOINTMENTS_PATTERNS.FIND_ONE_APPOINTMENT)
  async findOne(@Payload() id: string) {
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
  ) {
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
  async remove(@Payload() id: string) {
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
  ) {
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
