import { Injectable, Logger } from '@nestjs/common';
import { CryptoService } from './crypto.service';

export type EncryptableValue = string | number | boolean | null | undefined;
export type EncryptableObject = Record<string, any>;
export type EncryptableArray = any[];

@Injectable()
export class DataEncryptionService {
  private readonly logger = new Logger(DataEncryptionService.name);

  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * Encrypts an object recursively, encrypting only string values
   * @param obj - The object to encrypt
   * @returns Encrypted object
   */
  encryptObject<T extends EncryptableObject>(obj: T): T {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const encrypted = {} as T;
    
    for (const [key, value] of Object.entries(obj)) {
      encrypted[key as keyof T] = this.encryptValue(value) as T[keyof T];
    }
    
    return encrypted;
  }

  /**
   * Decrypts an object recursively, decrypting only encrypted string values
   * @param obj - The object to decrypt
   * @returns Decrypted object
   */
  decryptObject<T extends EncryptableObject>(obj: T): T {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const decrypted = {} as T;
    
    for (const [key, value] of Object.entries(obj)) {
      decrypted[key as keyof T] = this.decryptValue(value) as T[keyof T];
    }
    
    return decrypted;
  }

  /**
   * Encrypts an array recursively
   * @param arr - The array to encrypt
   * @returns Encrypted array
   */
  encryptArray<T extends EncryptableArray>(arr: T): T {
    if (!Array.isArray(arr)) {
      return arr;
    }

    return arr.map(item => this.encryptValue(item)) as T;
  }

  /**
   * Decrypts an array recursively
   * @param arr - The array to decrypt
   * @returns Decrypted array
   */
  decryptArray<T extends EncryptableArray>(arr: T): T {
    if (!Array.isArray(arr)) {
      return arr;
    }

    return arr.map(item => this.decryptValue(item)) as T;
  }

  /**
   * Encrypts a single value based on its type
   * @param value - The value to encrypt
   * @returns Encrypted value
   */
  private encryptValue(value: any): any {
    if (typeof value === 'string') {
      return this.cryptoService.encryptString(value);
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return this.encryptArray(value);
      } else {
        return this.encryptObject(value);
      }
    }
    
    // Return primitives (numbers, booleans, null, undefined) as-is
    return value;
  }

  /**
   * Decrypts a single value based on its type
   * @param value - The value to decrypt
   * @returns Decrypted value
   */
  private decryptValue(value: any): any {
    if (typeof value === 'string') {
      return this.cryptoService.decryptString(value);
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return this.decryptArray(value);
      } else {
        return this.decryptObject(value);
      }
    }
    
    // Return primitives (numbers, booleans, null, undefined) as-is
    return value;
  }
}
