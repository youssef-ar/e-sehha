import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RECORD_SERVICE } from '@app/contracts/medical-records/constants';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: RECORD_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://rabbitmq:5672',
              ),
            ],
            queue: configService.get<string>(
              'RECORD_QUEUE',
              'record_queue',
            ),
            queueOptions: {
              durable: true,
            },
            socketOptions: {
              timeout: 5000,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
