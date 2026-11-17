import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { ExitRequest } from './exit-request.entity';

@Entity('fnf_settlements')
export class FnfSettlement extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'exit_request_id' })
  exitRequestId: string;

  @OneToOne(() => ExitRequest, (req) => req.settlement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exit_request_id' })
  exitRequest: ExitRequest;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'working_days_pay' })
  workingDaysPay: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'leave_encashment_amount' })
  leaveEncashmentAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'gratuity_amount' })
  gratuityAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'bonus_incentives' })
  bonusIncentives: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'notice_recovery_amount' })
  noticeRecoveryAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'asset_damage_deductions' })
  assetDamageDeductions: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'loan_deductions' })
  loanDeductions: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0, name: 'net_payable' })
  netPayable: number;

  @Column({ type: 'varchar', length: 50, default: 'DRAFT', name: 'settlement_status' })
  settlementStatus: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
  processedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
