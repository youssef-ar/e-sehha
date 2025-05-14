import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { SseService } from './sse/sse.service';
import { SseController } from './sse/sse.controller';
import { EmailModule } from './email/email.module'; // ✅ Import EmailModule
import { SseModule } from './sse/sse.module'; // ✅


@Module({
  imports: [EmailModule, SseModule], // ✅ Register it here
  controllers: [NotificationsController, SseController],
  providers: [NotificationsService, EmailService, SmsService, SseService],
})
export class NotificationsModule {}