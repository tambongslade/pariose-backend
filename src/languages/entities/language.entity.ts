import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('languages')
export class Language {
  @ApiProperty({
    example: 'en',
    description: 'Language code (ISO 639-1 format)',
  })
  @PrimaryColumn({ type: 'varchar', length: 5 })
  code: string;

  @ApiProperty({
    example: 'English',
    description: 'Language name',
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Is this the default language for the application',
  })
  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @ApiProperty({
    example: true,
    description: 'Is this language currently active',
  })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({
    description: 'Date when the language was added',
  })
  @CreateDateColumn()
  created_at: Date;
}
