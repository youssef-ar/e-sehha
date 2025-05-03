import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrismaModule } from './prisma/prisma.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { PrismaHealthIndicator } from './health/prisma-health.indicator';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation'; // Import the schema

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: '.env',
    }),
    AppointmentsModule,
    PrismaModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class AppointmentsAppModule {}
