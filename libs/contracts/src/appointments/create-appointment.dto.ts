import { IsDate, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
