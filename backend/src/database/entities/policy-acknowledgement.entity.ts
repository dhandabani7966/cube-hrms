import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, Unique, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { CompliancePolicy } from './compliance-policy.entity';
import { Employee } from './employee.entity';

@Entity('policy_acknowledgements')
@Unique(['tenantId', 'policyId', 'employeeId'])
export class PolicyAcknowledgement extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'policy_id' })
  policyId: string;

  @ManyToOne(() => CompliancePolicy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policy_id' })
  policy: CompliancePolicy;

  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @CreateDateColumn({ type: 'timestamptz', name: 'acknowledged_at' })
  acknowledgedAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'ip_address' })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true, name: 'user_agent' })
  userAgent?: string;
}
