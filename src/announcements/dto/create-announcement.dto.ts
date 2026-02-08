import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Title of the announcement',
    example: 'Parish Festival',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({
    description: 'Content/body of the announcement',
    example: 'Join us for our annual parish festival on Sunday after the 10am Mass',
  })
  @IsString()
  @IsOptional()
  contenu?: string;

  @ApiPropertyOptional({
    description: 'Type code of the announcement',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_type?: number;

  @ApiPropertyOptional({
    description: 'Code of the ecclesiastical unit making the announcement',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_ecclesiale?: number;

  @ApiPropertyOptional({
    description: 'Publication date of the announcement in ISO 8601 format',
    example: '2024-03-01',
  })
  @IsDateString()
  @IsOptional()
  date_publication?: string;

  @ApiPropertyOptional({
    description: 'Expiration date of the announcement in ISO 8601 format',
    example: '2024-03-31',
  })
  @IsDateString()
  @IsOptional()
  date_expiration?: string;
}
