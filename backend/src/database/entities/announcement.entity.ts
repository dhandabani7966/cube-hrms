import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Location } from './location.entity';
import { User } from './user.entity';

@Entity('announcements')
export class Announcement extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, default: 'ALL', name: 'target_scope' })
  targetScope: string;

  @Column({ type: 'uuid', name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId?: string;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @Column({ type: 'varchar', length: 50, default: 'NORMAL' })
  priority: string;

  @Column({ type: 'uuid', name: 'published_by' })
  publishedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'published_by' })
  publisher: User;

  @Column({ type: 'timestamptz', name: 'published_at' })
  publishedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' })
  expiresAt?: Date;
}
