import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export enum Channel {
  EMAIL = 'email',
  SMS = 'sms',
  SSE = 'sse',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID of the user to send notification to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'Appointment Reminder'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the notification',
    example: 'appointment_reminder'
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Message content of the notification',
    example: 'Your appointment is scheduled for tomorrow at 10:00 AM'
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Channels to send the notification through',
    enum: Channel,
    isArray: true,
    example: [Channel.EMAIL, Channel.SSE]
  })
  @IsArray()
  @IsEnum(Channel, { each: true })
  channels: Channel[];

  @ApiProperty({
    description: 'Email address (required if email channel is used)',
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number (required if SMS channel is used)',
    example: '+1234567890',
    required: false
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
