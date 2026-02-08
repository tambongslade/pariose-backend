import { IsOptional, IsString, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryActivityDto {
  @ApiPropertyOptional({
    description: 'Search term to filter activities by name or description',
    example: 'Bible Study',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by ecclesiastical unit code',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  code_unite_ecclesiale?: number;

  @ApiPropertyOptional({
    description: 'Filter by activity type code',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  code_type_activite?: number;

  @ApiPropertyOptional({
    description: 'Filter by activity frequency',
    example: 'weekly',
  })
  @IsOptional()
  @IsString()
  frequence?: string;

  @ApiPropertyOptional({
    description: 'Filter by activity status (0: planned, 1: ongoing, 2: completed)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  statut?: number;

  @ApiPropertyOptional({
    description: 'Filter activities from this date in ISO 8601 format',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Filter activities up to this date in ISO 8601 format',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  date_to?: string;

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
