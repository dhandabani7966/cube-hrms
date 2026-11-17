import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_hierarchy_closure')
export class EmployeeHierarchyClosure extends TypeOrmBaseEntity {
  @PrimaryColumn('uuid', { name: 'ancestor_id' })
  ancestorId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ancestor_id' })
  ancestor: Employee;

  @PrimaryColumn('uuid', { name: 'descendant_id' })
  descendantId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'descendant_id' })
  descendant: Employee;

  @Column({ type: 'int' })
  depth: number;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;
}
