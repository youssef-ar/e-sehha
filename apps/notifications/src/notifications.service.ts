import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { SseService } from './sse/sse.service';
import { NotifyDto } from './dto/notify.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly sseService: SseService,
  ) {}

  async sendNotification(dto: NotifyDto) {
    const { email, phone, subject, message } = dto;

    if (email && subject && message) {
      await this.emailService.sendEmail(email, subject, message);
    }

    /*if (phone && message) {
      await this.smsService.sendSms(phone, message);
    }*/

    if (message) {
      this.sseService.sendNotification(message);
    }

    return { status: 'Notification sent successfully' };
  }
}
