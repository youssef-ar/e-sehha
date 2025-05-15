import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsObject,
    IsArray
  } from '@nestjs/class-validator';
  
  export class RecordEntryDto {
    @IsString()
    @IsOptional()
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
  
    @IsObject()
    @IsOptional()
    notes?: Record<string, any>;
  
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    sharedWithDoctors?: string[];
  }
  