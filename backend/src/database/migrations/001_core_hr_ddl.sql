-- ============================================================================
-- CUBEAI SOLUTIONS HRMS: MASTER DDL SCHEMA (MODULES 1-6 + BASE RBAC)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. BASE MULTI-TENANCY & RBAC
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) UNIQUE,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_role_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ----------------------------------------------------------------------------
-- 2. MODULE 2: EMPLOYEE INFORMATION DBMS & ORG STRUCTURE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_location_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    lead_employee_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_dept_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    grade_level VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_designation_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    official_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    phone_number VARCHAR(30),
    gender VARCHAR(20),
    date_of_birth DATE,
    date_of_joining DATE NOT NULL,
    probation_end_date DATE,
    confirmation_date DATE,
    employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
    employment_status VARCHAR(50) NOT NULL DEFAULT 'PROBATION',
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    designation_id UUID REFERENCES designations(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,
    reporting_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    dotted_line_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_employee_code UNIQUE (tenant_id, employee_code),
    CONSTRAINT uq_tenant_official_email UNIQUE (tenant_id, official_email)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_dept_lead'
    ) THEN
        ALTER TABLE departments ADD CONSTRAINT fk_dept_lead FOREIGN KEY (lead_employee_id) REFERENCES employees(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS employee_profiles (
    employee_id UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    marital_status VARCHAR(50),
    blood_group VARCHAR(10),
    pan_number VARCHAR(50),
    aadhaar_number VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    bank_name VARCHAR(150),
    bank_account_number VARCHAR(100),
    bank_ifsc_code VARCHAR(50),
    residential_address JSONB,
    permanent_address JSONB,
    emergency_contacts JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_job_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL,
    effective_date DATE NOT NULL,
    previous_department_id UUID REFERENCES departments(id),
    new_department_id UUID REFERENCES departments(id),
    previous_designation_id UUID REFERENCES designations(id),
    new_designation_id UUID REFERENCES designations(id),
    previous_manager_id UUID REFERENCES employees(id),
    new_manager_id UUID REFERENCES employees(id),
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_hierarchy_closure (
    ancestor_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    descendant_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    depth INT NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    PRIMARY KEY (ancestor_id, descendant_id)
);

-- ----------------------------------------------------------------------------
-- 3. MODULE 1: ONBOARDING & TALENT INTAKE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS onboarding_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES onboarding_workflows(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_role_code VARCHAR(50) NOT NULL,
    due_day_offset INT NOT NULL DEFAULT 0,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    task_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30),
    offer_date DATE NOT NULL,
    joining_date DATE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    location_id UUID REFERENCES locations(id),
    reporting_manager_id UUID REFERENCES employees(id),
    workflow_id UUID REFERENCES onboarding_workflows(id),
    status VARCHAR(50) NOT NULL DEFAULT 'OFFER_ACCEPTED',
    portal_access_token VARCHAR(255) UNIQUE,
    portal_token_expiry TIMESTAMPTZ,
    converted_employee_id UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_task_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    task_id UUID REFERENCES onboarding_tasks(id),
    title VARCHAR(200) NOT NULL,
    assigned_to_user_id UUID REFERENCES users(id),
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. MODULE 3: EMPLOYEE SELF-SERVICE (ESS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    reviewer_comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_scope VARCHAR(50) NOT NULL DEFAULT 'ALL',
    department_id UUID REFERENCES departments(id),
    location_id UUID REFERENCES locations(id),
    priority VARCHAR(50) NOT NULL DEFAULT 'NORMAL',
    published_by UUID NOT NULL REFERENCES users(id),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approver_delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    delegator_employee_id UUID NOT NULL REFERENCES employees(id),
    delegatee_employee_id UUID NOT NULL REFERENCES employees(id),
    module VARCHAR(50) NOT NULL DEFAULT 'ALL',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. MODULE 4: HR HELP DESK & CASES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    default_assignee_role VARCHAR(50) NOT NULL DEFAULT 'HR_ADMIN',
    default_assignee_id UUID REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_case_cat UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS sla_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    priority VARCHAR(50) NOT NULL,
    first_response_time_minutes INT NOT NULL,
    resolution_time_minutes INT NOT NULL,
    escalation_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_sla_prio UNIQUE (tenant_id, priority)
);

CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_number VARCHAR(50) NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES case_categories(id),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_to_user_id UUID REFERENCES users(id),
    response_due_at TIMESTAMPTZ,
    resolution_due_at TIMESTAMPTZ,
    first_responded_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    csat_rating INT CHECK (csat_rating BETWEEN 1 AND 5),
    csat_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_case_num UNIQUE (tenant_id, case_number)
);

CREATE TABLE IF NOT EXISTS case_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. MODULE 5: DOCUMENT MANAGEMENT & COMPLIANCE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_doc_cat UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES document_categories(id),
    title VARCHAR(255) NOT NULL,
    file_key VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    expiry_date DATE,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    content_key VARCHAR(500) NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    effective_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_acknowledgements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES compliance_policies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(50),
    user_agent TEXT,
    CONSTRAINT uq_tenant_emp_policy UNIQUE (tenant_id, policy_id, employee_id)
);

-- ----------------------------------------------------------------------------
-- 7. MODULE 6: OFFBOARDING & EXIT MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'VOLUNTARY',
    reason_category VARCHAR(100) NOT NULL,
    reason_details TEXT,
    submission_date DATE NOT NULL,
    desired_last_working_day DATE NOT NULL,
    approved_last_working_day DATE,
    notice_period_days INT NOT NULL DEFAULT 60,
    notice_shortfall_days INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    manager_comments TEXT,
    hr_comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exit_clearance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    exit_request_id UUID NOT NULL REFERENCES exit_requests(id) ON DELETE CASCADE,
    department_type VARCHAR(50) NOT NULL,
    item_title VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    cleared_by UUID REFERENCES users(id),
    cleared_at TIMESTAMPTZ,
    recovery_amount NUMERIC(12, 2) DEFAULT 0.00,
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exit_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    exit_request_id UUID NOT NULL UNIQUE REFERENCES exit_requests(id) ON DELETE CASCADE,
    primary_reason VARCHAR(100) NOT NULL,
    manager_rating INT CHECK (manager_rating BETWEEN 1 AND 5),
    culture_rating INT CHECK (culture_rating BETWEEN 1 AND 5),
    compensation_rating INT CHECK (compensation_rating BETWEEN 1 AND 5),
    growth_opportunity_rating INT CHECK (growth_opportunity_rating BETWEEN 1 AND 5),
    feedback_notes TEXT,
    conducted_by UUID REFERENCES users(id),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fnf_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    exit_request_id UUID NOT NULL UNIQUE REFERENCES exit_requests(id) ON DELETE CASCADE,
    working_days_pay NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    leave_encashment_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gratuity_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bonus_incentives NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notice_recovery_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    asset_damage_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    loan_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    net_payable NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    settlement_status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
