import { Module } from '@nestjs/common';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { EmailModule } from './email/email.module'; 
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { SharedAuthModule } from '@app/shared-auth';



@Module({
  imports: [EmailModule,EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),SharedAuthModule], 
  controllers: [NotificationController],
  providers: [NotificationService, EmailService, SmsService],
})
export class NotificationsModule {}