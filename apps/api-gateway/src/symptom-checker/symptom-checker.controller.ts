import { Body, Controller, Get, Logger } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SymptomCheckerDto } from '@app/contracts/symptom-checker/symptoms.dto';

@Controller('symptom-checker')
export class SymptomCheckerController {
    private readonly logger = new Logger(SymptomCheckerController.name);

    constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

    @Get()
    @ApiOperation({ summary: 'Suggests a doctor speciality based on entered symptoms' })
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
