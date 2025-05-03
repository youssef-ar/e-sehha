import { IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
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
}
