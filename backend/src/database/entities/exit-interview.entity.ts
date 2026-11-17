import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { ExitRequest } from './exit-request.entity';
import { User } from './user.entity';

@Entity('exit_interviews')
export class ExitInterview extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'exit_request_id' })
  exitRequestId: string;

  @OneToOne(() => ExitRequest, (req) => req.interview, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exit_request_id' })
  exitRequest: ExitRequest;

  @Column({ type: 'varchar', length: 100, name: 'primary_reason' })
  primaryReason: string;

  @Column({ type: 'int', nullable: true, name: 'manager_rating' })
  managerRating?: number;

  @Column({ type: 'int', nullable: true, name: 'culture_rating' })
  cultureRating?: number;

  @Column({ type: 'int', nullable: true, name: 'compensation_rating' })
  compensationRating?: number;

  @Column({ type: 'int', nullable: true, name: 'growth_opportunity_rating' })
  growthOpportunityRating?: number;

  @Column({ type: 'text', nullable: true, name: 'feedback_notes' })
  feedbackNotes?: string;

  @Column({ type: 'uuid', name: 'conducted_by', nullable: true })
  conductedBy?: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'conducted_by' })
  conductor?: User;

  @CreateDateColumn({ type: 'timestamptz', name: 'submitted_at' })
  submittedAt: Date;
}
