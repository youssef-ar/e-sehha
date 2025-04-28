import { NestFactory } from '@nestjs/core';
import { RecordModule } from './medical-records.module';

async function bootstrap() {
  const app = await NestFactory.create(RecordModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
