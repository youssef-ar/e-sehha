import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordEntryDto } from './dto/record-entry.dto';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  create(@Body() createRecordDto: RecordEntryDto) {
    return this.recordService.create(createRecordDto);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: RecordEntryDto) {
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
