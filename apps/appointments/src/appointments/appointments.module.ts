import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { AppointmentsRepository } from './appointments.repository';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    {
      provide: IAppointmentsRepository,
      useClass: AppointmentsRepository,
    },
  ],
})
export class AppointmentsModule {}
