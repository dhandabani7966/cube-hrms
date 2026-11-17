import { Entity, Column, ManyToOne, JoinColumn, OneToOne, Unique } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Location } from './location.entity';
import { EmployeeProfile } from './employee-profile.entity';

@Entity('employees')
@Unique(['tenantId', 'employeeCode'])
@Unique(['tenantId', 'officialEmail'])
export class Employee extends TenantBaseEntity {
  @Column({ type: 'uuid', name: 'user_id', unique: true, nullable: true })
  userId?: string;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'varchar', length: 50, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'display_name' })
  displayName?: string;

  @Column({ type: 'varchar', length: 255, name: 'official_email' })
  officialEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'personal_email' })
  personalEmail?: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth?: Date;

  @Column({ type: 'date', name: 'date_of_joining' })
  dateOfJoining: Date;

  @Column({ type: 'date', nullable: true, name: 'probation_end_date' })
  probationEndDate?: Date;

  @Column({ type: 'date', nullable: true, name: 'confirmation_date' })
  confirmationDate?: Date;

  @Column({ type: 'varchar', length: 50, default: 'FULL_TIME', name: 'employment_type' })
  employmentType: string;

  @Column({ type: 'varchar', length: 50, default: 'PROBATION', name: 'employment_status' })
  employmentStatus: string;

  @Column({ type: 'uuid', name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'uuid', name: 'designation_id', nullable: true })
  designationId?: string;

  @ManyToOne(() => Designation, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'designation_id' })
  designation?: Designation;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId?: string;

  @ManyToOne(() => Location, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @Column({ type: 'uuid', name: 'reporting_manager_id', nullable: true })
  reportingManagerId?: string;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reporting_manager_id' })
  reportingManager?: Employee;

  @Column({ type: 'uuid', name: 'dotted_line_manager_id', nullable: true })
  dottedLineManagerId?: string;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'dotted_line_manager_id' })
  dottedLineManager?: Employee;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatarUrl?: string;

  @OneToOne(() => EmployeeProfile, (profile) => profile.employee)
  profile?: EmployeeProfile;
}
