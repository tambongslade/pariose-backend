import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnnouncementTypeDto {
  @ApiPropertyOptional({
    description: 'Name of the announcement type',
    example: 'Event',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiPropertyOptional({
    description: 'Description of the announcement type',
    example: 'Announcements related to upcoming parish events',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
