import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnnouncementType } from './announcement-type.entity';
import { EcclesiasticalUnit } from '../../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('communiques_paroissiaux')
export class Announcement {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'text', nullable: true })
  contenu: string;

  @Column({ nullable: true })
  code_type: number;

  @Column({ nullable: true })
  code_unite_ecclesiale: number;

  @Column({ type: 'timestamp', nullable: true })
  date_publication: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_expiration: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  date_modification: Date;

  @Column({ nullable: true })
  code_createur: number;

  // Relations
  @ManyToOne(() => AnnouncementType, { nullable: true })
  @JoinColumn({ name: 'code_type' })
  announcementType: AnnouncementType;

  @ManyToOne(() => EcclesiasticalUnit, { nullable: true })
  @JoinColumn({ name: 'code_unite_ecclesiale' })
  ecclesiasticalUnit: EcclesiasticalUnit;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'code_createur' })
  creator: User;
}
