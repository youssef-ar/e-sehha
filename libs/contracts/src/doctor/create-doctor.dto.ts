// doctor/dto/create-doctor.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  specialty: string;

  @IsString()
  phone: string;

  @IsOptional()
  qualifications?: string[];

  @IsOptional()
  bio?: string;
}
