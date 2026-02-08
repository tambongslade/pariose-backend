import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EcclesiasticalUnitTranslation } from './ecclesiastical-unit-translation.entity';

@Entity('unite_ecclesiale')
export class EcclesiasticalUnit {
  @PrimaryGeneratedColumn()
  code: number;

  @Column()
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  titre: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  code_type: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  altitude: string;

  @Column({ nullable: true })
  fidele: string;

  @Column({ type: 'timestamp', nullable: true })
  date_creation_unite: Date;

  @Column({ nullable: true })
  statut_canonique: string;

  @Column({ nullable: true })
  code_unite_parent: number;

  @Column({ nullable: true })
  activite: string;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  // Relationships
  @ManyToOne(() => EcclesiasticalUnit, (unit) => unit.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'code_unite_parent' })
  parent: EcclesiasticalUnit;

  @OneToMany(() => EcclesiasticalUnit, (unit) => unit.parent)
  children: EcclesiasticalUnit[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'abonnement_unite_ecclesiale',
    joinColumn: { name: 'code_unite_ecclesiale', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'code_utilisateur', referencedColumnName: 'code' },
  })
  subscribers: User[];

  // Translations relation
  @OneToMany(
    () => EcclesiasticalUnitTranslation,
    (translation) => translation.ecclesiasticalUnit,
    { cascade: true, eager: false },
  )
  translations: EcclesiasticalUnitTranslation[];
}
