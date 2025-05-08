import { Controller } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @MessagePattern('symptom-checker.get-ai-response')
  async handleSymptomRequest(
    @Payload() symptom: string
  ): Promise<string> {
    return this.symptomCheckerService.getSpeciality(symptom);
  }
}
