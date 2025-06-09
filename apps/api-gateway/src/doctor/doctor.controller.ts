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
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '@app/contracts/doctor/create-doctor.dto';
import { ResponseUtil } from '../utils/response.util';
import { RescheduleAppointmentDto } from '@app/contracts/appointments';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { AuthGuard, CurrentUser } from '@app/shared-auth';

//@UseGuards(AuthGuard)
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
  async registerDoctor(
    @Body() dto: CreateDoctorDto,
    @CurrentUser('id') userId: string,
  ) {
    this.logger.debug(`Registering doctor: ${JSON.stringify(dto)}`);
    try {
      //dto.userId = userId;
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

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  @UseGuards(AuthGuard)
  async getDoctors() {
    try {
      const result = await this.doctorService.getDoctors();
      return ResponseUtil.success('Doctors retrieved', result, HttpStatus.OK);
    } catch (err) {
      this.logger.error('Failed to get doctors', err);
      throw err;
    }
  }

  @Patch('appointments/:id/accept')
  @ApiOperation({ summary: 'Accept an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment accepted' })
  @UseGuards(AuthGuard)
  async accept(@Param('id') id: string, @CurrentUser('id') doctorId: string) {
    this.logger.debug(`Doctor ${doctorId} accepting appointment ${id}`);
    const result = await this.doctorService.acceptAppointment(id);
    return ResponseUtil.success('Appointment accepted', result, HttpStatus.OK);
  }

  @Patch('appointments/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: RescheduleAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled' })
  @UseGuards(AuthGuard)
  async reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
    @CurrentUser('id') doctorId: string,
  ) {
    this.logger.debug(`Doctor ${doctorId} rescheduling appointment ${id}`);
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
  @UseGuards(AuthGuard)
  async cancel(@Param('id') id: string, @CurrentUser('id') doctorId: string) {
    this.logger.debug(`Doctor ${doctorId} cancelling appointment ${id}`);
    const result = await this.doctorService.cancelAppointment(id);
    return ResponseUtil.success('Appointment cancelled', result, HttpStatus.OK);
  }

  @Post('records/:patientId')
  @ApiOperation({ summary: 'Create or update a medical record entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiBody({ type: RecordEntryDto })
  @ApiResponse({
    status: 201,
    description: 'Medical record entry created/updated',
  })
  @UseGuards(AuthGuard)
  async createOrUpdateMedicalRecord(
    @Param('patientId') patientId: string,
    @Body() entry: RecordEntryDto,
  ) {
    this.logger.debug(
      `Creating/updating medical record for patient ${patientId}`,
    );
    const result = await this.doctorService.createOrUpdateMedicalRecord(
      patientId,
      entry,
    );
    return ResponseUtil.success(
      'Medical record entry created/updated',
      result,
      HttpStatus.CREATED,
    );
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all patient records' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of patient records' })
  @UseGuards(AuthGuard)
  async getAllPatientRecords(
    @Req() req,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    this.logger.debug(`Getting all patient records for doctor ${req.user.id}`);
    const result = await this.doctorService.getAllPatientRecords(
      req.user.id,
      page,
      pageSize,
    );
    return ResponseUtil.success(
      'Patient records retrieved',
      result,
      HttpStatus.OK,
    );
  }

  @Get('records/:patientId')
  @ApiOperation({ summary: 'Get a specific patient record' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient record details' })
  @UseGuards(AuthGuard)
  async getPatientRecord(@Param('patientId') patientId: string, @Req() req) {
    this.logger.debug(`Getting record for patient ${patientId}`);
    const result = await this.doctorService.getPatientRecord(
      patientId,
      req.user.id,
    );
    return ResponseUtil.success(
      'Patient record retrieved',
      result,
      HttpStatus.OK,
    );
  }

  @Patch('records/:patientId/:recordId')
  @ApiOperation({ summary: 'Update a specific record entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiParam({ name: 'recordId', description: 'Record ID' })
  @ApiBody({ type: RecordEntryDto })
  @ApiResponse({ status: 200, description: 'Record entry updated' })
  @UseGuards(AuthGuard)
  async updateRecordEntry(
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body() entry: RecordEntryDto,
  ) {
    this.logger.debug(
      `Updating record entry ${recordId} for patient ${patientId}`,
    );
    const result = await this.doctorService.updateRecordEntry(
      patientId,
      recordId,
      entry,
    );
    return ResponseUtil.success('Record entry updated', result, HttpStatus.OK);
  }

  @Post('records/:patientId/:recordId/authorize')
  @ApiOperation({
    summary: 'Authorize another doctor to access a medical record',
  })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiParam({ name: 'recordId', description: 'Record ID' })
  @ApiBody({ type: String, description: 'Doctor ID to authorize' })
  @ApiResponse({ status: 200, description: 'Doctor authorized successfully' })
  @UseGuards(AuthGuard)
  async authorizeDoctorForRecord(
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body('doctorId') doctorIdToAdd: string,
    @Req() req,
  ) {
    this.logger.debug(
      `Authorizing doctor ${doctorIdToAdd} for record ${recordId}`,
    );
    const result = await this.doctorService.authorizeDoctorForRecord(
      req.user.id,
      patientId,
      recordId,
      doctorIdToAdd,
    );
    return ResponseUtil.success(
      'Doctor authorized successfully',
      result,
      HttpStatus.OK,
    );
  }

  @Delete('records/:patientId')
  @ApiOperation({ summary: 'Remove a patient record' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient record removed' })
  @UseGuards(AuthGuard)
  async removePatientRecord(@Param('patientId') patientId: string) {
    this.logger.debug(`Removing record for patient ${patientId}`);
    const result = await this.doctorService.removePatientRecord(patientId);
    return ResponseUtil.success(
      'Patient record removed',
      result,
      HttpStatus.OK,
    );
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get doctor profile with availability' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({
    status: 200,
    description: 'Doctor profile retrieved successfully',
  })
  @UseGuards(AuthGuard)
  async getDoctorProfile(@Param('id') id: string) {
    this.logger.debug(`Getting profile for doctor ${id}`);
    const result = await this.doctorService.getDoctorProfile(id);
    return ResponseUtil.success(
      'Doctor profile retrieved',
      result,
      HttpStatus.OK,
    );
  }
}
