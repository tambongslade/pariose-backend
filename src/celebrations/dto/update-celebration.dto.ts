import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCelebrationDto {
  @ApiPropertyOptional({
    description: 'Name of the celebration',
    example: 'Sunday Morning Mass',
  })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiPropertyOptional({
    description: 'Frequency of the celebration',
    example: 'weekly',
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'once'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly', 'once'])
  granularite?: string;

  @ApiPropertyOptional({
    description: 'Time of the celebration in HH:mm format',
    example: '09:00',
  })
  @IsString()
  @IsOptional()
  code_horaire?: string;

  @ApiPropertyOptional({
    description: 'Type of celebration',
    example: 'regular',
    enum: ['regular', 'special', 'feast', 'wedding', 'funeral', 'baptism'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['regular', 'special', 'feast', 'wedding', 'funeral', 'baptism'])
  code_type?: string;

  @ApiPropertyOptional({
    description: 'Code of the ecclesiastical unit where the celebration takes place',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  code_unite_ecclesiale?: number;
}
