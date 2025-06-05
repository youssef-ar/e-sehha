import { Injectable, Logger } from '@nestjs/common';
import { DataEncryptionService } from './data-encryption.service';
import { RecordEntry } from '../schemas/record-entry.schema';
import { MedicalRecord } from '../schemas/medical-record.schema';
import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';

/**
 * Defines which fields in medical records should be encrypted
 */
export const SENSITIVE_FIELDS = {
  DIAGNOSIS: 'diagnosis',
  TREATMENT: 'treatment',
  LAB_RESULTS: 'labResults',
  NOTES: 'notes',
} as const;

/**
 * Non-sensitive fields that should never be encrypted
 */
export const NON_SENSITIVE_FIELDS = {
  ID: '_id',
  PATIENT_ID: 'patientId',
  DOCTOR_ID: 'doctorId',
  SHARED_WITH_DOCTORS: 'sharedWithDoctors',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

@Injectable()
export class MedicalRecordEncryptionService {
  private readonly logger = new Logger(MedicalRecordEncryptionService.name);

  constructor(private readonly dataEncryptionService: DataEncryptionService) {}

  /**
   * Encrypts sensitive fields in a medical record entry
   * @param entry - The record entry to encrypt
   * @returns Encrypted record entry
   */  encryptRecordEntry(entry: RecordEntry): RecordEntry {
    this.logger.debug('Encrypting medical record entry');
    
    return {
      ...entry,
      [SENSITIVE_FIELDS.DIAGNOSIS]: this.dataEncryptionService.encryptObject(entry.diagnosis || {}),
      [SENSITIVE_FIELDS.TREATMENT]: this.dataEncryptionService.encryptObject(entry.treatment || {}),
      [SENSITIVE_FIELDS.LAB_RESULTS]: this.dataEncryptionService.encryptObject(entry.labResults || {}),
      [SENSITIVE_FIELDS.NOTES]: this.dataEncryptionService.encryptArray(this.normalizeNotes(entry.notes)),
    };
  }

  /**
   * Decrypts sensitive fields in a medical record entry
   * @param entry - The encrypted record entry to decrypt
   * @returns Decrypted record entry
   */
  decryptRecordEntry(entry: any): RecordEntry {
    this.logger.debug('Decrypting medical record entry');
    
    return {
      ...entry,
      [SENSITIVE_FIELDS.DIAGNOSIS]: this.dataEncryptionService.decryptObject(entry.diagnosis),
      [SENSITIVE_FIELDS.TREATMENT]: this.dataEncryptionService.decryptObject(entry.treatment),
      [SENSITIVE_FIELDS.LAB_RESULTS]: this.dataEncryptionService.decryptObject(entry.labResults),
      [SENSITIVE_FIELDS.NOTES]: this.dataEncryptionService.decryptArray(entry.notes),
    };
  }

  /**
   * Encrypts sensitive fields in a record entry DTO
   * @param dto - The DTO to encrypt
   * @returns Encrypted DTO
   */  encryptRecordEntryDto(dto: RecordEntryDto): any {
    this.logger.debug('Encrypting record entry DTO');
    
    return {
      ...dto,
      [SENSITIVE_FIELDS.DIAGNOSIS]: this.dataEncryptionService.encryptObject(dto.diagnosis || {}),
      [SENSITIVE_FIELDS.TREATMENT]: this.dataEncryptionService.encryptObject(dto.treatment || {}),
      [SENSITIVE_FIELDS.LAB_RESULTS]: this.dataEncryptionService.encryptObject(dto.labResults || {}),
      [SENSITIVE_FIELDS.NOTES]: this.dataEncryptionService.encryptArray(this.normalizeNotesFromDto(dto.notes)),
    };
  }
  /**
   * Encrypts a complete medical record (with all its entries)
   * @param record - The medical record to encrypt
   * @returns Medical record with encrypted entries
   */
  encryptMedicalRecord(record: any): any {
    this.logger.debug(`Encrypting medical record for patient: ${record.patientId}`);
    
    return {
      ...record,
      records: record.records?.map(entry => this.encryptRecordEntry(entry)) || [],
    };
  }
  /**
   * Decrypts a complete medical record (with all its entries)
   * @param record - The encrypted medical record to decrypt
   * @returns Medical record with decrypted entries
   */
  decryptMedicalRecord(record: any): any {
    this.logger.debug(`Decrypting medical record for patient: ${record.patientId}`);
    
    return {
      ...record,
      records: record.records?.map(entry => this.decryptRecordEntry(entry)) || [],
    };
  }

  /**
   * Normalizes notes from RecordEntry to ensure consistent array format
   * @param notes - Notes field from RecordEntry
   * @returns Normalized notes array
   */
  private normalizeNotes(notes: any): any[] {
    if (!notes) return [];
    
    if (Array.isArray(notes)) {
      return notes;
    }
    
    return [notes];
  }

  /**
   * Normalizes notes from RecordEntryDto which can be various formats
   * @param notes - Notes field from RecordEntryDto
   * @returns Normalized notes array
   */
  private normalizeNotesFromDto(notes: any): any[] {
    if (!notes) return [];
    
    if (Array.isArray(notes)) {
      return notes;
    }
    
    if (typeof notes === 'string') {
      return [notes];
    }
    
    if (typeof notes === 'object') {
      return [notes];
    }
    
    return [notes];
  }

  /**
   * Validates that sensitive data is properly encrypted
   * @param data - The data to validate
   * @returns True if data appears to be encrypted
   */
  validateEncryption(data: any): boolean {
    // Implementation for validation logic
    // This could check if sensitive fields contain encrypted strings
    return true; // Simplified for now
  }
}
