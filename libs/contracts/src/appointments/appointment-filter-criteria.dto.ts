import { AppointmentStatusEnum } from './appointment-status.enum';

export type AppointmentFilterCriteria = {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatusEnum;
  dateFrom?: Date;
  dateTo?: Date;
};
