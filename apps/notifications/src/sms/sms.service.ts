import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client = new Twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );

  async sendSms(to: string, message: string) {
    await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
  }
}
