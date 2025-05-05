import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RECORD_SERVICE',
        imports: [ConfigModule],
        useFactory: (ConfigService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              ConfigService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: ConfigService.get<string>(
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
