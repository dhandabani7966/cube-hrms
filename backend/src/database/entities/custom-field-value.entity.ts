import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('custom_field_values')
@Index(['tenant_id', 'employee_id', 'field_id'], { unique: true })
export class CustomFieldValue extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employee_id: string;

  @Column({ name: 'field_id', type: 'uuid' })
  field_id: string;

  @Column({ name: 'value_text', type: 'text', nullable: true })
  value_text: string | null;

  @Column({ name: 'value_json', type: 'jsonb', nullable: true })
  value_json: any | null;
}
