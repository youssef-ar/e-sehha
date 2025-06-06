import { NestFactory } from '@nestjs/core';
import { DoctorModule } from './doctor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(DoctorModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
      ],
      queue: configService.get<string>('DOCTOR_QUEUE', 'doctor_queue'),
      queueOptions: {
        durable: true,
      },
      socketOptions: {
        timeout: 5000,
      },
    },
  });

  await app.startAllMicroservices();
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
