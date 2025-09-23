import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword123'
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newSecurePassword456',
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}