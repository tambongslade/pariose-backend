import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('type_activite')
export class ActivityType {
  @PrimaryGeneratedColumn()
  code: number;

  @Column()
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  @CreateDateColumn()
  date_creation: Date;

  // Relationships
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_createur' })
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_modificateur' })
  modifier: User;
}
