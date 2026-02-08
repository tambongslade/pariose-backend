import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EcclesiasticalUnit } from '../../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { ActivityType } from './activity-type.entity';

@Entity('activite')
export class Activity {
  @PrimaryGeneratedColumn()
  code: number;

  @Column()
  libelle: string;

  @Column({ type: 'timestamp', nullable: true })
  date_activite: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  frequence: string; // once, daily, weekly, monthly

  @Column({ type: 'timestamp', nullable: true })
  date_debut: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_fin: Date;

  @Column({ default: 1 })
  statut: number; // 1=active, 0=cancelled, 2=completed

  @Column({ nullable: true })
  lieu: string;

  @Column({ nullable: true })
  code_unite_ecclesiale: number;

  @Column({ nullable: true })
  code_type_activite: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  // Relationships
  @ManyToOne(() => EcclesiasticalUnit, { nullable: true })
  @JoinColumn({ name: 'code_unite_ecclesiale' })
  ecclesiasticalUnit: EcclesiasticalUnit;

  @ManyToOne(() => ActivityType, { nullable: true })
  @JoinColumn({ name: 'code_type_activite' })
  activityType: ActivityType;
}
