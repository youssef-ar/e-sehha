import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Logger,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/contracts/appointments';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth('access-token')
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    this.logger.debug(
      `Creating appointment: ${JSON.stringify(createAppointmentDto)}...`,
    );
    const result = await this.appointmentsService.create(createAppointmentDto);
    this.logger.debug('Appointment creation request processed');
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments' })
  async findAll() {
    this.logger.debug('Getting all appointments...');
    const result = await this.appointmentsService.findAll();
    this.logger.debug('Retrieved all appointments');
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Return the appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string) {
    this.logger.debug(`Getting appointment with id: ${id}`);
    const result = await this.appointmentsService.findOne(id);
    this.logger.debug(`Retrieved appointment with id: ${id}`);
    return result;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({
    status: 200,
    description: 'Appointment status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    this.logger.debug(
      `Updating appointment status ${id}: ${JSON.stringify(updateAppointmentStatusDto)}`,
    );
    const result = await this.appointmentsService.updateStatus(
      id,
      updateAppointmentStatusDto,
    );
    this.logger.debug(`Updated appointment status with id: ${id}`);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async remove(@Param('id') id: string) {
    this.logger.debug(`Deleting appointment with id: ${id}`);
    const result = await this.appointmentsService.remove(id);
    this.logger.debug(`Deleted appointment with id: ${id}`);
    return result;
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment rescheduled successfully',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleAppointmentDto,
  ) {
    this.logger.debug(
      `Rescheduling appointment ${id}: ${JSON.stringify(rescheduleDto)}`,
    );
    const result = await this.appointmentsService.reschedule(id, rescheduleDto);
    this.logger.debug(`Rescheduled appointment with id: ${id}`);
    return result;
  }
}
