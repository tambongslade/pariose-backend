import { IsOptional, IsString, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryEcclesiasticalUnitDto {
  @ApiPropertyOptional({
    description: 'Search term to filter ecclesiastical units by name or description',
    example: 'Saint Mary',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by ecclesiastical unit type code',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  code_type?: number;

  @ApiPropertyOptional({
    description: 'Filter by parent ecclesiastical unit code',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  code_unite_parent?: number;

  @ApiPropertyOptional({
    description: 'Filter by canonical status',
    example: 'Established Parish',
  })
  @IsOptional()
  @IsString()
  statut_canonique?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate for location-based search',
    example: 3.848,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate for location-based search',
    example: 11.5021,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers (used with latitude and longitude)',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  radius?: number; // in kilometers

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
