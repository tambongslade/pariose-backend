import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSacredObjectDto {
  @ApiPropertyOptional({
    description: 'Name of the sacred object',
    example: 'Monstrance of Saint Peter',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

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
