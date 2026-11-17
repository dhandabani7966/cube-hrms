import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';

@Entity('departments')
@Unique(['tenantId', 'code'])
export class Department extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'uuid', name: 'parent_department_id', nullable: true })
  parentDepartmentId?: string;

  @ManyToOne(() => Department, (dept) => dept.subDepartments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parent_department_id' })
  parentDepartment?: Department;

  @OneToMany(() => Department, (dept) => dept.parentDepartment)
  subDepartments: Department[];

  @Column({ type: 'uuid', name: 'lead_employee_id', nullable: true })
  leadEmployeeId?: string;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'lead_employee_id' })
  leadEmployee?: Employee;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
