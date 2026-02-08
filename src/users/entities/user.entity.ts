import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  noms: string;

  @Column({ nullable: true })
  prenoms: string;

  @Column({ type: 'date', nullable: true })
  date_naissance: Date;

  @Column({ nullable: true })
  contact_1: string;

  @Column({ nullable: true })
  contact_2: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  addresse: string;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'role_utilisateur',
    joinColumn: { name: 'code_utilisateur', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'code_role', referencedColumnName: 'code' },
  })
  roles: Role[];
}
