import { Injectable } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private subject = new Subject<MessageEvent>();

  getStream(): Observable<MessageEvent> {
    return this.subject.asObservable();
  }

  sendNotification(message: string) {
    this.subject.next({ data: { message } });
  }
}
