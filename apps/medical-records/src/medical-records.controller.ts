import { Controller, Get, Post, Body, Param, Delete, Query, Request, Headers, UseGuards } from '@nestjs/common';
import { RecordService } from './medical-records.service';
import { RecordEntryDto } from './dto/record-entry.dto';
///import { AuthGuard } from '@app/shared-auth/guards/auth.guard';

@Controller('record')
///@UseGuards(AuthGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post(':patientId')
  createOrUpdateMedicalRecord(
    @Param('patientId') patientId: string,
    @Body() newEntry: RecordEntryDto
  ) {
    return this.recordService.addOrUpdateMedicalRecord(patientId, newEntry);
  }


  @Get()
  findAll(
    @Headers('doctorId') doctorId: string,
    @Query('pageSize') pageSize: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.recordService.findAll(doctorId, +page, +pageSize);
  }

  @Post(':patientId/:recordId')
  giveDoctorAuthorizationToAuditRecord(
    @Headers('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body('doctorIdToAdd') doctorIdToAdd: string
  )
  {
    return this.recordService.giveDoctorAuthorizationToAuditRecord(doctorId, patientId, recordId, doctorIdToAdd);
  }


  @Get(':patientId')
  findOne(
    @Param('patientId') patientId: string,
    @Request() req,
  )
  {
    return this.recordService.findOne(patientId, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(id);
  }
}