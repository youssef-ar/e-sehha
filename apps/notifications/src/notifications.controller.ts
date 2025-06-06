import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifyDto } from './dto/notify.dto';

@Controller('notify')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async send(@Body() dto: NotifyDto) {
    return this.notificationsService.sendNotification(dto);
  }
}
