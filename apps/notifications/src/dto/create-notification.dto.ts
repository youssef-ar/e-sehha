import { Channel } from '../enums/channel.enum';

export class CreateNotificationDto {
  userId: string;              
  title: string;
  type: string;
  message: string;
  channels: Channel[];         
  email?: string;              
  phone?: string;              
}