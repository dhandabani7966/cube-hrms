import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { User } from './user.entity';

@Entity('employee_job_history')
export class EmployeeJobHistory extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 50, name: 'change_type' })
  changeType: string;

  @Column({ type: 'date', name: 'effective_date' })
  effectiveDate: Date;

  @Column({ type: 'uuid', name: 'previous_department_id', nullable: true })
  previousDepartmentId?: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'previous_department_id' })
  previousDepartment?: Department;

  @Column({ type: 'uuid', name: 'new_department_id', nullable: true })
  newDepartmentId?: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'new_department_id' })
  newDepartment?: Department;

  @Column({ type: 'uuid', name: 'previous_designation_id', nullable: true })
  previousDesignationId?: string;

  @ManyToOne(() => Designation, { nullable: true })
  @JoinColumn({ name: 'previous_designation_id' })
  previousDesignation?: Designation;

  @Column({ type: 'uuid', name: 'new_designation_id', nullable: true })
  newDesignationId?: string;

  @ManyToOne(() => Designation, { nullable: true })
  @JoinColumn({ name: 'new_designation_id' })
  newDesignation?: Designation;

  @Column({ type: 'uuid', name: 'previous_manager_id', nullable: true })
  previousManagerId?: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'previous_manager_id' })
  previousManager?: Employee;

  @Column({ type: 'uuid', name: 'new_manager_id', nullable: true })
  newManagerId?: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'new_manager_id' })
  newManager?: Employee;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', name: 'recorded_by', nullable: true })
  recordedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recorded_by' })
  recorder?: User;
}
