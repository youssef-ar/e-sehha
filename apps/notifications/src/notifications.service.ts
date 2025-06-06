import { Injectable } from '@nestjs/common';
import { filter, fromEventPattern, map, Observable, Subject } from 'rxjs';
import { Channel } from './enums/channel.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications/notifications.patterns';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async dispatch(dto: CreateNotificationDto) {
    const { title, message } = dto;

    // SSE
    /* if (dto.channels.includes(Channel.SSE)) {
      this.sse(dto.userId);
    }
 */
    // Email
    if (dto.channels.includes(Channel.EMAIL) && dto.email) {
      await this.emailService.send(dto.email, title, message);
    }

    // SMS
    if (dto.channels.includes(Channel.SMS) && dto.phone) {
      await this.smsService.send(dto.phone, `${title}: ${message}`);
    }
  }

  
  
}
