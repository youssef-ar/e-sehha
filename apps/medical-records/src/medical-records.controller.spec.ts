import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';

describe('MedicalRecordsController', () => {
  let medicalRecordsController: MedicalRecordsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordsController],
      providers: [MedicalRecordsService],
    }).compile();

    medicalRecordsController = app.get<MedicalRecordsController>(MedicalRecordsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(medicalRecordsController.getHello()).toBe('Hello World!');
    });
  });
});
