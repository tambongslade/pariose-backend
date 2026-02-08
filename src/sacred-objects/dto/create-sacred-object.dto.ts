import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSacredObjectDto {
  @ApiProperty({
    description: 'Name of the sacred object',
    example: 'Monstrance of Saint Peter',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the sacred object',
    example: 'A beautiful golden monstrance used for Eucharistic adoration',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL or path to photo of the sacred object',
    example: 'https://example.com/photos/monstrance.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Code of the ecclesiastical unit where the object is kept',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_ecclesiale?: number;
}
