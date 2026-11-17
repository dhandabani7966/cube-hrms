import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';

@Entity('approver_delegations')
export class ApproverDelegation extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'delegator_employee_id' })
  delegatorEmployeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'delegator_employee_id' })
  delegator: Employee;

  @Column({ type: 'uuid', name: 'delegatee_employee_id' })
  delegateeEmployeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'delegatee_employee_id' })
  delegatee: Employee;

  @Column({ type: 'varchar', length: 50, default: 'ALL' })
  module: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
