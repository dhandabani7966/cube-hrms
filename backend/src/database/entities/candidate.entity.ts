import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Location } from './location.entity';
import { Employee } from './employee.entity';
import { OnboardingWorkflow } from './onboarding-workflow.entity';

@Entity('candidates')
export class Candidate extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({ type: 'date', name: 'offer_date' })
  offerDate: Date;

  @Column({ type: 'date', name: 'joining_date' })
  joiningDate: Date;

  @Column({ type: 'uuid', name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'uuid', name: 'designation_id', nullable: true })
  designationId?: string;

  @ManyToOne(() => Designation, { nullable: true })
  @JoinColumn({ name: 'designation_id' })
  designation?: Designation;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId?: string;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @Column({ type: 'uuid', name: 'reporting_manager_id', nullable: true })
  reportingManagerId?: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'reporting_manager_id' })
  reportingManager?: Employee;

  @Column({ type: 'uuid', name: 'workflow_id', nullable: true })
  workflowId?: string;

  @ManyToOne(() => OnboardingWorkflow, { nullable: true })
  @JoinColumn({ name: 'workflow_id' })
  workflow?: OnboardingWorkflow;

  @Column({ type: 'varchar', length: 50, default: 'OFFER_ACCEPTED' })
  status: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true, name: 'portal_access_token' })
  portalAccessToken?: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'portal_token_expiry' })
  portalTokenExpiry?: Date;

  @Column({ type: 'uuid', nullable: true, name: 'converted_employee_id' })
  convertedEmployeeId?: string;
}
