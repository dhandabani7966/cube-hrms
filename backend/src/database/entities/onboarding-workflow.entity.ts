import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Location } from './location.entity';
import { OnboardingTask } from './onboarding-task.entity';

@Entity('onboarding_workflows')
export class OnboardingWorkflow extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'uuid', name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId?: string;

  @ManyToOne(() => Location, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => OnboardingTask, (task) => task.workflow)
  tasks: OnboardingTask[];
}
