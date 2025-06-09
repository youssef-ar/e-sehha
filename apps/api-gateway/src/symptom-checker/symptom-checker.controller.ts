import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { ApiResponse } from '@nestjs/swagger';
import { SymptomCheckerDto } from '@app/contracts/symptom-checker/symptoms.dto';
import { AuthGuard } from '@app/shared-auth';

@UseGuards(AuthGuard)
@Controller()
export class SymptomCheckerController {
  private readonly logger = new Logger(SymptomCheckerController.name);

  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post('symptom-checker')
  @ApiResponse({
    status: 200,
    description: 'Response from the symptom checker service',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async checkSymptoms(@Body() symptoms: SymptomCheckerDto) {
    this.logger.debug('Checking symptoms...');
    try {
      this.logger.debug('Received symptoms:', symptoms);
      const result = await this.symptomCheckerService.checkSymptoms(symptoms);
      this.logger.debug('Symptom check request processed successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to check symptoms', error);
      throw error;
    }
  }
}
