import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsObject,
    IsArray
  } from '@nestjs/class-validator';

  import { RecordEntry } from '../schemas/record-entry.schema';
  
  export class RecordEntryDto {
    @IsString()
    @IsNotEmpty()
    doctorId: string;
  
    @IsDateString()
    visitDate: Date;
  
    @IsObject()
    @IsOptional()
    diagnosis?: Record<string, any>;
  
    @IsObject()
    @IsOptional()
    treatment?: Record<string, any>;
  
    @IsObject()
    @IsOptional()
    labResults?: Record<string, any>;
  
    @IsString()
    @IsOptional()
    notes?: string;
  
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    sharedWithDoctors?: string[];

    toRecord(): RecordEntry {
        return {
            doctorId: this.doctorId,
            visitDate: this.visitDate,
            diagnosis: this.diagnosis,
            treatment: this.treatment,
            labResults: this.labResults,
            notes: this.notes ? [this.notes] : [],
            sharedWithDoctors: this.sharedWithDoctors || [],
        };
    }
  }
  