import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
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
}
