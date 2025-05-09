import { Test, TestingModule } from '@nestjs/testing';
import { SymptomCheckerController } from './symptom-checker.controller';

describe('SymptomCheckerController', () => {
  let controller: SymptomCheckerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymptomCheckerController],
    }).compile();

    controller = module.get<SymptomCheckerController>(SymptomCheckerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
