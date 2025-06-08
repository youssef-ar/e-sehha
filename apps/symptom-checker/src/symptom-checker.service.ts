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

  async getSpeciality(symptoms: SymptomCheckerDto): Promise<any> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const symptom = symptoms.symptoms;
    this.logger.debug(`Received symptoms: ${JSON.stringify(symptoms)}`);
    
    const prompt = `You are a medical assistant. Your job is to map symptoms to the most relevant doctor specialty. Respond concisely with only the name of the specialty, the reason why and the severity of the symptoms. This is the patient's message: "${symptom}". 
Respond only in this object format: {
  "specialty": string,
  "severity": string,
  "reason": string
}
If it's not understandable, just return:
{
  "specialty": "General Practitioner",
  "severity": "Low",
  "reason": "Couldn't understand the symptoms, a general practitioner can help with initial assessment."
}`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text(); 
    this.logger.debug(`LLM response: ${textResponse}`);

    return this.extractJsonFromLLMResponse(textResponse);
  }

  private extractJsonFromLLMResponse(responseText: string): any {
    try {
      const cleaned = responseText
        .replace(/```json|```/g, '')
        .trim();

      const fixed = cleaned.replace(/\n(?!\s*["}])/g, ' ');

      const parsed = JSON.parse(fixed);
      this.logger.debug(`Parsed JSON: ${JSON.stringify(parsed)}`);
      return parsed;
    } catch (err) {
      this.logger.error('Failed to parse JSON from LLM response', err);
      return {
        specialty: 'General Practitioner',
        severity: 'Low',
        reason: 'Failed to parse LLM output. Recommend general consultation.'
      };
    }
  }
}
