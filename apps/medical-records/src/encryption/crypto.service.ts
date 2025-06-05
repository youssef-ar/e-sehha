import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { EncryptionConfigService } from './encryption.config';

export interface EncryptionResult {
  iv: string;
  authTag: string;
  encrypted: string;
}

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly key: Buffer;
  private readonly algorithm: string;

  constructor(private readonly configService: EncryptionConfigService) {
    const config = this.configService.getConfig();
    this.algorithm = config.algorithm;
    
    const secretKey = this.configService.getEncryptionKey();
    this.key = crypto.scryptSync(secretKey, config.keyDerivationSalt, config.keyLength);
  }

  /**
   * Encrypts a string using AES-256-GCM
   * @param text - The text to encrypt
   * @returns Encrypted string in format "iv:authTag:encrypted"
   */  encryptString(text: string): string {
    if (!text || typeof text !== 'string') {
      return text;
    }

    try {
      const config = this.configService.getConfig();
      const iv = crypto.randomBytes(config.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as crypto.CipherGCM;
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error(`Encryption failed for text: ${error.message}`);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts a string that was encrypted with encryptString
   * @param encryptedText - The encrypted text in format "iv:authTag:encrypted"
   * @returns Decrypted string
   */
  decryptString(encryptedText: string): string {
    if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
      return encryptedText;
    }

    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        this.logger.warn('Invalid encrypted text format, returning as-is');
        return encryptedText;
      }

      const [ivHex, authTagHex, encrypted] = parts;
        const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv) as crypto.DecipherGCM;
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      this.logger.warn(`Decryption failed, returning original text: ${error.message}`);
      return encryptedText;
    }
  }

  /**
   * Checks if a string appears to be encrypted
   * @param text - The text to check
   * @returns True if the text appears to be encrypted
   */
  isEncrypted(text: string): boolean {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    const parts = text.split(':');
    return parts.length === 3 && parts.every(part => /^[0-9a-f]+$/i.test(part));
  }
}
