import {
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryConfessionDto {
  @ApiPropertyOptional({
    description: 'Search term to filter confessions by location',
    example: 'Main Church',
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
    description: 'Filter by confession frequency',
    example: 'weekly',
  })
  @IsOptional()
  @IsString()
  granularite?: string;

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
