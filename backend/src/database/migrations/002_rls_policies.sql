-- ============================================================================
-- CUBEAI SOLUTIONS HRMS: POSTGRESQL ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Function to safely extract the active tenant UUID from connection session variable
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Activation Loop across all 28 tenant-scoped application tables
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'users', 'roles', 'locations', 'departments', 'designations', 'employees',
        'employee_profiles', 'employee_job_history', 'employee_hierarchy_closure',
        'onboarding_workflows', 'onboarding_tasks', 'candidates', 'candidate_task_instances',
        'profile_update_requests', 'announcements', 'approver_delegations',
        'case_categories', 'sla_policies', 'cases', 'case_messages',
        'document_categories', 'employee_documents', 'compliance_policies',
        'policy_acknowledgements', 'exit_requests', 'exit_clearance_items',
        'exit_interviews', 'fnf_settlements'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        -- Check table exists before altering
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
            -- Enable and Force RLS
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
            EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);
            
            -- Drop existing policy if present
            EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', tbl);
            
            -- Create strict tenant isolation policy for all DML operations
            EXECUTE format(
                'CREATE POLICY tenant_isolation_policy ON %I ' ||
                'FOR ALL ' ||
                'USING (tenant_id = current_tenant_id()) ' ||
                'WITH CHECK (tenant_id = current_tenant_id());',
                tbl
            );
            
            -- SuperAdmin bypass policy
            EXECUTE format('DROP POLICY IF EXISTS superadmin_bypass_policy ON %I;', tbl);
            EXECUTE format(
                'CREATE POLICY superadmin_bypass_policy ON %I ' ||
                'FOR ALL ' ||
                'USING (current_setting(''app.bypass_rls'', true) = ''on'');',
                tbl
            );
        END IF;
    END LOOP;
END $$;
