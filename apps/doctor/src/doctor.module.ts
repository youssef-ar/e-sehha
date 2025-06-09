import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from './doctor.repository';
import { DoctorSchema } from './schema/doctor.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/doctor/.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017',
        ),
        dbName: 'e-sihha',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]),
    ClientsModule.registerAsync([
          {
            name: 'NOTIFICATIONS_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
                queue: configService.get<string>('NOTIFICATIONS_QUEUE', 'notifications_queue'),
                queueOptions: { durable: true },
              },
            }),
            inject: [ConfigService],
          },
        ]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository],
})
export class DoctorModule {}
