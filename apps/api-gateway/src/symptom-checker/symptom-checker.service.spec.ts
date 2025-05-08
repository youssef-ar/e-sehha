import { Test, TestingModule } from '@nestjs/testing';
import { SymptomCheckerService } from './symptom-checker.service';

describe('SymptomCheckerService', () => {
  let service: SymptomCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymptomCheckerService],
    }).compile();

    service = module.get<SymptomCheckerService>(SymptomCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
