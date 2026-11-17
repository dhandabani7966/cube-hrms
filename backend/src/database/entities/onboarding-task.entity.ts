import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { OnboardingWorkflow } from './onboarding-workflow.entity';

@Entity('onboarding_tasks')
export class OnboardingTask extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'workflow_id' })
  workflowId: string;

  @ManyToOne(() => OnboardingWorkflow, (wf) => wf.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_id' })
  workflow: OnboardingWorkflow;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, name: 'assigned_role_code' })
  assignedRoleCode: string;

  @Column({ type: 'int', default: 0, name: 'due_day_offset' })
  dueDayOffset: number;

  @Column({ type: 'boolean', default: true, name: 'is_mandatory' })
  isMandatory: boolean;

  @Column({ type: 'int', default: 1, name: 'task_order' })
  taskOrder: number;
}
