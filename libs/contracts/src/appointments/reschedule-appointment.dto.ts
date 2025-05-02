import { IsDate, IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class RescheduleAppointmentDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  newDate: Date;
}
