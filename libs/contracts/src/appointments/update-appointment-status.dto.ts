import { IsEnum } from 'class-validator';
import { AppointmentStatusEnum } from './appointment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'The new status of the appointment',
    enum: AppointmentStatusEnum,
    example: AppointmentStatusEnum.CONFIRMED,
  })
  @IsEnum(AppointmentStatusEnum)
  status: AppointmentStatusEnum;
}
