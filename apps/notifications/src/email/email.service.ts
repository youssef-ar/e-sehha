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
            tls: {
            rejectUnauthorized: false
        }
            
    })

    return transporter;
}

async send(to: string, subject: string, text: string) {
    

    const transport = this.emailTransport();
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="margin-bottom: 30px;">
                    ${typeof text === 'object' ? `<pre style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(text, null, 2)}</pre>` : `<p style="margin: 0; font-size: 16px;">${String(text).replace(/\n/g, '<br>')}</p>`}
                </div>
                
                <hr style="border: none; height: 1px; background-color: #e9ecef; margin: 30px 0;">
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; font-size: 14px; color: #6c757d;">
                    <h4 style="margin: 0 0 15px 0; color: #495057; font-size: 16px;">Contact Us</h4>
                    <p style="margin: 5px 0;"><strong>Email:</strong> contact@e-sihha.me</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> +216 71 123 456</p>
                    <p style="margin: 5px 0 0 0;"><strong>Address:</strong> INSAT, Software Engineering Department, Tunisia</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to:String(to),
      subject:String(subject),
      text: typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text),
      html: htmlContent,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }

}
}
