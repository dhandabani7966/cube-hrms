import { Entity, Column, ManyToOne, JoinColumn, OneToOne, ManyToMany, JoinTable, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
import { Employee } from './employee.entity';

@Entity('users')
@Unique(['tenantId', 'email'])
export class User extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_super_admin' })
  isSuperAdmin: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToOne(() => Employee, (employee) => employee.user)
  employee?: Employee;
}
