import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEcclesiasticalUnitDto {
  @ApiPropertyOptional({
    description: 'Name of the ecclesiastical unit',
    example: 'Saint Mary Parish',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the ecclesiastical unit',
    example: 'A vibrant parish community serving the local Catholic population',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Title or designation of the ecclesiastical unit',
    example: 'Parish',
  })
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the ecclesiastical unit',
    example: '123 Church Street, Yaounde, Cameroon',
  })
  @IsString()
  @IsOptional()
  adresse?: string;

  @ApiPropertyOptional({
    description: 'Type code of the ecclesiastical unit',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_type?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the location',
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
    description: 'Latitude coordinate of the location',
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
    description: 'Altitude of the location in meters',
    example: 750,
  })
  @IsNumber()
  @IsOptional()
  altitude?: number;

  @ApiPropertyOptional({
    description: 'Information about the faithful/parishioners',
    example: 'Approximately 5000 registered parishioners',
  })
  @IsString()
  @IsOptional()
  fidele?: string;

  @ApiPropertyOptional({
    description: 'Date when the ecclesiastical unit was created in ISO 8601 format',
    example: '2010-06-15',
  })
  @IsDateString()
  @IsOptional()
  date_creation_unite?: string;

  @ApiPropertyOptional({
    description: 'Canonical status of the unit',
    example: 'Established Parish',
  })
  @IsString()
  @IsOptional()
  statut_canonique?: string;

  @ApiPropertyOptional({
    description: 'Code of the parent ecclesiastical unit',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_parent?: number;

  @ApiPropertyOptional({
    description: 'Activities associated with the unit',
    example: 'Daily Mass, Catechism, Youth Ministry',
  })
  @IsString()
  @IsOptional()
  activite?: string;
}
