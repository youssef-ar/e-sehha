import { SYMPTOM_CHECKER_PATTERNS } from '@app/contracts/symptom-checker/symptom-checker.patterns';
import { SymptomCheckerDto } from '@app/contracts/symptom-checker/symptoms.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SymptomCheckerService {
    private readonly logger = new Logger(SymptomCheckerService.name);

    constructor(
        @Inject('SYMPTOM_CHECKER_SERVICE') private readonly symptomCheckerClient: ClientProxy,
    ) {}

    async checkSymptoms(symptoms: SymptomCheckerDto) {
        this.logger.debug(`Checking symptoms: ${JSON.stringify(symptoms)}`);
        try {
            const result = await this.symptomCheckerClient.send(SYMPTOM_CHECKER_PATTERNS.SYMPTOM_CHECKER,  symptoms ).toPromise();
            this.logger.debug('Symptom check request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to check symptoms', error);
            throw error;
        }
    }

}
