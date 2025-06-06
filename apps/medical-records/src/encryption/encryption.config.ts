import { Injectable } from '@nestjs/common';

export interface EncryptionConfig {
  algorithm: string;
  keyDerivationSalt: string;
  ivLength: number;
  keyLength: number;
}

@Injectable()
export class EncryptionConfigService {
  private readonly config: EncryptionConfig;

  constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyDerivationSalt: 'medical-records-salt',
      ivLength: 16,
      keyLength: 32,
    };
  }

  getConfig(): EncryptionConfig {
    return { ...this.config };
  }

  getEncryptionKey(): string {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    return key;
  }
}
