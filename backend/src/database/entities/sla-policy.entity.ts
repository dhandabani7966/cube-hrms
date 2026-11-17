import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('sla_policies')
@Unique(['tenantId', 'priority'])
export class SlaPolicy extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  priority: string;

  @Column({ type: 'int', name: 'first_response_time_minutes' })
  firstResponseTimeMinutes: number;

  @Column({ type: 'int', name: 'resolution_time_minutes' })
  resolutionTimeMinutes: number;

  @Column({ type: 'uuid', name: 'escalation_user_id', nullable: true })
  escalationUserId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'escalation_user_id' })
  escalationUser?: User;
}
