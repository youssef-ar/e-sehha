import { Module } from '@nestjs/common';
import { EncryptionConfigService } from './encryption.config';
import { CryptoService } from './crypto.service';
import { DataEncryptionService } from './data-encryption.service';
import { MedicalRecordEncryptionService } from './medical-record-encryption.service';

@Module({
  providers: [
    EncryptionConfigService,
    CryptoService,
    DataEncryptionService,
    MedicalRecordEncryptionService,
  ],
  exports: [
    EncryptionConfigService,
    CryptoService,
    DataEncryptionService,
    MedicalRecordEncryptionService,
  ],
})
export class EncryptionModule {}
