import { IsEnum } from 'class-validator';
import { AppointmentStatusEnum } from './appointment-status.enum';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatusEnum)
  status: AppointmentStatusEnum;
}
