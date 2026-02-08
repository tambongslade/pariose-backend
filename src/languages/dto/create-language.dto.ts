import { IsString, IsNotEmpty, IsBoolean, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'Language code (ISO 639-1 format, e.g., en, fr, es)',
    example: 'en',
    minLength: 2,
    maxLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  code: string;

  @ApiProperty({
    description: 'Language name',
    example: 'English',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Set as default language',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @ApiPropertyOptional({
    description: 'Set language as active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
