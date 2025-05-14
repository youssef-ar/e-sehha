import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(receiverEmail: string, subject: string, content: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: receiverEmail,
        subject: subject,
        html : content,
      });
      return true; // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
  }
}