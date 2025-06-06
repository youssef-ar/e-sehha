import { Module } from '@nestjs/common';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { EmailModule } from './email/email.module'; 
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedAuthModule } from '@app/shared-auth';
import { ClientsModule, Transport } from '@nestjs/microservices';



@Module({
  imports: [EmailModule,EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),SharedAuthModule,
  ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: configService.get<string>('NOTIFICATIONS_QUEUE', 'notifications_queue'),
            queueOptions: { 
              durable: true,
              arguments: {
                'x-message-ttl': 60000, 
              }
            },
            prefetchCount: 1, 
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ], 
  controllers: [NotificationController],
  providers: [NotificationService, EmailService, SmsService],
})
export class NotificationsModule {}