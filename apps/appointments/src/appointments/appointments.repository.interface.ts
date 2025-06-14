import { Appointment } from '@prisma/client';
import {
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
  FindAllAppointmentsQueryDto,
} from '@app/contracts/appointments';

export interface IAppointmentsRepository {
  create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
  findAll(query: FindAllAppointmentsQueryDto): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment>;
  delete(id: string): Promise<Appointment>;
  reschedule(
    id: string,
    rescheduleDto: RescheduleAppointmentDto,
  ): Promise<Appointment>;
  exists(id: string): Promise<boolean>;
}

export const IAppointmentsRepository = Symbol('IAppointmentsRepository');
