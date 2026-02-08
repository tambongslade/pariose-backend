import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Celebration } from './celebration.entity';
import { User } from '../../users/entities/user.entity';

@Entity('intention_messe')
export class MassIntention {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'text' })
  intention_messe: string;

  @Column({ nullable: true })
  code_celebration_eucharistique: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant_verse: string;

  @Column({ type: 'date', nullable: true })
  date_versement: Date;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  // Relationships
  @ManyToOne(() => Celebration, (celebration) => celebration.intentions)
  @JoinColumn({ name: 'code_celebration_eucharistique' })
  celebration: Celebration;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_createur' })
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_modificateur' })
  modifier: User;
}
