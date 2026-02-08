import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EcclesiasticalUnit } from '../../ecclesiastical-units/entities/ecclesiastical-unit.entity';

@Entity('lieux_saint')
export class HolyPlace {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adresse: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: string;

  @Column({ nullable: true })
  code_unite_ecclesiale: number;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  date_modification: Date;

  // Relations
  @ManyToOne(() => EcclesiasticalUnit, { nullable: true })
  @JoinColumn({ name: 'code_unite_ecclesiale' })
  ecclesiasticalUnit: EcclesiasticalUnit;
}
