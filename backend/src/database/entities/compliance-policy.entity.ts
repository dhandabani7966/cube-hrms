import { Entity, Column } from 'typeorm';
import { TenantBaseEntity } from './base.entity';

@Entity('compliance_policies')
export class CompliancePolicy extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50, default: '1.0' })
  version: string;

  @Column({ type: 'varchar', length: 500, name: 'content_key' })
  contentKey: string;

  @Column({ type: 'boolean', default: true, name: 'is_mandatory' })
  isMandatory: boolean;

  @Column({ type: 'date', name: 'effective_date' })
  effectiveDate: Date;
}
