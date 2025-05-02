import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APPOINTMENTS_SERVICE } from '../constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: APPOINTMENTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.APPOINTMENTS_QUEUE || 'appointments_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
