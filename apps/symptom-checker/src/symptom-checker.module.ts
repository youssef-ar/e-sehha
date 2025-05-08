import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}
