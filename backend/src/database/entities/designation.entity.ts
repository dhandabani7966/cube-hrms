import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Department } from './department.entity';

@Entity('designations')
@Unique(['tenantId', 'code'])
export class Designation extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'uuid', name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'grade_level' })
  gradeLevel?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
