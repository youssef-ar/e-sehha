import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}