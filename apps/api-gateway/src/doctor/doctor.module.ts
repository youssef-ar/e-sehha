import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DOCTOR_SERVICE, APPOINTMENTS_SERVICE } from '../constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: DOCTOR_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('DOCTOR_QUEUE', 'doctor_queue'),
            queueOptions: {
              durable: true,
            },
            socketOptions: {
              timeout: 5000,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: APPOINTMENTS_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>(
              'APPOINTMENTS_QUEUE',
              'appointments_queue',
            ),
            queueOptions: {
              durable: true,
            },
            socketOptions: {
              timeout: 5000,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
