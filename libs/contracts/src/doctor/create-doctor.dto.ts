import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  Matches,
  MaxLength,
  ValidateNested,
  IsObject,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

// --- WorkingHours for one day ---
class WorkingHoursDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  start: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  end: string;
}

// --- WorkingHours for the whole week ---
class WeeklyWorkingHoursDto {
  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  monday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  tuesday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  wednesday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  thursday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  friday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  saturday: WorkingHoursDto;

  @ApiProperty({ type: WorkingHoursDto })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  sunday: WorkingHoursDto;
}

// --- Your DTO with workingHours added ---
export class CreateDoctorDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiHideProperty()
  userId?: string;

  @ApiProperty({
    description: "Doctor's full name",
    example: 'Dr. John Smith',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Doctor's email address",
    example: 'john.smith@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Doctor's medical specialty",
    example: 'Cardiology',
  })
  @IsString()
  specialty: string;

  @ApiProperty({
    description: "Doctor's medical license number",
    example: 'MD123456',
  })
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: "Doctor's phone number",
    example: '+1-555-123-4567',
  })
  @IsString()
  @Matches(/^\+?[\d\s-]{10,}$/, {
    message: 'Please enter a valid phone number',
  })
  phone: string;

  @ApiProperty({
    description: "Doctor's address",
    example: '123 Medical Center Dr',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "Doctor's city",
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: "Doctor's state",
    example: 'NY',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: "Doctor's zip code",
    example: '10001',
  })
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: "Doctor's qualifications and certifications",
    type: [String],
    example: ['MD', 'Board Certified in Cardiology'],
  })
  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @ApiPropertyOptional({
    description: "Doctor's biography",
    example: 'Dr. Smith has over 10 years of experience in cardiology...',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Bio cannot be more than 1000 characters',
  })
  bio?: string;

  @ApiProperty({
    description: 'Weekly working hours',
    type: WeeklyWorkingHoursDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WeeklyWorkingHoursDto)
  workingHours: WeeklyWorkingHoursDto;
}
