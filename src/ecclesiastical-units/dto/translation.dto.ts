import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EcclesiasticalUnitTranslationDto {
  @ApiProperty({
    example: 'en',
    description: 'Language code (ISO 639-1 format)',
  })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({
    example: 'Saint Mary Parish',
    description: 'Name of the ecclesiastical unit in this language',
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({
    example: 'A welcoming Catholic community serving the local area',
    description: 'Description in this language',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '123 Church Street, Montreal, QC H1A 1B1',
    description: 'Address in this language',
  })
  @IsString()
  @IsOptional()
  adresse?: string;
}
