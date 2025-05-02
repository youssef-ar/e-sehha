import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AppointmentsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppointmentsAppModule {}
