import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Logger,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { VerifyDoctorDto } from '@app/contracts/doctor/verify-doctor.dto';
import { ResponseUtil } from '../utils/response.util';
import { RescheduleAppointmentDto } from '@app/contracts/appointments';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  private readonly logger = new Logger(DoctorController.name);

  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new doctor' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({
    status: 201,
    description: 'Doctor created successfully',
  })
  async registerDoctor(@Body() dto: CreateDoctorDto) {
    this.logger.debug(`Registering doctor: ${JSON.stringify(dto)}`);
    try {
      const result = await this.doctorService.registerDoctor(dto);
      return ResponseUtil.success(
        'Doctor registered',
        result,
        HttpStatus.CREATED,
      );
    } catch (err) {
      this.logger.error('Failed to register doctor', err);
      throw err;
    }
  }

  @Patch('appointments/:id/accept')
  @ApiOperation({ summary: 'Accept an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment accepted' })
  async accept(@Param('id') id: string) {
    this.logger.debug(`Doctor accepting appointment ${id}`);
    const result = await this.doctorService.acceptAppointment(id);
    return ResponseUtil.success('Appointment accepted', result, HttpStatus.OK);
  }

  @Patch('appointments/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: RescheduleAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled' })
  async reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    this.logger.debug(`Doctor rescheduling appointment ${id}`);
    const result = await this.doctorService.rescheduleAppointment(id, dto);
    return ResponseUtil.success(
      'Appointment rescheduled',
      result,
      HttpStatus.OK,
    );
  }

  @Patch('appointments/:id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled' })
  async cancel(@Param('id') id: string) {
    this.logger.debug(`Doctor cancelling appointment ${id}`);
    const result = await this.doctorService.cancelAppointment(id);
    return ResponseUtil.success('Appointment cancelled', result, HttpStatus.OK);
  }
}
