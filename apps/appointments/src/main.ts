import { NestFactory } from '@nestjs/core';
import { AppointmentsAppModule } from './appointments-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppointmentsAppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
      ],
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
  });

  await app.startAllMicroservices();
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
}

void bootstrap();
