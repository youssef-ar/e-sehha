import { NestFactory } from '@nestjs/core';
import { RecordModule } from './medical-records.module';
import { AllExceptionsFilter } from 'libs/common/filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from 'libs/common/interceptors/response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(RecordModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672'),
      ],
      queue: configService.get<string>(
        'RECORD_QUEUE',
        'record_queue',
      ),
      socketOptions: {
        timeout: 5000,
      },
    },
  });

  // Global setup
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  await app.startAllMicroservices();

  console.log(`✅ Medical Records microservice is now listening to RabbitMQ`);
}

bootstrap();