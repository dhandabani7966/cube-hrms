import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  subdomain: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  domain?: string;

  @Column({ type: 'varchar', length: 50, default: 'ENTERPRISE', name: 'subscription_plan' })
  subscriptionPlan: string;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];
}
