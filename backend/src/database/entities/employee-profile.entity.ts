import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_profiles')
export class EmployeeProfile extends TypeOrmBaseEntity {
  @PrimaryColumn('uuid', { name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Employee, (emp) => emp.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'marital_status' })
  maritalStatus?: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'blood_group' })
  bloodGroup?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'pan_number' })
  panNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'aadhaar_number' })
  aadhaarNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'passport_number' })
  passportNumber?: string;

  @Column({ type: 'date', nullable: true, name: 'passport_expiry' })
  passportExpiry?: Date;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'bank_name' })
  bankName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'bank_account_number' })
  bankAccountNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'bank_ifsc_code' })
  bankIfscCode?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'residential_address' })
  residentialAddress?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'permanent_address' })
  permanentAddress?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'emergency_contacts' })
  emergencyContacts?: Record<string, any>;
}
