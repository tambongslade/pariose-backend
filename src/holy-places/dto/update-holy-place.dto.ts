import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHolyPlaceDto {
  @ApiPropertyOptional({
    description: 'Name of the holy place',
    example: 'Chapel of Our Lady of Lourdes',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the holy place',
    example: '456 Pilgrimage Road, Yaounde, Cameroon',
  })
  @IsString()
  @IsOptional()
  adresse?: string;

  @ApiPropertyOptional({
    description: 'URL or path to photo of the holy place',
    example: 'https://example.com/photos/chapel.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the holy place',
    example: 11.5021,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Latitude coordinate of the holy place',
    example: 3.848,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Code of the ecclesiastical unit managing the holy place',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_ecclesiale?: number;
}
