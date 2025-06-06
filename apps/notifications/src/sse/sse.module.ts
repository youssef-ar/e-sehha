import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { SseScheduler } from './sse.scheduler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SseController],
  providers: [SseService, SseScheduler],
  exports: [SseService],
})
export class SseModule {}
