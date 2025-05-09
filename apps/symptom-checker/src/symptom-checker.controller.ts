import { Controller } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SYMPTOM_CHECKER_PATTERNS } from '@app/contracts/symptom-checker/symptom-checker.patterns';
import { SymptomCheckerDto } from '@app/contracts/symptom-checker/symptoms.dto';

@Controller()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @MessagePattern(SYMPTOM_CHECKER_PATTERNS.SYMPTOM_CHECKER)
  async handleSymptomRequest(
    @Payload() symptoms: SymptomCheckerDto
  ): Promise<string> {
    return this.symptomCheckerService.getSpeciality(symptoms);
  }
}
