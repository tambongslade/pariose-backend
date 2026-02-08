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
import { User } from '../../users/entities/user.entity';

@Entity('objets_sacres')
export class SacredObject {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @Column({ nullable: true })
  code_unite_ecclesiale: number;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  date_modification: Date;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  // Relations
  @ManyToOne(() => EcclesiasticalUnit, { nullable: true })
  @JoinColumn({ name: 'code_unite_ecclesiale' })
  ecclesiasticalUnit: EcclesiasticalUnit;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_createur' })
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_modificateur' })
  modifier: User;
}
