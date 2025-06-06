import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
      ],
      queue: configService.get<string>(
        'NOTIFICATIONS_QUEUE',
        'notifications_queue',
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
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);

}

void bootstrap();