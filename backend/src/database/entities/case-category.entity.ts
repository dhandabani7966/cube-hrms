import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('case_categories')
@Unique(['tenantId', 'code'])
export class CaseCategory extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 50, default: 'HR_ADMIN', name: 'default_assignee_role' })
  defaultAssigneeRole: string;

  @Column({ type: 'uuid', name: 'default_assignee_id', nullable: true })
  defaultAssigneeId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'default_assignee_id' })
  defaultAssignee?: User;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
