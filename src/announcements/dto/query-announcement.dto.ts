import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAnnouncementDto {
  @ApiPropertyOptional({
    description: 'Search term to filter announcements by title or content',
    example: 'Festival',
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
    description: 'Filter by announcement type code',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  code_type?: number;

  @ApiPropertyOptional({
    description: 'Filter announcements from this date in ISO 8601 format',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Filter announcements up to this date in ISO 8601 format',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  date_to?: string;

  @ApiPropertyOptional({
    description: 'Filter to show only active announcements (not expired)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  active_only?: boolean;

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
