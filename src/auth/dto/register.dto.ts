import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for login (min 3 characters)',
    example: 'john.doe',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Password (min 6 characters, must contain uppercase, lowercase, and number/special character)',
    example: 'MyPass123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak. Must contain uppercase, lowercase, and number/special character',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  noms?: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  prenoms?: string;

  @ApiPropertyOptional({
    description: 'Date of birth (ISO 8601 format)',
    example: '1990-01-15',
  })
  @IsDateString()
  @IsOptional()
  date_naissance?: string;

  @ApiPropertyOptional({
    description: 'Primary contact number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  contact_1?: string;

  @ApiPropertyOptional({
    description: 'Secondary contact number',
    example: '+0987654321',
  })
  @IsString()
  @IsOptional()
  contact_2?: string;

  @ApiPropertyOptional({
    description: 'Home address',
    example: '123 Main St, City, Country',
  })
  @IsString()
  @IsOptional()
  addresse?: string;
}
