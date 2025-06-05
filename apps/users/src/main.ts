import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  /* const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('Users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory()); */
  app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
        ],
        queue: configService.get<string>(
          'USERS_QUEUE',
          'users_queue',
        ),
        queueOptions: {
          durable: true,
        },
        socketOptions: {
          timeout: 5000,
        },
      },
    });
  app.use(cookieParser());
  await app.startAllMicroservices();
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
}
bootstrap();
