import { Test, TestingModule } from '@nestjs/testing';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';

describe('SymptomCheckerController', () => {
  let symptomCheckerController: SymptomCheckerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SymptomCheckerController],
      providers: [SymptomCheckerService],
    }).compile();

    symptomCheckerController = app.get<SymptomCheckerController>(SymptomCheckerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(symptomCheckerController.getHello()).toBe('Hello World!');
    });
  });
});
