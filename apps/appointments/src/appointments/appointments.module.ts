import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { AppointmentsRepository } from './appointments.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [AppointmentsController],
  imports: [EventEmitterModule.forRoot()],
  providers: [
    AppointmentsService,
    {
      provide: IAppointmentsRepository,
      useClass: AppointmentsRepository,
    },
  ],
})
export class AppointmentsModule {}
