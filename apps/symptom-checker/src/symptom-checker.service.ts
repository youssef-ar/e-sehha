import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SymptomCheckerDto } from '@app/contracts/symptom-checker/symptoms.dto';

@Injectable()
export class SymptomCheckerService {
  private readonly logger = new Logger(SymptomCheckerService.name);
  private readonly gemini: GoogleGenerativeAI;

  constructor() {
    this.gemini = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY ?? (() => { throw new Error('GOOGLE_API_KEY is not defined'); })()
    );
  }

  async getSpeciality(symptoms: SymptomCheckerDto): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const symptom = symptoms.symptoms;
    this.logger.debug(`Received symptoms: ${JSON.stringify(symptoms)}`);
    this.logger.debug(`Symptom: ${symptom}`);
    const prompt = `You are a medical assistant. Your job is to map symptoms to the most relevant doctor speciality. Respond concisely with only the name of the specialty and the severity of the symptoms. A patient is experiencing: "${symptom}". 
    Based on these symptoms, which medical specialist should they consult?`;
    this.logger.debug(`Prompt: ${prompt}`);
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  }
}
