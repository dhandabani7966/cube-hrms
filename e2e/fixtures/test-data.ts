/**
 * Comprehensive Seed Data & Test Data Factory for CubeAI HRMS
 */

export const TENANT_A_ID = '11111111-1111-1111-1111-111111111111';
export const TENANT_B_ID = '22222222-2222-2222-2222-222222222222';

export interface SeedData {
  tenants: any[];
  users: any[];
  departments: any[];
  designations: any[];
  locations: any[];
  employees: any[];
  employee_profiles: any[];
  employee_job_history: any[];
  candidates: any[];
  onboarding_workflows: any[];
  onboarding_tasks: any[];
  candidate_task_instances: any[];
  profile_update_requests: any[];
  leave_requests: any[];
  leave_balances: any[];
  approver_delegations: any[];
  case_categories: any[];
  sla_policies: any[];
  cases: any[];
  case_messages: any[];
  document_categories: any[];
  employee_documents: any[];
  compliance_policies: any[];
  policy_acknowledgements: any[];
  exit_requests: any[];
  exit_clearance_items: any[];
  exit_interviews: any[];
  fnf_settlements: any[];
  audit_logs: any[];
  announcements: any[];
}

export const SEED_DATA: SeedData = {
  tenants: [
    {
      id: TENANT_A_ID,
      name: 'Acme Technologies Inc.',
      code: 'ACME',
      domain: 'acme.cubeai.internal',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: TENANT_B_ID,
      name: 'Beta Innovations Ltd.',
      code: 'BETA',
      domain: 'beta.cubeai.internal',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],

  departments: [
    {
      id: 'd1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      code: 'ENG',
      name: 'Engineering',
      parent_department_id: null,
      lead_employee_id: 'e1111111-0000-0000-0000-000000000002', // Manager
      is_active: true,
    },
    {
      id: 'd1111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      code: 'HR',
      name: 'Human Resources',
      parent_department_id: null,
      lead_employee_id: 'e1111111-0000-0000-0000-000000000001', // HR Admin
      is_active: true,
    },
    {
      id: 'd1111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      code: 'FIN',
      name: 'Finance & Accounts',
      parent_department_id: null,
      lead_employee_id: null,
      is_active: true,
    },
    {
      id: 'd2222222-0000-0000-0000-000000000001',
      tenant_id: TENANT_B_ID,
      code: 'ENG-B',
      name: 'Engineering Beta',
      parent_department_id: null,
      lead_employee_id: null,
      is_active: true,
    },
  ],

  designations: [
    {
      id: 'des11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      code: 'VP-ENG',
      name: 'VP of Engineering',
      grade_level: 'L7',
    },
    {
      id: 'des11111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      code: 'SR-DEV',
      name: 'Senior Full Stack Engineer',
      grade_level: 'L5',
    },
    {
      id: 'des11111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      code: 'HR-DIR',
      name: 'Director of HR',
      grade_level: 'L6',
    },
    {
      id: 'des22222-0000-0000-0000-000000000001',
      tenant_id: TENANT_B_ID,
      code: 'LEAD-B',
      name: 'Team Lead Beta',
      grade_level: 'L5',
    },
  ],

  locations: [
    {
      id: 'loc11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      name: 'Chennai HQ',
      city: 'Chennai',
      country: 'India',
    },
    {
      id: 'loc22222-0000-0000-0000-000000000001',
      tenant_id: TENANT_B_ID,
      name: 'Bangalore Hub',
      city: 'Bangalore',
      country: 'India',
    },
  ],

  users: [
    {
      id: 'a1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      email: 'hr.admin@acme.com',
      role_code: 'HR_ADMIN',
      first_name: 'Priya',
      last_name: 'Nair',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      email: 'manager@acme.com',
      role_code: 'LINE_MANAGER',
      first_name: 'Rajesh',
      last_name: 'Verma',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      email: 'john.doe@acme.com',
      role_code: 'EMPLOYEE',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000004',
      tenant_id: TENANT_A_ID,
      email: 'auditor@acme.com',
      role_code: 'AUDITOR',
      first_name: 'Ananya',
      last_name: 'Roy',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000005',
      tenant_id: TENANT_A_ID,
      email: 'jane.smith@acme.com',
      role_code: 'EMPLOYEE',
      first_name: 'Jane',
      last_name: 'Smith',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000006',
      tenant_id: TENANT_A_ID,
      email: 'it.admin@acme.com',
      role_code: 'IT_ADMIN',
      first_name: 'Vikram',
      last_name: 'Singh',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000007',
      tenant_id: TENANT_A_ID,
      email: 'finance.admin@acme.com',
      role_code: 'FINANCE_ADMIN',
      first_name: 'Sneha',
      last_name: 'Iyer',
      is_active: true,
    },
    {
      id: 'a1111111-0000-0000-0000-000000000008',
      tenant_id: TENANT_A_ID,
      email: 'facilities@acme.com',
      role_code: 'ADMIN_FACILITIES',
      first_name: 'Karthik',
      last_name: 'Rao',
      is_active: true,
    },
    // Tenant B Users
    {
      id: 'b1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_B_ID,
      email: 'hr.admin@beta.com',
      role_code: 'HR_ADMIN',
      first_name: 'Beta',
      last_name: 'HR',
      is_active: true,
    },
    {
      id: 'b1111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_B_ID,
      email: 'alice@beta.com',
      role_code: 'EMPLOYEE',
      first_name: 'Alice',
      last_name: 'Beta',
      is_active: true,
    },
  ],

  employees: [
    {
      id: 'e1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      user_id: 'a1111111-0000-0000-0000-000000000001',
      employee_code: 'EMP-0001',
      first_name: 'Priya',
      last_name: 'Nair',
      display_name: 'Priya Nair',
      official_email: 'hr.admin@acme.com',
      personal_email: 'priya.personal@example.com',
      phone_number: '+919876543001',
      date_of_joining: '2023-01-15',
      employment_type: 'FULL_TIME',
      employment_status: 'ACTIVE_CONFIRMED',
      department_id: 'd1111111-0000-0000-0000-000000000002',
      designation_id: 'des11111-0000-0000-0000-000000000003',
      location_id: 'loc11111-0000-0000-0000-000000000001',
      reporting_manager_id: null,
      salary: 1800000,
    },
    {
      id: 'e1111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      user_id: 'a1111111-0000-0000-0000-000000000002',
      employee_code: 'EMP-0002',
      first_name: 'Rajesh',
      last_name: 'Verma',
      display_name: 'Rajesh Verma',
      official_email: 'manager@acme.com',
      personal_email: 'rajesh.personal@example.com',
      phone_number: '+919876543002',
      date_of_joining: '2023-03-01',
      employment_type: 'FULL_TIME',
      employment_status: 'ACTIVE_CONFIRMED',
      department_id: 'd1111111-0000-0000-0000-000000000001',
      designation_id: 'des11111-0000-0000-0000-000000000001',
      location_id: 'loc11111-0000-0000-0000-000000000001',
      reporting_manager_id: null,
      salary: 2400000,
    },
    {
      id: 'e1111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      user_id: 'a1111111-0000-0000-0000-000000000003',
      employee_code: 'EMP-0003',
      first_name: 'John',
      last_name: 'Doe',
      display_name: 'John Doe',
      official_email: 'john.doe@acme.com',
      personal_email: 'john.doe@example.com',
      phone_number: '+919876543003',
      date_of_joining: '2024-06-01',
      employment_type: 'FULL_TIME',
      employment_status: 'ACTIVE_CONFIRMED',
      department_id: 'd1111111-0000-0000-0000-000000000001',
      designation_id: 'des11111-0000-0000-0000-000000000002',
      location_id: 'loc11111-0000-0000-0000-000000000001',
      reporting_manager_id: 'e1111111-0000-0000-0000-000000000002', // Reports to Rajesh
      salary: 1200000,
    },
    {
      id: 'e1111111-0000-0000-0000-000000000005',
      tenant_id: TENANT_A_ID,
      user_id: 'a1111111-0000-0000-0000-000000000005',
      employee_code: 'EMP-0005',
      first_name: 'Jane',
      last_name: 'Smith',
      display_name: 'Jane Smith',
      official_email: 'jane.smith@acme.com',
      personal_email: 'jane.smith@example.com',
      phone_number: '+919876543005',
      date_of_joining: '2024-07-01',
      employment_type: 'FULL_TIME',
      employment_status: 'ACTIVE_CONFIRMED',
      department_id: 'd1111111-0000-0000-0000-000000000001',
      designation_id: 'des11111-0000-0000-0000-000000000002',
      location_id: 'loc11111-0000-0000-0000-000000000001',
      reporting_manager_id: 'e1111111-0000-0000-0000-000000000002', // Reports to Rajesh
      salary: 1250000,
    },
    // Tenant B Employee
    {
      id: 'e2222222-0000-0000-0000-000000000002',
      tenant_id: TENANT_B_ID,
      user_id: 'b1111111-0000-0000-0000-000000000002',
      employee_code: 'EMP-B-0001',
      first_name: 'Alice',
      last_name: 'Beta',
      display_name: 'Alice Beta',
      official_email: 'alice@beta.com',
      personal_email: 'alice.personal@example.com',
      phone_number: '+919876543009',
      date_of_joining: '2025-01-10',
      employment_type: 'FULL_TIME',
      employment_status: 'ACTIVE_CONFIRMED',
      department_id: 'd2222222-0000-0000-0000-000000000001',
      designation_id: 'des22222-0000-0000-0000-000000000001',
      location_id: 'loc22222-0000-0000-0000-000000000001',
      reporting_manager_id: null,
      salary: 1100000,
    },
  ],

  employee_profiles: [
    {
      employee_id: 'e1111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      pan_number: 'ABCDE1234F',
      aadhaar_number: '1234-5678-9012',
      bank_name: 'HDFC Bank',
      bank_account_number: '50100234567890',
      bank_ifsc_code: 'HDFC0001234',
      residential_address: {
        line1: '123 Tech Park Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600096',
      },
      emergency_contacts: [
        { name: 'Mary Doe', relation: 'Spouse', phoneNumber: '+919876500001' },
      ],
    },
  ],

  employee_job_history: [],

  candidates: [
    {
      id: 'c1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      first_name: 'Arun',
      last_name: 'Kumar',
      email: 'arun.kumar@candidate.com',
      phone_number: '+919876543999',
      offer_date: '2026-11-01',
      joining_date: '2026-12-01',
      department_id: 'd1111111-0000-0000-0000-000000000001',
      designation_id: 'des11111-0000-0000-0000-000000000002',
      location_id: 'loc11111-0000-0000-0000-000000000001',
      reporting_manager_id: 'e1111111-0000-0000-0000-000000000002',
      status: 'OFFER_ACCEPTED',
      portal_access_token: 'cand_token_arun_12345',
      portal_token_expiry: '2026-12-31T23:59:59.000Z',
      converted_employee_id: null,
      created_at: '2026-11-01T10:00:00.000Z',
    },
  ],

  onboarding_workflows: [
    {
      id: 'w1111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      title: 'Standard Engineering Onboarding',
      is_active: true,
    },
  ],

  onboarding_tasks: [
    {
      id: 'ot111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      title: 'IT Asset Provisioning (MacBook Pro & YubiKey)',
      assigned_role_code: 'IT_ADMIN',
      due_day_offset: -2,
      is_mandatory: true,
      task_order: 1,
    },
    {
      id: 'ot111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      title: 'HR Verification of Academic Certificates & KYC',
      assigned_role_code: 'HR_ADMIN',
      due_day_offset: -1,
      is_mandatory: true,
      task_order: 2,
    },
    {
      id: 'ot111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      title: 'Manager Welcome Call & Onboarding Buddy Assignment',
      assigned_role_code: 'LINE_MANAGER',
      due_day_offset: 0,
      is_mandatory: false,
      task_order: 3,
    },
  ],

  candidate_task_instances: [
    {
      id: 'cti11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      candidate_id: 'c1111111-0000-0000-0000-000000000001',
      task_id: 'ot111111-0000-0000-0000-000000000001',
      title: 'IT Asset Provisioning (MacBook Pro & YubiKey)',
      assigned_role_code: 'IT_ADMIN',
      status: 'PENDING',
      due_date: '2026-11-29',
      is_mandatory: true,
    },
    {
      id: 'cti11111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      candidate_id: 'c1111111-0000-0000-0000-000000000001',
      task_id: 'ot111111-0000-0000-0000-000000000002',
      title: 'HR Verification of Academic Certificates & KYC',
      assigned_role_code: 'HR_ADMIN',
      status: 'PENDING',
      due_date: '2026-11-30',
      is_mandatory: true,
    },
  ],

  profile_update_requests: [],

  leave_requests: [],

  leave_balances: [
    {
      employee_id: 'e1111111-0000-0000-0000-000000000003', // John Doe
      tenant_id: TENANT_A_ID,
      leave_type: 'CASUAL',
      total_days: 12.0,
      used_days: 2.0,
      pending_days: 0.0,
      available_days: 10.0,
    },
    {
      employee_id: 'e1111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      leave_type: 'SICK',
      total_days: 10.0,
      used_days: 0.0,
      pending_days: 0.0,
      available_days: 10.0,
    },
  ],

  approver_delegations: [],

  case_categories: [
    {
      id: 'cc111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      name: 'Payroll & Compensation',
      code: 'PAYROLL',
      is_confidential: false,
      is_active: true,
    },
    {
      id: 'cc111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      name: 'Harassment & POSH Grievance',
      code: 'POSH',
      is_confidential: true, // Visible only to HR Admin
      is_active: true,
    },
    {
      id: 'cc111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      name: 'General HR & Benefits',
      code: 'GENERAL',
      is_confidential: false,
      is_active: true,
    },
  ],

  sla_policies: [
    {
      tenant_id: TENANT_A_ID,
      priority: 'CRITICAL',
      first_response_time_minutes: 30,
      resolution_time_minutes: 240, // 4 hours
    },
    {
      tenant_id: TENANT_A_ID,
      priority: 'HIGH',
      first_response_time_minutes: 120, // 2 hours
      resolution_time_minutes: 1440, // 24 hours
    },
    {
      tenant_id: TENANT_A_ID,
      priority: 'MEDIUM',
      first_response_time_minutes: 480, // 8 hours
      resolution_time_minutes: 2880, // 48 hours
    },
    {
      tenant_id: TENANT_A_ID,
      priority: 'LOW',
      first_response_time_minutes: 1440, // 24 hours
      resolution_time_minutes: 4320, // 72 hours
    },
  ],

  cases: [
    {
      id: 'case1111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      case_number: 'CASE-2026-0001',
      employee_id: 'e1111111-0000-0000-0000-000000000003',
      category_id: 'cc111111-0000-0000-0000-000000000001',
      priority: 'HIGH',
      status: 'OPEN',
      subject: 'Tax deduction query for October cycle',
      description: 'TDS seems higher than projected in form 16 calculation.',
      assigned_to_user_id: null,
      response_due_at: '2026-11-17T08:00:00.000Z',
      resolution_due_at: '2026-11-18T06:00:00.000Z',
      created_at: '2026-11-17T06:00:00.000Z',
    },
  ],

  case_messages: [],

  document_categories: [
    {
      id: 'dc111111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      code: 'IDENTITY',
      name: 'Government ID & Passport',
    },
    {
      id: 'dc111111-0000-0000-0000-000000000002',
      tenant_id: TENANT_A_ID,
      code: 'EDUCATION',
      name: 'Educational Certificates',
    },
    {
      id: 'dc111111-0000-0000-0000-000000000003',
      tenant_id: TENANT_A_ID,
      code: 'POLICY',
      name: 'Company Compliance Policies',
    },
  ],

  employee_documents: [
    {
      id: 'doc11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      employee_id: 'e1111111-0000-0000-0000-000000000003',
      category_id: 'dc111111-0000-0000-0000-000000000001',
      title: 'Valid Passport',
      document_number: 'P98765432',
      file_key: 'tenants/acme/docs/emp3/passport.pdf',
      file_name: 'passport.pdf',
      file_size_bytes: 1024500,
      mime_type: 'application/pdf',
      expiry_date: '2026-12-15', // Expiring in ~28 days
      verification_status: 'VERIFIED',
      created_at: '2026-01-10T10:00:00.000Z',
    },
  ],

  compliance_policies: [
    {
      id: 'pol11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      title: 'Information Security & Data Protection Policy 2026',
      policy_code: 'POL-SEC-2026',
      version: '1.0',
      description: 'Mandatory standard security guidelines for all employees',
      file_key: 'policies/pol_sec_2026.pdf',
      file_name: 'pol_sec_2026.pdf',
      is_mandatory: true,
      effective_date: '2026-01-01',
      target_scope: 'ALL',
      status: 'PUBLISHED',
      published_at: '2026-01-01T00:00:00.000Z',
    },
  ],

  policy_acknowledgements: [],

  exit_requests: [],

  exit_clearance_items: [],

  exit_interviews: [],

  fnf_settlements: [],

  audit_logs: [],

  announcements: [
    {
      id: 'ann11111-0000-0000-0000-000000000001',
      tenant_id: TENANT_A_ID,
      title: 'Annual Tech Summit 2026 Announced',
      content: 'Join us next month for CubeAI annual engineering conference.',
      author_id: 'a1111111-0000-0000-0000-000000000001',
      is_published: true,
      created_at: '2026-11-10T10:00:00.000Z',
    },
  ],
};
