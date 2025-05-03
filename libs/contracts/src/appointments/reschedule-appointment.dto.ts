import { IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../validators/is-future-date.validator';

export class RescheduleAppointmentDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsFutureDate({ message: 'New appointment date must be in the future.' })
  newDate: Date;
}
