import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { DocumentCategory } from './document-category.entity';
import { User } from './user.entity';

@Entity('employee_documents')
export class EmployeeDocument extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => DocumentCategory)
  @JoinColumn({ name: 'category_id' })
  category: DocumentCategory;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500, name: 'file_key' })
  fileKey: string;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  fileName: string;

  @Column({ type: 'bigint', name: 'file_size_bytes' })
  fileSizeBytes: number;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'date', nullable: true, name: 'expiry_date' })
  expiryDate?: Date;

  @Column({ type: 'varchar', length: 50, default: 'PENDING', name: 'verification_status' })
  verificationStatus: string;

  @Column({ type: 'uuid', name: 'verified_by', nullable: true })
  verifiedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifier?: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'verified_at' })
  verifiedAt?: Date;
}
