import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SymptomCheckerService {
    private readonly logger = new Logger(SymptomCheckerService.name);

    constructor(
        @Inject('SYMPTOM_CHECKER_SERVICE') private readonly symptomCheckerClient: ClientProxy,
    ) {}

    async checkSymptoms(symptoms: string) {
        this.logger.debug(`Checking symptoms: ${symptoms}`);
        try {
            const result = await this.symptomCheckerClient.send('symptom-checker.get-ai-response', { symptoms }).toPromise();
            this.logger.debug('Symptom check request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to check symptoms', error);
            throw error;
        }
    }

}
