import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {emailConfig} from './email.config';
import {EmailService} from './email.service';
import {EmailController} from './email.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => emailConfig,
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [MailerModule],
})
export class EmailModule {}