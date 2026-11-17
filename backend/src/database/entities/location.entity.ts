import { Entity, Column, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';

@Entity('locations')
@Unique(['tenantId', 'code'])
export class Location extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address_line1' })
  addressLine1?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address_line2' })
  addressLine2?: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'postal_code' })
  postalCode?: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
