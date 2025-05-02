import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
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
  async findAll() {
    this.logger.debug('Finding all appointments');
    try {
      const result = await this.appointmentsService.findAll();
      this.logger.debug('Retrieved all appointments');
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

  @MessagePattern(APPOINTMENTS_PATTERNS.UPDATE_APPOINTMENT)
  async update(
    @Payload()
    payload: {
      id: string;
      updateAppointmentDto: UpdateAppointmentDto;
    },
  ) {
    this.logger.debug(
      `Updating appointment ${payload.id}: ${JSON.stringify(payload.updateAppointmentDto)}`,
    );
    try {
      const result = await this.appointmentsService.update(
        payload.id,
        payload.updateAppointmentDto,
      );
      this.logger.debug(`Updated appointment with ID: ${payload.id}`);
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
}
