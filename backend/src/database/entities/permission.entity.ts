import { Entity, Column, PrimaryGeneratedColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';

@Entity('permissions')
export class Permission extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
