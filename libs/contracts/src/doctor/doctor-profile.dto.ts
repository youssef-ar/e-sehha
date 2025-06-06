import { ApiProperty } from '@nestjs/swagger';

export class WorkingHoursDto {
  @ApiProperty()
  monday: string;

  @ApiProperty()
  tuesday: string;

  @ApiProperty()
  wednesday: string;

  @ApiProperty()
  thursday: string;

  @ApiProperty()
  friday: string;

  @ApiProperty()
  saturday: string;

  @ApiProperty()
  sunday: string;
}

export class ContactDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;
}

export class DoctorProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  specialty: string;

  @ApiProperty()
  experience: number;

  @ApiProperty()
  location: string;

  @ApiProperty()
  availability: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  education: string;

  @ApiProperty()
  about: string;

  @ApiProperty({ type: [String] })
  qualifications: string[];

  @ApiProperty({ type: [String] })
  services: string[];

  @ApiProperty({ type: WorkingHoursDto })
  workingHours: WorkingHoursDto;

  @ApiProperty({ type: ContactDto })
  contact: ContactDto;

  @ApiProperty({ type: [String] })
  availableTimeSlots: string[];
}
