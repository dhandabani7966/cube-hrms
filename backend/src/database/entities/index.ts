export * from './base.entity';
export * from './tenant.entity';
export * from './permission.entity';
export * from './role.entity';
export * from './user.entity';
export * from './location.entity';
export * from './department.entity';
export * from './designation.entity';
export * from './employee.entity';
export * from './employee-profile.entity';
export * from './employee-job-history.entity';
export * from './employee-hierarchy-closure.entity';
export * from './onboarding-workflow.entity';
export * from './onboarding-task.entity';
export * from './candidate.entity';
export * from './candidate-task-instance.entity';
export * from './profile-update-request.entity';
export * from './announcement.entity';
export * from './approver-delegation.entity';
export * from './case-category.entity';
export * from './sla-policy.entity';
export * from './case.entity';
export * from './case-message.entity';
export * from './document-category.entity';
export * from './employee-document.entity';
export * from './compliance-policy.entity';
export * from './policy-acknowledgement.entity';
export * from './exit-request.entity';
export * from './exit-clearance-item.entity';
export * from './exit-interview.entity';
export * from './fnf-settlement.entity';
export * from './custom-field-definition.entity';
export * from './custom-field-value.entity';

import { Tenant } from './tenant.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { User } from './user.entity';
import { Location } from './location.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Employee } from './employee.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { EmployeeJobHistory } from './employee-job-history.entity';
import { EmployeeHierarchyClosure } from './employee-hierarchy-closure.entity';
import { OnboardingWorkflow } from './onboarding-workflow.entity';
import { OnboardingTask } from './onboarding-task.entity';
import { Candidate } from './candidate.entity';
import { CandidateTaskInstance } from './candidate-task-instance.entity';
import { ProfileUpdateRequest } from './profile-update-request.entity';
import { Announcement } from './announcement.entity';
import { ApproverDelegation } from './approver-delegation.entity';
import { CaseCategory } from './case-category.entity';
import { SlaPolicy } from './sla-policy.entity';
import { Case } from './case.entity';
import { CaseMessage } from './case-message.entity';
import { DocumentCategory } from './document-category.entity';
import { EmployeeDocument } from './employee-document.entity';
import { CompliancePolicy } from './compliance-policy.entity';
import { PolicyAcknowledgement } from './policy-acknowledgement.entity';
import { ExitRequest } from './exit-request.entity';
import { ExitClearanceItem } from './exit-clearance-item.entity';
import { ExitInterview } from './exit-interview.entity';
import { FnfSettlement } from './fnf-settlement.entity';
import { CustomFieldDefinition } from './custom-field-definition.entity';
import { CustomFieldValue } from './custom-field-value.entity';

export const ENTITIES = [
  Tenant,
  Permission,
  Role,
  User,
  Location,
  Department,
  Designation,
  Employee,
  EmployeeProfile,
  EmployeeJobHistory,
  EmployeeHierarchyClosure,
  OnboardingWorkflow,
  OnboardingTask,
  Candidate,
  CandidateTaskInstance,
  ProfileUpdateRequest,
  Announcement,
  ApproverDelegation,
  CaseCategory,
  SlaPolicy,
  Case,
  CaseMessage,
  DocumentCategory,
  EmployeeDocument,
  CompliancePolicy,
  PolicyAcknowledgement,
  ExitRequest,
  ExitClearanceItem,
  ExitInterview,
  FnfSettlement,
  CustomFieldDefinition,
  CustomFieldValue,
];
