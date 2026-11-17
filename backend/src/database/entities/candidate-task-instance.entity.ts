import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Candidate } from './candidate.entity';
import { OnboardingTask } from './onboarding-task.entity';
import { User } from './user.entity';

@Entity('candidate_task_instances')
export class CandidateTaskInstance extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'candidate_id' })
  candidateId: string;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @Column({ type: 'uuid', name: 'task_id', nullable: true })
  taskId?: string;

  @ManyToOne(() => OnboardingTask, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task?: OnboardingTask;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'uuid', name: 'assigned_to_user_id', nullable: true })
  assignedToUserId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedToUser?: User;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'uuid', name: 'completed_by', nullable: true })
  completedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'completed_by' })
  completedByUser?: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
