import { Controller, Get, Post, Body, Param, Delete, Query, Request } from '@nestjs/common';
import { RecordService } from './medical-records.service';
import { RecordEntryDto } from './dto/record-entry.dto';

@Controller('record')
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
    @Request() req,
    @Query('pageSize') pageSize: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.recordService.findAll(req.user.id, +page, +pageSize);
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
    return this.recordService.remove(+id);
  }
}