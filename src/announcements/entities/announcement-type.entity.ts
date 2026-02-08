import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('type_communique')
export class AnnouncementType {
  @PrimaryGeneratedColumn()
  code: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
