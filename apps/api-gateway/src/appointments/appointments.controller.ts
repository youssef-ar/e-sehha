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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  AppointmentFilterCriteria,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/contracts/appointments';
import { ResponseUtil } from '../utils/response.util';
import { AppointmentStatusEnum } from '@app/contracts/appointments/appointment-status.enum';
import { FindAllAppointmentsQueryDto } from './dto/find-all-appointments.query.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
    schema: {
      example: {
        status: 'success',
        statusCode: 201,
        message: 'Appointment created successfully',
        data: {
          id: '12345',
          patientId: '67890',
          doctorId: '54321',
          date: '2025-05-10T10:00:00.000Z',
          status: 'PENDING',
          createdAt: '2025-05-01T10:00:00.000Z',
          updatedAt: '2025-05-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({
    description: 'Details of the appointment to be created',
    type: CreateAppointmentDto,
    required: true,
    examples: {
      example1: {
        value: {
          patientId: '67890',
          doctorId: '54321',
          date: '2025-05-10T10:00:00.000Z',
        },
        description: 'Example of a valid appointment creation request',
      },
      example2: {
        value: {
          patientId: '67890',
          doctorId: '54321',
          date: 'invalid-date-format',
        },
        description: 'Example of an invalid appointment creation request',
      },
    },
  })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    this.logger.debug(
      `Creating appointment: ${JSON.stringify(createAppointmentDto)}...`,
    );
    try {
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'patientId',
    required: false,
    type: String,
    description: 'Filter by patient ID',
  })
  @ApiQuery({
    name: 'doctorId',
    required: false,
    type: String,
    description: 'Filter by doctor ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: AppointmentStatusEnum,
    description: 'Filter by appointment status',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: Date,
    description: 'Filter appointments from this date',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: Date,
    description: 'Filter appointments up to this date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments with pagination metadata.',
    schema: {
      example: {
        status: 'success',
        statusCode: 200,
        message: 'Appointments retrieved successfully',
        data: {
          appointments: [
            {
              id: '12345',
              patientId: '67890',
              doctorId: '54321',
              date: '2025-05-10T10:00:00.000Z',
              status: 'PENDING',
              createdAt: '2025-05-01T10:00:00.000Z',
              updatedAt: '2025-05-01T10:00:00.000Z',
            },
          ],
          total: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async findAll(@Query() query: FindAllAppointmentsQueryDto) {
    this.logger.debug(
      `Getting appointments with query: ${JSON.stringify(query)}`,
    );

    const filterCriteria: AppointmentFilterCriteria = {
      patientId: query.patientId,
      doctorId: query.doctorId,
      status: query.status,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    try {
      const result = await this.appointmentsService.findAll(
        query.page,
        query.pageSize,
        filterCriteria,
      );
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
    example: '12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment details.',
    schema: {
      example: {
        status: 'success',
        statusCode: 200,
        message: 'Appointment retrieved successfully',
        data: {
          id: '12345',
          patientId: '67890',
          doctorId: '54321',
          date: '2025-05-10T10:00:00.000Z',
          status: 'PENDING',
          createdAt: '2025-05-01T10:00:00.000Z',
          updatedAt: '2025-05-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async findOne(@Param('id') id: string) {
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
    example: '12345',
  })
  @ApiBody({
    description: 'Details of the new appointment status',
    type: UpdateAppointmentStatusDto,
    required: true,
    examples: {
      example1: {
        value: {
          status: 'CONFIRMED',
        },
        description: 'Example of a valid appointment status update request',
      },
      example2: {
        value: {
          status: 'INVALID_STATUS',
        },
        description: 'Example of an invalid appointment status update request',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment status has been successfully updated.',
    schema: {
      example: {
        status: 'success',
        statusCode: 200,
        message: 'Appointment status updated successfully',
        data: {
          id: '12345',
          patientId: '67890',
          doctorId: '54321',
          date: '2025-05-10T10:00:00.000Z',
          status: 'CONFIRMED',
          createdAt: '2025-05-01T10:00:00.000Z',
          updatedAt: '2025-05-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    this.logger.debug(
      `Updating appointment status ${id}: ${JSON.stringify(updateAppointmentStatusDto)}`,
    );
    try {
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
    example: '12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully deleted.',
    schema: {
      example: {
        status: 'success',
        statusCode: 200,
        message: 'Appointment deleted successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async remove(@Param('id') id: string) {
    this.logger.debug(`Deleting appointment with id: ${id}`);
    try {
      await this.appointmentsService.remove(id);
      this.logger.debug(`Deleted appointment with id: ${id}`);
      return ResponseUtil.success('Appointment deleted successfully', null);
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
    example: '12345',
  })
  @ApiBody({
    description: 'Details of the new appointment date',
    type: RescheduleAppointmentDto,
    required: true,
    examples: {
      example1: {
        value: {
          date: '2035-05-15T10:00:00.000Z',
        },
        description: 'Example of a valid appointment reschedule request',
      },
      example2: {
        value: {
          date: 'invalid-date-format',
        },
        description: 'Example of an invalid appointment reschedule request',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully rescheduled.',
    schema: {
      example: {
        status: 'success',
        statusCode: 200,
        message: 'Appointment rescheduled successfully',
        data: {
          id: '12345',
          patientId: '67890',
          doctorId: '54321',
          date: '2025-05-15T10:00:00.000Z',
          status: 'PENDING',
          createdAt: '2025-05-01T10:00:00.000Z',
          updatedAt: '2025-05-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleAppointmentDto,
  ) {
    this.logger.debug(
      `Rescheduling appointment ${id}: ${JSON.stringify(rescheduleDto)}`,
    );
    try {
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
