import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EcclesiasticalUnit } from '../../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { MassIntention } from './mass-intention.entity';

@Entity('celebration_eucharistique')
export class Celebration {
  @PrimaryGeneratedColumn()
  code: number;

  @Column()
  libelle: string;

  @Column({ nullable: true })
  granularite: string; // daily, weekly, monthly

  @Column({ nullable: true })
  code_horaire: string;

  @Column({ nullable: true })
  code_type: string; // regular, special, feast day

  @Column({ nullable: true })
  code_unite_ecclesiale: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  // Relationships
  @ManyToOne(() => EcclesiasticalUnit, { nullable: true })
  @JoinColumn({ name: 'code_unite_ecclesiale' })
  ecclesiasticalUnit: EcclesiasticalUnit;

  @OneToMany(() => MassIntention, (intention) => intention.celebration)
  intentions: MassIntention[];
}
