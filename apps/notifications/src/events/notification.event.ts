import { CreateNotificationDto } from '../dto/create-notification.dto';

export interface NotificationEvent {
  type: 'notification.send';
  payload: CreateNotificationDto;
}