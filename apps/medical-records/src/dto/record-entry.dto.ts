import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsObject,
    IsArray
  } from '@nestjs/class-validator';
  
  export class RecordEntryDto {
    @IsString()
    @IsNotEmpty()
    doctorId: string;
  
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
  }
  