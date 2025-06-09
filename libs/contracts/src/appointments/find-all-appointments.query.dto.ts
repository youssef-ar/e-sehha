import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatusEnum } from './appointment-status.enum';
import { PaginationQueryDto } from '../pagination';

export class FindAllAppointmentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by patient ID',
    type: String,
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Filter by doctor ID',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by appointment status',
    enum: AppointmentStatusEnum,
  })
  @IsOptional()
  @IsEnum(AppointmentStatusEnum)
  status?: AppointmentStatusEnum;

  @ApiPropertyOptional({
    description: 'Filter appointments by specific date',
    type: Date,
    example: '2025-05-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
