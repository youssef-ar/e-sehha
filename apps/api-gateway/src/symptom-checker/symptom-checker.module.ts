import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports:[
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'SYMPTOM_CHECKER_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.get(
                                'RABBITMQ_URL',
                                'amqp://rabbitmq:5672',
                            ) as string,
                        ],
                        queue: configService.get(
                            'SYMPTOM_CHECKER_QUEUE',
                            'symptom_checker_queue',
                        ) as string,
                        queueOptions: {
                            durable: true,
                        },
                        socketOptions: {
                            timeout: 5000,
                        },
                    },
                }),
            }
        ])
    ],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService]
})
export class SymptomCheckerModule {}
