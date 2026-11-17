import { Entity, Column, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';

@Entity('document_categories')
@Unique(['tenantId', 'code'])
export class DocumentCategory extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'boolean', default: false, name: 'is_confidential' })
  isConfidential: boolean;
}
