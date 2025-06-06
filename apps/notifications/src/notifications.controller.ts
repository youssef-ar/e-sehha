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
import { AuthGuard } from '@app/shared-auth';

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
  
  @Sse('sse')
  @UseGuards(AuthGuard)
  sse(userId: string): Observable<{ data: any; type?: string }> {
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
        return (event.userId === userId && event.channels.includes(Channel.SSE));
      }),
      map((event: any) => {
        const eventType = event.type;
        return new MessageEvent(eventType, { data: event });
      }),
    );
  }
}
