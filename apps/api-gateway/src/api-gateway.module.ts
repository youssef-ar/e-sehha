import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: '.env',
    }),
    RateLimiterModule.register({
      for: 'Express',
      type: 'Memory',
      keyPrefix: 'global',
      points: 10,
      duration: 60,
    }),
    AppointmentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class ApiGatewayModule {}
