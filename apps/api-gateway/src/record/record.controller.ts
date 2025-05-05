import { Controller, Post, Get, Body, Param, Query, Headers, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RecordEntryDto } from './dto/record-entry.dto';

@Controller('record')
export class RecordController {
  constructor(@Inject('RECORD_SERVICE') private readonly client: ClientProxy) {}

  @Post(':patientId')
  createOrUpdate(@Param('patientId') patientId: string, @Body() dto: RecordEntryDto) {
    return this.client.send('record.createOrUpdate', { patientId, newEntry: dto });
  }

  @Get()
  findAll(
    @Headers('doctorId') doctorId: string,
    @Query('pageSize') pageSize: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.client.send('record.findAll', { doctorId, pageSize, page });
  }

  @Post(':patientId/:recordId')
  authorizeAudit(
    @Headers('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body('doctorIdToAdd') doctorIdToAdd: string,
  ) {
    return this.client.send('record.giveAuthorization', {
      doctorId,
      patientId,
      recordId,
      doctorIdToAdd,
    });
  }

  @Get(':patientId')
  findOne(@Param('patientId') patientId: string, @Headers('userId') requesterId: string) {
    return this.client.send('record.findOne', { patientId, requesterId });
  }

  @Post('delete/:id')
  remove(@Param('id') id: string) {
    return this.client.send('record.remove', id);
  }
}
