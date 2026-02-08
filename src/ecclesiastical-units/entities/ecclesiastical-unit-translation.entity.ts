import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EcclesiasticalUnit } from './ecclesiastical-unit.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('ecclesiastical_unit_translations')
@Unique(['ecclesiasticalUnit', 'language'])
@Index(['ecclesiasticalUnitCode', 'languageCode'])
export class EcclesiasticalUnitTranslation {
  @ApiProperty({
    description: 'Translation ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the ecclesiastical unit in this language',
    example: 'Saint Mary Parish',
  })
  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @ApiProperty({
    description: 'Description of the unit in this language',
    example: 'A welcoming Catholic community',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Address in this language',
    example: '123 Church Street, Montreal, QC',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  adresse: string;

  // Relations
  @ManyToOne(() => EcclesiasticalUnit, (unit) => unit.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ecclesiastical_unit_code' })
  ecclesiasticalUnit: EcclesiasticalUnit;

  @ApiProperty({
    description: 'Ecclesiastical unit code',
  })
  @Column({ name: 'ecclesiastical_unit_code' })
  ecclesiasticalUnitCode: number;

  @ManyToOne(() => Language, { eager: true })
  @JoinColumn({ name: 'language_code' })
  language: Language;

  @ApiProperty({
    description: 'Language code',
    example: 'en',
  })
  @Column({ name: 'language_code', type: 'varchar', length: 5 })
  languageCode: string;

  @ApiProperty({
    description: 'Creation date',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
