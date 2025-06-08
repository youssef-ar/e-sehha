import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPositive,
} from '@nestjs/class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../validators';
import { AppointmentTypeEnum } from './appointment-type.enum';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'The ID of the patient', example: 'user-123' })
  @IsString()
  //@IsUUID()
  @IsOptional()
  patientId?: string;

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
  //@IsUUID()
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

  @ApiProperty({
    description: 'The time of the appointment',
    example: '10:00',
  })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    description: 'The price of the appointment',
    example: 150.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The type of the appointment',
    enum: AppointmentTypeEnum,
    example: AppointmentTypeEnum.IN_PERSON,
  })
  @IsEnum(AppointmentTypeEnum)
  @IsNotEmpty()
  type: AppointmentTypeEnum;
}
