import {
  IsString,
  IsOptional,
  MinLength,
  IsDateString,
  IsArray,
  IsInt,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Unique username for the user account',
    example: 'john_doe',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({
    description:
      'User password - must contain uppercase, lowercase, and number/special character',
    example: 'SecurePass123!',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Must contain uppercase, lowercase, and number/special character',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Last name(s) of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  noms?: string;

  @ApiPropertyOptional({
    description: 'First name(s) of the user',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  prenoms?: string;

  @ApiPropertyOptional({
    description: 'Date of birth in ISO 8601 format',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsOptional()
  date_naissance?: string;

  @ApiPropertyOptional({
    description: 'Primary contact number',
    example: '+237 6 70 12 34 56',
  })
  @IsString()
  @IsOptional()
  contact_1?: string;

  @ApiPropertyOptional({
    description: 'Secondary contact number',
    example: '+237 6 90 98 76 54',
  })
  @IsString()
  @IsOptional()
  contact_2?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the user',
    example: 'Douala, Cameroon',
  })
  @IsString()
  @IsOptional()
  addresse?: string;

  @ApiPropertyOptional({
    description: 'Array of role IDs to assign to the user',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  roleIds?: number[];
}
