// doctor/dto/verify-doctor.dto.ts
import { IsBoolean, IsMongoId } from 'class-validator';

export class VerifyDoctorDto {
  @IsMongoId()
  doctorId: string;

  @IsBoolean()
  verified: boolean;
}
