import { Entity, Column, ManyToMany, JoinTable, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Permission } from './permission.entity';

@Entity('roles')
@Unique(['tenantId', 'code'])
export class Role extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false, name: 'is_system_role' })
  isSystemRole: boolean;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
