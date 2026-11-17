import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { User } from './user.entity';

@Entity('profile_update_requests')
export class ProfileUpdateRequest extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 100, name: 'field_name' })
  fieldName: string;

  @Column({ type: 'jsonb', nullable: true, name: 'old_value' })
  oldValue?: Record<string, any>;

  @Column({ type: 'jsonb', name: 'new_value' })
  newValue: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'varchar', length: 50, default: 'SUBMITTED' })
  status: string;

  @Column({ type: 'uuid', name: 'reviewed_by', nullable: true })
  reviewedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer?: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'reviewed_at' })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true, name: 'reviewer_comments' })
  reviewerComments?: string;
}
