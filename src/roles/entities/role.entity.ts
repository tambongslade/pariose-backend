import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ unique: true })
  libelle: string;

  @Column({ nullable: true })
  code_createur: number;

  @Column({ nullable: true })
  code_modificateur: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'code_role', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'code_permission', referencedColumnName: 'code' },
  })
  permissions: Permission[];
}
