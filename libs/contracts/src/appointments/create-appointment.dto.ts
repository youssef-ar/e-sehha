import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../validators/is-future-date.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'The ID of the patient', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'The ID of the doctor', example: 'doctor-456' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({
    description: 'The date and time of the appointment',
    example: '2025-06-15T10:00:00.000Z',
    type: Date,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsFutureDate({ message: 'Appointment date must be in the future.' })
  date: Date;
}
