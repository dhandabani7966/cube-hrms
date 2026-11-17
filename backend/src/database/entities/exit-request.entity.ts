import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { ExitClearanceItem } from './exit-clearance-item.entity';
import { ExitInterview } from './exit-interview.entity';
import { FnfSettlement } from './fnf-settlement.entity';

@Entity('exit_requests')
export class ExitRequest extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 50, default: 'VOLUNTARY' })
  type: string;

  @Column({ type: 'varchar', length: 100, name: 'reason_category' })
  reasonCategory: string;

  @Column({ type: 'text', nullable: true, name: 'reason_details' })
  reasonDetails?: string;

  @Column({ type: 'date', name: 'submission_date' })
  submissionDate: Date;

  @Column({ type: 'date', name: 'desired_last_working_day' })
  desiredLastWorkingDay: Date;

  @Column({ type: 'date', nullable: true, name: 'approved_last_working_day' })
  approvedLastWorkingDay?: Date;

  @Column({ type: 'int', default: 60, name: 'notice_period_days' })
  noticePeriodDays: number;

  @Column({ type: 'int', default: 0, name: 'notice_shortfall_days' })
  noticeShortfallDays: number;

  @Column({ type: 'varchar', length: 50, default: 'SUBMITTED' })
  status: string;

  @Column({ type: 'text', nullable: true, name: 'manager_comments' })
  managerComments?: string;

  @Column({ type: 'text', nullable: true, name: 'hr_comments' })
  hrComments?: string;

  @OneToMany(() => ExitClearanceItem, (item) => item.exitRequest)
  clearanceItems: ExitClearanceItem[];

  @OneToOne(() => ExitInterview, (interview) => interview.exitRequest)
  interview?: ExitInterview;

  @OneToOne(() => FnfSettlement, (settlement) => settlement.exitRequest)
  settlement?: FnfSettlement;
}
