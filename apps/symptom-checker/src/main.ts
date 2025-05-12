import { NestFactory } from '@nestjs/core';
import { SymptomCheckerModule } from './symptom-checker.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'libs/common/filters/rpc-exception.filter';
import { ResponseInterceptor } from 'libs/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(SymptomCheckerModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672')],
      queue: configService.get<string>('SYMPTOM_CHECKER_QUEUE', 'symptom_checker_queue'),
      socketOptions: {
        timeout: 5000,
      },
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(configService.get<number>('PORT', 3003)).then(() => {
    console.log(`✅ Symptom Checker microservice is now listening to RabbitMQ`);
  });

  await app.startAllMicroservices();
}
bootstrap();
