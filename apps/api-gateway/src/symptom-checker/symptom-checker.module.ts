import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports:[
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'SYMPTOM_CHECKER_SERVICE',
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
                            'SYMPTOM_CHECKER_QUEUE',
                            'symptom_checker_queue',
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
            }
        ])
    ],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService]
})
export class SymptomCheckerModule {}
