import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../validators';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'The ID of the patient', example: 'user-123' })
  @IsString()
  //@IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'The ID of the doctor', example: 'doctor-456' })
  @IsString()
  //@IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({
    description: 'The ID of the user creating the appointment',
    example: 'user-789',
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  userId?: string;

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
