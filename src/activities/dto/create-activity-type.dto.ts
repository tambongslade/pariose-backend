import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityTypeDto {
  @ApiProperty({
    description: 'Name of the activity type',
    example: 'Catechism',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({
    description: 'Description of the activity type',
    example: 'Religious education and instruction for children and adults',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
