import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

    constructor(private configService: ConfigService) {}
    emailTransport(){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.configService.get<string>('EMAIL_USER'), 
                pass: this.configService.get<string>('EMAIL_PASS'), 
            },
            
    })

    return transporter;
}

async send(to: string, subject: string, text: string) {
    

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject,
      text,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }

}
}
