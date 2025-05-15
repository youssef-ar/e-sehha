import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter  } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
 
export  const emailConfig: MailerOptions = {
  transport: {
    host : 'smtp.gmail.com',
    port : 587,
    secure: false,
    auth : {
        user : 'yessinelyoussfi123@gmail.com',
        pass : 'fdrk zwqu nwgr jwqj',
    },
  },
  defaults: {
    from: '"No Reply" <noreply@localhost>',
  },
  preview : true,
  template: {
    dir: process.cwd() + '/template/',
    adapter: new HandlebarsAdapter(),
    options: {
        strict: true,
    },
    },
};
