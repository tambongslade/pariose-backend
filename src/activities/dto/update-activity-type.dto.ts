import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActivityTypeDto {
  @ApiPropertyOptional({
    description: 'Name of the activity type',
    example: 'Catechism',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiPropertyOptional({
    description: 'Description of the activity type',
    example: 'Religious education and instruction for children and adults',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
