import { Body, Controller, Get, Logger } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('symptom-checker')
export class SymptomCheckerController {
    private readonly logger = new Logger(SymptomCheckerController.name);

    constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Response from the symptom checker service',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    async checkSymptoms(@Body() symptoms: string) {
        this.logger.debug('Checking symptoms...');
        try {
            const result = await this.symptomCheckerService.checkSymptoms(symptoms);
            this.logger.debug('Symptom check request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to check symptoms', error);
            throw error;
        }
    }
}
