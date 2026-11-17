import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum CustomFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DROPDOWN = 'DROPDOWN',
  MULTI_SELECT = 'MULTI_SELECT',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  URL = 'URL',
  FILE = 'FILE',
}

@Entity('custom_field_definitions')
@Index(['tenant_id', 'field_name'], { unique: true })
export class CustomFieldDefinition extends BaseEntity {
  @Column({ name: 'field_label', type: 'varchar', length: 100 })
  field_label: string;

  @Column({ name: 'field_name', type: 'varchar', length: 50 })
  field_name: string;

  @Column({ name: 'field_type', type: 'enum', enum: CustomFieldType, default: CustomFieldType.TEXT })
  field_type: CustomFieldType;

  @Column({ name: 'section_id', type: 'varchar', length: 50, default: 'personal-info' })
  section_id: string;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  is_required: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @Column({ name: 'is_visible_to_employee', type: 'boolean', default: true })
  is_visible_to_employee: boolean;

  @Column({ name: 'options', type: 'jsonb', nullable: true })
  options: string[] | null;

  @Column({ name: 'validation_rules', type: 'jsonb', nullable: true })
  validation_rules: Record<string, any> | null;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  display_order: number;
}
