import { Injectable } from '@nestjs/common';
import { RecordEntryDto } from './dto/record-entry.dto';

@Injectable()
export class RecordService {
  create(createRecordDto: RecordEntryDto) {
    return 'This action adds a new record';
  }

  findAll() {
    return `This action returns all record`;
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: RecordEntryDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
  
}
