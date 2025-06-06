import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsFutureDate } from '../validators';

export class RescheduleAppointmentDto {
  @ApiProperty({
    description: 'The new date and time for the appointment',
    example: '2025-06-16T11:00:00.000Z',
    type: Date,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsFutureDate({ message: 'New appointment date must be in the future.' })
  newDate: Date;

  @ApiPropertyOptional({
    description: 'The ID of the user rescheduling the appointment',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;
}
