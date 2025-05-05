import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { RecordService } from './medical-records.service';
import { RecordEntryDto } from './dto/record-entry.dto';

@Controller()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @MessagePattern('record.createOrUpdate')
  createOrUpdateMedicalRecord(
    @Payload() data: { patientId: string; newEntry: RecordEntryDto },
    @Ctx() context: RmqContext,
  ) {
    const { patientId, newEntry } = data;
    return this.recordService.addOrUpdateMedicalRecord(patientId, newEntry);
  }

  @MessagePattern('record.findAll')
  findAll(
    @Payload() data: { doctorId: string; pageSize?: number; page?: number },
    @Ctx() context: RmqContext,
  ) {
    const { doctorId, page = 1, pageSize = 10 } = data;
    return this.recordService.findAll(doctorId, +page, +pageSize);
  }

  @MessagePattern('record.giveAuthorization')
  giveDoctorAuthorizationToAuditRecord(
    @Payload()
    data: {
      doctorId: string;
      patientId: string;
      recordId: string;
      doctorIdToAdd: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const { doctorId, patientId, recordId, doctorIdToAdd } = data;
    return this.recordService.giveDoctorAuthorizationToAuditRecord(
      doctorId,
      patientId,
      recordId,
      doctorIdToAdd,
    );
  }

  @MessagePattern('record.findOne')
  findOne(
    @Payload() data: { patientId: string; requesterId: string },
    @Ctx() context: RmqContext,
  ) {
    const { patientId, requesterId } = data;
    return this.recordService.findOne(patientId, requesterId);
  }

  @MessagePattern('record.remove')
  remove(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ) {
    return this.recordService.remove(id);
  }
}