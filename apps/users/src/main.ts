import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.use(cookieParser());
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
