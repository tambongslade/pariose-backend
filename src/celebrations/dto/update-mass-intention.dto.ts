import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMassIntentionDto {
  @ApiPropertyOptional({
    description: 'The intention for which the mass is being celebrated',
    example: 'For the repose of the soul of John Doe',
  })
  @IsString()
  @IsOptional()
  intention_messe?: string;

  @ApiPropertyOptional({
    description: 'Code of the eucharistic celebration for this intention',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_celebration_eucharistique?: number;

  @ApiPropertyOptional({
    description: 'Amount paid for the mass intention',
    example: 5000,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  montant_verse?: number;

  @ApiPropertyOptional({
    description: 'Date when the payment was made in ISO 8601 format',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsOptional()
  date_versement?: string;
}
