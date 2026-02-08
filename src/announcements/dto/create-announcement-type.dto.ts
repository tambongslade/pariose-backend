import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementTypeDto {
  @ApiProperty({
    description: 'Name of the announcement type',
    example: 'Event',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({
    description: 'Description of the announcement type',
    example: 'Announcements related to upcoming parish events',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
