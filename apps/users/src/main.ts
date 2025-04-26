import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const config = new DocumentBuilder()
  .setTitle('Users API')
  .setDescription('Users API description')
  .setVersion('1.0')
  .addTag('users')
  .build();
  const documentFactory = ()=> SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory())
  app.use(cookieParser());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
