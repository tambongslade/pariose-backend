import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name/label',
    example: 'PARISH_ADMIN',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator for a specific parish',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of permission IDs to assign to this role',
    type: [Number],
    required: false,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}
