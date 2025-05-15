import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('sse')
export class SseController {
  @Sse()
  sse(): Observable<{ data: { message: string } }> {
    return interval(3000).pipe(
      map((_) => ({
        data: { message: `🕒 Notification at ${new Date().toLocaleTimeString()}` }
      }))
    );
  }
}