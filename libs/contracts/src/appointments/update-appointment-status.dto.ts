import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatusEnum } from './appointment-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'The new status of the appointment',
    enum: AppointmentStatusEnum,
    example: AppointmentStatusEnum.CONFIRMED,
  })
  @IsEnum(AppointmentStatusEnum)
  status: AppointmentStatusEnum;

  @ApiPropertyOptional({
    description: 'The ID of the user updating the status',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;
}
