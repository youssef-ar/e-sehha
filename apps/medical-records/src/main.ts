import { NestFactory } from '@nestjs/core';
import { MedicalRecordsModule } from './medical-records.module';

async function bootstrap() {
  const app = await NestFactory.create(MedicalRecordsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
