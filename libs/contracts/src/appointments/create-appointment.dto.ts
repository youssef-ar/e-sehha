import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../validators/is-future-date.validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsFutureDate({ message: 'Appointment date must be in the future.' })
  date: Date;
}
