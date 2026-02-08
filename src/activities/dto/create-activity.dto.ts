import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({
    description: 'Name of the activity',
    example: 'Youth Bible Study',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({
    description: 'Date of the activity in ISO 8601 format',
    example: '2024-03-15',
  })
  @IsDateString()
  @IsOptional()
  date_activite?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the activity',
    example: 'Weekly Bible study session for young adults',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Frequency of the activity',
    example: 'weekly',
    enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['once', 'daily', 'weekly', 'monthly', 'yearly'])
  frequence?: string;

  @ApiPropertyOptional({
    description: 'Start date for recurring activities in ISO 8601 format',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  date_debut?: string;

  @ApiPropertyOptional({
    description: 'End date for recurring activities in ISO 8601 format',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  date_fin?: string;

  @ApiPropertyOptional({
    description: 'Status of the activity (0: planned, 1: ongoing, 2: completed)',
    example: 0,
    minimum: 0,
    maximum: 2,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(2)
  statut?: number;

  @ApiPropertyOptional({
    description: 'Location where the activity takes place',
    example: 'Parish Hall',
  })
  @IsString()
  @IsOptional()
  lieu?: string;

  @ApiProperty({
    description: 'Code of the ecclesiastical unit organizing the activity',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  code_unite_ecclesiale: number;

  @ApiPropertyOptional({
    description: 'Type code of the activity',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_type_activite?: number;
}
