import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { SseService } from './sse.service';

@Injectable()
export class SseScheduler {
  constructor(private readonly sseService: SseService) {}

  @Interval(3000)
  sendTestNotification() {
    const now = new Date().toLocaleTimeString();
    const message = `🕒 Notification at ${now}`;
    this.sseService.sendNotification(message);
  }
}
