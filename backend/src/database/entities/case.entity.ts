import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { CaseCategory } from './case-category.entity';
import { User } from './user.entity';
import { CaseMessage } from './case-message.entity';

@Entity('cases')
@Unique(['tenantId', 'caseNumber'])
export class Case extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'case_number' })
  caseNumber: string;

  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => CaseCategory)
  @JoinColumn({ name: 'category_id' })
  category: CaseCategory;

  @Column({ type: 'varchar', length: 50, default: 'MEDIUM' })
  priority: string;

  @Column({ type: 'varchar', length: 50, default: 'OPEN' })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid', name: 'assigned_to_user_id', nullable: true })
  assignedToUserId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedToUser?: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'response_due_at' })
  responseDueAt?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'resolution_due_at' })
  resolutionDueAt?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'first_responded_at' })
  firstRespondedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'resolved_at' })
  resolvedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'closed_at' })
  closedAt?: Date;

  @Column({ type: 'int', nullable: true, name: 'csat_rating' })
  csatRating?: number;

  @Column({ type: 'text', nullable: true, name: 'csat_feedback' })
  csatFeedback?: string;

  @OneToMany(() => CaseMessage, (msg) => msg.case)
  messages: CaseMessage[];
}
