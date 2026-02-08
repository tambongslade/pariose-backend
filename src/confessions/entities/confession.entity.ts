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

@Entity('confessions')
export class Confession {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lieu: string;

  @Column({ type: 'time', nullable: true })
  horaire_debut: string;

  @Column({ type: 'time', nullable: true })
  horaire_fin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  granularite: string;

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
