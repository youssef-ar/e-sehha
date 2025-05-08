import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env.validation';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { APP_GUARD } from '@nestjs/core';
import { RecordModule } from './record/record.module';
import { SymptomCheckerModule } from './symptom-checker/symptom-checker.module';
import { UsersService } from './users/users.service';

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
    RecordModule,
    SymptomCheckerModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    UsersService,
  ],
})
export class ApiGatewayModule {}
