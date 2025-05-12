import { Controller, Post, Get, Body, Param, Query, Headers, Logger, HttpStatus, Patch, Delete, UseGuards } from '@nestjs/common';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordService } from './record.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthGuard, CurrentUser } from '@app/shared-auth';


@UseGuards(AuthGuard)
@Controller('record')
@ApiTags('Record')
export class RecordController {
  private readonly logger = new Logger(RecordController.name);

  constructor(private readonly recordService: RecordService) {}

  @Post(':patientId')
  @ApiOperation({ summary: 'Create or update a medical record entry' })
  @ApiResponse({
    status: 201,
    description: 'Medical record entry created or updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({type: RecordEntryDto})
  async createOrUpdate(@Param('patientId') patientId: string, @Body() dto: RecordEntryDto) {
    this.logger.log(`Creating or updating record for patient: ${patientId}`);
    try {
      const result = await this.recordService.addOrUpdateMedicalRecord(patientId, dto);
      this.logger.log('Record creation/update request processed successfully');
      return ResponseUtil.success('Record created/updated successfully', result, HttpStatus.CREATED);
    } catch (error) {
      this.logger.error('Failed to create/update record', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all medical records for a doctor' })
  @ApiResponse({
    status: 200,
    description: 'List of medical records',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({type: RecordEntryDto})
  async findAll(
    @CurrentUser('id') doctorId: string,
    @Query('pageSize') pageSize: number = 10,
    @Query('page') page: number = 1,
  ) {
    this.logger.debug(`Finding all records for doctor: ${doctorId}, page: ${page}, pageSize: ${pageSize}`);
    try {
      const result = await this.recordService.findAll(doctorId, page, pageSize);
      this.logger.debug('Record retrieval request processed successfully');
      return ResponseUtil.success('Records retrieved successfully', result, HttpStatus.OK);
    } catch (error) {
      this.logger.error('Failed to retrieve records', error);
      throw error;
    }
  }

  @Patch(':patientId/:recordId')
  @ApiOperation({ summary: 'Update a record entry' })
  @ApiResponse({
    status: 200,
    description: 'Record entry updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({type: RecordEntryDto})
  async updateRecordEntry(
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body() dto: RecordEntryDto,
  )
  {
    this.logger.debug(`Updating record entry for patient: ${patientId}, recordId: ${recordId}`);
    try {
      const result = await this.recordService.updateRecordEntry(patientId, recordId, dto);
      this.logger.debug('Record entry update request processed successfully');
      return ResponseUtil.success('Record entry updated successfully', result, HttpStatus.OK);
    } catch (error) {
      this.logger.error('Failed to update record entry', error);
      throw error;
    }
  }


  @Patch(':patientId/:recordId/authorize')
  @ApiOperation({ summary: 'Authorize a doctor to audit a medical record' })
  @ApiResponse({
    status: 200,
    description: 'Doctor authorized to audit the medical record',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async authorizeAudit(
    @CurrentUser('id') doctorId: string,
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body('doctorIdToAdd') doctorIdToAdd: string,
  ) {
      this.logger.debug(`Authorizing doctor ${doctorIdToAdd} to audit record ${recordId} for patient ${patientId}`);
      try{
        const result = await this.recordService.giveDoctorAuthorizationToAuditRecord(
          doctorId,
          patientId,
          recordId,
          doctorIdToAdd,
        );
        this.logger.debug('Authorization request processed successfully');
        return ResponseUtil.success('Doctor authorized successfully', result, HttpStatus.OK);
      } catch (error) {
        this.logger.error('Failed to authorize doctor', error);
        throw error;
      }
  }

  @Get(':patientId')
  @ApiOperation({ summary: 'Find a specific medical record for a patient' })
  @ApiResponse({
    status: 200,
    description: 'Medical record found',
  })
  @ApiResponse({
    status: 404,
    description: 'Medical record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findOne(@Param('patientId') patientId: string, @CurrentUser('id') requesterId: string) {
    this.logger.debug(`Finding record for patient: ${patientId}, requester: ${requesterId}`);
    try {
      const result = await this.recordService.findOne(patientId, requesterId);
      this.logger.debug('Record retrieval request processed successfully');
      return ResponseUtil.success('Record retrieved successfully', result, HttpStatus.OK);
    } catch (error) {
      this.logger.error('Failed to retrieve record', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.debug(`Removing record with ID: ${id}`);
    try {
      const result = await this.recordService.remove(id);
      this.logger.debug('Record removal request processed successfully');
      return ResponseUtil.success('Record removed successfully', result, HttpStatus.OK);
    } catch (error) {
      this.logger.error('Failed to remove record', error);
      throw error;
    }
  }
}
