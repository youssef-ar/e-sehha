import {
  Body,
  Controller,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Observable, filter, fromEventPattern, map } from 'rxjs';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications/notifications.patterns';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Channel } from './enums/channel.enum';
import { AuthGuard, CurrentUser } from '@app/shared-auth';
import { EventPattern } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly eventEmitter: EventEmitter2, 
  ) {}

  @Post('send')
  async send(@Body() dto: CreateNotificationDto) {
    await this.service.dispatch(dto);
    return { status: 'queued' };
  }
  @EventPattern(NOTIFICATIONS_PATTERNS.UPCUMMING_APPOINTMENTS)
async handleUpcomingAppointment(data: any) {
  console.log('Received upcoming appointment notification:', data);
  
  await this.service.dispatch(data);
  
  this.eventEmitter.emit(data.type, data);
}

@EventPattern(NOTIFICATIONS_PATTERNS.RESCHEDULED_APPOINTMENTS)
async handleRescheduledAppointment(data: any) {
  console.log('Received rescheduled appointment notification:', data);
  
  await this.service.dispatch(data);
  
  this.eventEmitter.emit(data.type, data);
}

@EventPattern(NOTIFICATIONS_PATTERNS.CANCELED_APPOINTMENTS)
async handleCancelledAppointment(data: any) {
  console.log('Received cancelled appointment notification:', data);
  
  await this.service.dispatch(data);
  
  this.eventEmitter.emit(data.type, data);
}
  
  @Sse('sse')
  @UseGuards(AuthGuard)
  sse(@CurrentUser('id') userId: string): Observable<{ data: any; type?: string }> {
    const eventNames = Object.values(NOTIFICATIONS_PATTERNS);

    return fromEventPattern(
      (handler) => {
        for (const eventName of eventNames) {
          this.eventEmitter.on(eventName, handler);
        }
      },
      (handler) => {
        for (const eventName of eventNames) {
          this.eventEmitter.off(eventName, handler);
        }
      },
    ).pipe(
      filter((event: any) => {
        console.log('Received event:', event);
        console.log('User ID:', userId);

        console.log('Channels:', event.channels.includes(Channel.SSE));
        return (event.userId === userId && event.channels.includes(Channel.SSE));
      }),
      map((event: any) => {
        const eventType = event.type;
        return new MessageEvent(eventType, { data: event });
      }),
    );
  }
}
