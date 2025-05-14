import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.enableCors(); // Allow SSE
  await app.listen(3001);
}
bootstrap();