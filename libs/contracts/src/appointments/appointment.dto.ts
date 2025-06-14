import {
  AppointmentStatus,
  AppointmentType,
  Appointment as PrismaAppointment,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatusEnum } from './appointment-status.enum';
import { AppointmentTypeEnum } from './appointment-type.enum';

export class Appointment implements PrismaAppointment {
  @ApiProperty({
    example: 'clwz1q1z00000unqn9q7a7q7a',
    description: 'Unique identifier for the appointment',
  })
  id: string;

  @ApiProperty({
    example: 'user_2g...',
    description: 'Identifier for the patient',
  })
  patientId: string;
  @ApiProperty({
    example: 'Dr. John Doe',
    description: 'Name of the doctor for the appointment',
    type: String,
    maxLength: 100,
    minLength: 3,
  })
  doctorName: string;

  @ApiProperty({
    example: 'johndoe@exemple.com',
    description: 'email of the doctor',
  })
  email: string;

  @ApiProperty({
    example: 'user_2g...',
    description: 'Identifier for the patient',
  })
  patientName: string;

  @ApiProperty({
    example: 'user_2f...',
    description: 'Identifier for the doctor',
  })
  doctorId: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-06-15T10:00:00.000Z',
    description: 'Date and time of the appointment',
  })
  date: Date;

  @ApiProperty({
    enum: AppointmentStatusEnum,
    example: AppointmentStatusEnum.PENDING,
    description: 'Status of the appointment',
  })
  status: AppointmentStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-05-03T12:00:00.000Z',
    description: 'Timestamp when the appointment was created',
  })
  createdAt: Date;
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-05-03T12:05:00.000Z',
    description: 'Timestamp when the appointment was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: String,
    example: '10:00',
    description: 'Time of the appointment',
  })
  time: string;

  @ApiProperty({
    type: Number,
    example: 150.00,
    description: 'Price of the appointment',
  })
  price: number;
  @ApiProperty({
    enum: AppointmentTypeEnum,
    example: AppointmentTypeEnum.IN_PERSON,
    description: 'Type of the appointment',
  })
  type: AppointmentType;

  
}

export type { PrismaAppointment };