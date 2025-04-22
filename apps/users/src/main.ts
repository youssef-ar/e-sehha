import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST || 'localhost',
        port: parseInt(process.env.PORT ?? '3000', 10),
      },
    },
  );
  await app.listen();
}
bootstrap();
