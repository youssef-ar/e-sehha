import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from './doctor.repository';
import { DoctorSchema } from './schema/doctor.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/doctor/.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: 'e-sihha',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository],
})
export class DoctorModule {}
