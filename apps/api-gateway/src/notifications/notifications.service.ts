import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from '../utils/error-handler.util';
import { NOTIFICATIONS_SERVICE } from '../constants';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NOTIFICATIONS_SERVICE) private notificationsClient: ClientProxy,
  ) {}async sendNotification(dto: CreateNotificationDto) {
    this.logger.debug(`Sending notification to user: ${dto.userId}`);
    try {
      const result = await lastValueFrom(
        this.notificationsClient.send('notifications.send', dto),
      );
      this.logger.debug(`Notification sent successfully to user: ${dto.userId}`);
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'send notification');
    }
  }
}
