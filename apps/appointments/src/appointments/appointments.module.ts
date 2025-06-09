import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { AppointmentsRepository } from './appointments.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppointmentsController],
  imports: [EventEmitterModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: configService.get<string>('NOTIFICATIONS_QUEUE', 'notifications_queue'),
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'DOCTOR_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: configService.get<string>('DOCTOR_QUEUE', 'doctor_queue'),
            queueOptions: { durable: true },
            socketOptions: { timeout: 5000 },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: configService.get<string>('USERS_QUEUE', 'users_queue'),
            queueOptions: { durable: true },
            socketOptions: { timeout: 5000 },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    
  ],
  providers: [
    AppointmentsService,
    {
      provide: IAppointmentsRepository,
      useClass: AppointmentsRepository,
    },
  ],
})
export class AppointmentsModule {}
