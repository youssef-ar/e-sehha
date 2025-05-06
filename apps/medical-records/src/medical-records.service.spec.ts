import { Test, TestingModule } from '@nestjs/testing';
import { RecordService } from './medical-records.service';
import { getModelToken } from '@nestjs/mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { Model } from 'mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockMedicalRecordModel = () => ({
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
  aggregate: jest.fn(),
  save: jest.fn(),
});

describe('RecordService', () => {
  let service: RecordService;
  let model: Model<MedicalRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: getModelToken(MedicalRecord.name),
          useFactory: mockMedicalRecordModel,
        },
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    model = module.get<Model<MedicalRecord>>(getModelToken(MedicalRecord.name));
  });

  describe('addOrUpdateMedicalRecord', () => {
    it('should create new record if not existing', async () => {
      const save = jest.fn().mockResolvedValue({ patientId: '123', records: [] });
      jest.spyOn(model, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(model, 'save' as any).mockReturnValue(save);

      const createSpy = jest
        .spyOn(model, 'constructor' as any)
        .mockImplementation(() => ({ save }));

      const result = await service.addOrUpdateMedicalRecord('123', {
        doctorId: 'doc1',
        visitDate: new Date(),
      } as any);

      expect(result.patientId).toBe('123');
      expect(createSpy).toHaveBeenCalled();
    });

    it('should update existing record', async () => {
      const save = jest.fn().mockResolvedValue({ patientId: '123', records: [{}] });
      const existing = { patientId: '123', records: [], save } as any;
      jest.spyOn(model, 'findOne').mockResolvedValue(existing);

      const result = await service.addOrUpdateMedicalRecord('123', {
        doctorId: 'doc1',
        visitDate: new Date(),
      } as any);

      expect(result.patientId).toBe('123');
      expect(save).toHaveBeenCalled();
    });

    it('should throw on missing patientId or doctorId', async () => {
      await expect(
        service.addOrUpdateMedicalRecord('', {
          doctorId: '',
          visitDate: new Date(),
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return one record', async () => {
      const mockResult = [{ patientId: 'p1', records: [{}] }];
      jest.spyOn(model, 'aggregate').mockResolvedValue(mockResult);

      const result = await service.findOne('p1', 'doc1');
      expect(result.patientId).toBe('p1');
    });

    it('should throw if not found', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValue([]);
      await expect(service.findOne('p2', 'doc2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return filtered records', async () => {
      const mockRecords = [{ patientId: 'p1', records: [{}] }];
      jest.spyOn(model, 'aggregate').mockResolvedValue(mockRecords);

      const result = await service.findAll('doc1', 1, 10);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw if doctorId is missing', async () => {
      await expect(service.findAll('', 1, 10)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete record', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockResolvedValue({ patientId: 'p1' } as any);

      const result = await service.remove('p1');
      expect(result).toEqual({ message: 'Record deleted successfully', patientId: 'p1' });
    });

    it('should throw if not found', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(null);
      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
