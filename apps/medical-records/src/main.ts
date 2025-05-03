import { NestFactory } from '@nestjs/core';
import { RecordModule } from './medical-records.module';
import { AllExceptionsFilter } from 'libs/common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from 'libs/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(RecordModule);
  await app.listen(process.env.port ?? 3000);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalInterceptors(new ResponseInterceptor());

}
bootstrap();
