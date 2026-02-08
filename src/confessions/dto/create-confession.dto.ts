import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConfessionDto {
  @ApiPropertyOptional({
    description: 'Location where confession is held',
    example: 'Main Church Confessional',
  })
  @IsString()
  @IsOptional()
  lieu?: string;

  @ApiPropertyOptional({
    description: 'Start time of confession in HH:mm or HH:mm:ss format',
    example: '15:00',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaire_debut must be in HH:mm or HH:mm:ss format',
  })
  horaire_debut?: string;

  @ApiPropertyOptional({
    description: 'End time of confession in HH:mm or HH:mm:ss format',
    example: '17:00',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaire_fin must be in HH:mm or HH:mm:ss format',
  })
  horaire_fin?: string;

  @ApiPropertyOptional({
    description: 'Frequency of confession schedule',
    example: 'weekly',
    enum: ['daily', 'weekly', 'monthly', 'on_demand'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'on_demand'])
  granularite?: string;

  @ApiPropertyOptional({
    description: 'Code of the ecclesiastical unit where confession is held',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_ecclesiale?: number;
}
