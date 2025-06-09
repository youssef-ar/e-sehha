import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Logger,
  HttpStatus,
  Query,
  Type,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  Appointment,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto,
} from '@app/contracts/appointments';
import { ResponseUtil } from '../utils/response.util';
import { PaginatedResponseDto } from '@app/contracts/pagination';
import { AuthGuard, CurrentUser } from '@app/shared-auth';

const ApiPaginatedResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  ApiOkResponse({
    schema: {
      title: `PaginatedResponseOf${dataDto.name}`,
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(dataDto) },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      ],
    },
  });

@UseGuards(AuthGuard)
@ApiTags('Appointments')
@Controller('appointments')
@ApiExtraModels(PaginatedResponseDto, Appointment)
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
    type: Appointment,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateAppointmentDto })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser('id') userId: string,
  ) {
    this.logger.debug(
      `Creating appointment: ${JSON.stringify(createAppointmentDto)}...`,
    );
    try {
      createAppointmentDto.patientId = userId;
      const result =
        await this.appointmentsService.create(createAppointmentDto);
      this.logger.debug('Appointment creation request processed');
      return ResponseUtil.success(
        'Appointment created successfully',
        result,
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error('Failed to create appointment', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all appointments with pagination and filtering',
  })
  @ApiPaginatedResponse(Appointment)
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async findAll(
    @Query() query: FindAllAppointmentsQueryDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    this.logger.debug(
      `Getting appointments with query: ${JSON.stringify(query)}`,
    );

    try {
      if (role !== 'doctor') {
        query.patientId = userId;
      }

      const result = await this.appointmentsService.findAll(query);
      this.logger.debug('Retrieved appointments');
      return ResponseUtil.success(
        'Appointments retrieved successfully',
        result,
      );
    } catch (error) {
      this.logger.error('Failed to retrieve appointments', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the appointment',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment details.',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    this.logger.debug(`Getting appointment with id: ${id}`);
    try {
      const result = await this.appointmentsService.findOne(id);
      this.logger.debug(`Retrieved appointment with id: ${id}`);
      return ResponseUtil.success('Appointment retrieved successfully', result);
    } catch (error) {
      this.logger.error(`Failed to retrieve appointment with id: ${id}`, error);
      throw error;
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an appointment' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the appointment',
    type: String,
  })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'The appointment status has been successfully updated.',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    this.logger.debug(
      `Updating appointment status ${id}: ${JSON.stringify(updateAppointmentStatusDto)}`,
    );
    try {
      updateAppointmentStatusDto.userId = userId;
      const result = await this.appointmentsService.updateStatus(
        id,
        updateAppointmentStatusDto,
      );
      this.logger.debug(`Updated appointment status with id: ${id}`);
      return ResponseUtil.success(
        'Appointment status updated successfully',
        result,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update appointment status with id: ${id}`,
        error,
      );
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the appointment',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    this.logger.debug(`Deleting appointment with id: ${id}`);
    try {
      await this.appointmentsService.remove(id);
      this.logger.debug(`Deleted appointment with id: ${id}`);
      return ResponseUtil.success('Appointment deleted successfully', { id });
    } catch (error) {
      this.logger.error(`Failed to delete appointment with id: ${id}`, error);
      throw error;
    }
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the appointment',
    type: String,
  })
  @ApiBody({ type: RescheduleAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully rescheduled.',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleAppointmentDto,
    @CurrentUser('id') userId: string,
  ) {
    this.logger.debug(
      `Rescheduling appointment ${id}: ${JSON.stringify(rescheduleDto)}`,
    );
    try {
      rescheduleDto.userId = userId;
      const result = await this.appointmentsService.reschedule(
        id,
        rescheduleDto,
      );
      this.logger.debug(`Rescheduled appointment with id: ${id}`);
      return ResponseUtil.success(
        'Appointment rescheduled successfully',
        result,
      );
    } catch (error) {
      this.logger.error(
        `Failed to reschedule appointment with id: ${id}`,
        error,
      );
      throw error;
    }
  }
}
