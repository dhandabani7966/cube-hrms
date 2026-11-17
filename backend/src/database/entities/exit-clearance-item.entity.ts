import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { ExitRequest } from './exit-request.entity';
import { User } from './user.entity';

@Entity('exit_clearance_items')
export class ExitClearanceItem extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'exit_request_id' })
  exitRequestId: string;

  @ManyToOne(() => ExitRequest, (req) => req.clearanceItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exit_request_id' })
  exitRequest: ExitRequest;

  @Column({ type: 'varchar', length: 50, name: 'department_type' })
  departmentType: string;

  @Column({ type: 'varchar', length: 200, name: 'item_title' })
  itemTitle: string;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'uuid', name: 'cleared_by', nullable: true })
  clearedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'cleared_by' })
  clearedByUser?: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'cleared_at' })
  clearedAt?: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'recovery_amount' })
  recoveryAmount: number;

  @Column({ type: 'text', nullable: true })
  comments?: string;
}
