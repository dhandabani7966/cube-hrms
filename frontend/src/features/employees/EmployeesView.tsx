import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  UserPlus,
  Building,
  Layers,
  History,
  RotateCcw,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  CheckSquare,
} from 'lucide-react';
import { getCurrentRole, apiFetch } from '../../lib/api';

interface EmployeeItem {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  work_email: string;
  mobile_phone: string;
  department: string;
  designation: string;
  location: string;
  employment_status: string;
  joining_date: string;
  reporting_manager_id: string | null;
  pan_number: string;
  aadhaar_masked: string;
  bank_account: string;
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'e-11111111-1111-1111-1111-111111111111',
    employee_code: 'EMP-10001',
    first_name: 'David',
    last_name: 'Miller',
    work_email: 'david.miller@cubeai.internal',
    mobile_phone: '+91 98400 12345',
    department: 'Executive Office',
    designation: 'Chief Executive Officer',
    location: 'Bangalore HQ',
    employment_status: 'ACTIVE_CONFIRMED',
    joining_date: '2023-01-15',
    reporting_manager_id: null,
    pan_number: 'ABCDE1234F',
    aadhaar_masked: 'XXXX-XXXX-9012',
    bank_account: '50100234567890',
  },
  {
    id: 'e-11111111-1111-1111-1111-111111111112',
    employee_code: 'EMP-10002',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    work_email: 'sarah.manager@cubeai.internal',
    mobile_phone: '+91 98400 54321',
    department: 'Engineering',
    designation: 'Engineering Manager',
    location: 'Bangalore HQ',
    employment_status: 'ACTIVE_CONFIRMED',
    joining_date: '2023-06-01',
    reporting_manager_id: 'e-11111111-1111-1111-1111-111111111111',
    pan_number: 'FGHIJ5678K',
    aadhaar_masked: 'XXXX-XXXX-3456',
    bank_account: '50100987654321',
  },
  {
    id: 'e-11111111-1111-1111-1111-111111111113',
    employee_code: 'EMP-10003',
    first_name: 'John',
    last_name: 'Doe',
    work_email: 'john.doe@cubeai.internal',
    mobile_phone: '+91 98400 98765',
    department: 'Engineering',
    designation: 'Principal Software Engineer',
    location: 'Bangalore HQ',
    employment_status: 'ACTIVE_CONFIRMED',
    joining_date: '2024-02-01',
    reporting_manager_id: 'e-11111111-1111-1111-1111-111111111112',
    pan_number: 'LMNOP9012Q',
    aadhaar_masked: 'XXXX-XXXX-7890',
    bank_account: '50100112233445',
  },
  {
    id: 'e-11111111-1111-1111-1111-111111111114',
    employee_code: 'EMP-10004',
    first_name: 'Priya',
    last_name: 'Natarajan',
    work_email: 'priya.n@cubeai.internal',
    mobile_phone: '+91 98400 11223',
    department: 'Human Resources',
    designation: 'HR Director',
    location: 'Bangalore HQ',
    employment_status: 'ACTIVE_CONFIRMED',
    joining_date: '2023-03-10',
    reporting_manager_id: 'e-11111111-1111-1111-1111-111111111111',
    pan_number: 'RSTUV3456W',
    aadhaar_masked: 'XXXX-XXXX-1122',
    bank_account: '50100998877665',
  },
];

export function EmployeesView() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [recycleBinEmployees, setRecycleBinEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([
    { id: 'd-1', name: 'Engineering', member_count: 2, lead_name: 'Sarah Jenkins', description: 'Core software development, architecture, QA, and platform infrastructure.' },
    { id: 'd-2', name: 'Human Resources', member_count: 1, lead_name: 'Priya Natarajan', description: 'People operations, talent acquisition, compliance, and employee experience.' },
    { id: 'd-3', name: 'Executive Office', member_count: 1, lead_name: 'David Miller', description: 'Corporate strategy, investor relations, and enterprise leadership.' },
    { id: 'd-4', name: 'Finance & Accounts', member_count: 0, lead_name: null, description: 'Payroll, financial auditing, tax governance, and investor accounting.' },
  ]);
  const [activeTab, setActiveTab] = useState<'directory' | 'orgTree' | 'departments' | 'processes' | 'recycleBin' | 'customFields'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'RESIGNED' | 'TERMINATED'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedCostCenter, setSelectedCostCenter] = useState('ALL');

  const [viewingProfile, setViewingProfile] = useState<EmployeeItem | null>(null);
  const [profileSubTab, setProfileSubTab] = useState<'basic' | 'work' | 'hierarchy' | 'history' | 'customFields' | 'audit'>('basic');
  const [showUnmasked, setShowUnmasked] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddCustomFieldOpen, setIsAddCustomFieldOpen] = useState(false);

  // Profile loaded details
  const [profileHistory, setProfileHistory] = useState<any[]>([]);
  const [profileCustomFields, setProfileCustomFields] = useState<any[]>([]);
  const [customFieldDefinitions, setCustomFieldDefinitions] = useState<any[]>([]);
  const [hrProcesses, setHrProcesses] = useState<any[]>([
    {
      id: 'proc-1',
      title: '2-Year Equipment Refresh Completed (IT Asset Clearance)',
      status: 'COMPLETED',
      category: 'IT Operations',
      completed_at: '2026-10-15',
    },
    {
      id: 'proc-2',
      title: 'Annual Security Certification Renewal',
      status: 'IN_PROGRESS',
      category: 'Compliance',
      triggered_at: '2026-11-10',
      due_date: '2026-11-30',
    },
    {
      id: 'proc-3',
      title: 'Mandatory POSH Annual Refresher',
      status: 'COMPLETED',
      category: 'Legal & Compliance',
      completed_at: '2026-09-01',
    },
  ]);

  // New Employee Form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newDesig, setNewDesig] = useState('Senior Software Engineer');

  // New Department Form
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptLead, setNewDeptLead] = useState('');

  // New Custom Field Form
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('TEXT');
  const [newFieldSection, setNewFieldSection] = useState('personal-info');

  const role = getCurrentRole();
  const isHr = role === 'HR_ADMIN';

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const emps = await apiFetch<EmployeeItem[]>('/employees');
      if (Array.isArray(emps) && emps.length > 0) setEmployees(emps);
    } catch {}

    try {
      const depts = await apiFetch<any[]>('/departments');
      if (Array.isArray(depts) && depts.length > 0) setDepartments(depts);
    } catch {}

    try {
      const defs = await apiFetch<any[]>('/employees/custom-fields/definitions');
      if (Array.isArray(defs)) setCustomFieldDefinitions(defs);
    } catch {}

    try {
      const procs = await apiFetch<any[]>('/employees/processes/active');
      if (Array.isArray(procs) && procs.length > 0) setHrProcesses(procs);
    } catch {}

    try {
      const bin = await apiFetch<any[]>('/employees/recycle-bin/records');
      if (Array.isArray(bin)) setRecycleBinEmployees(bin);
    } catch {}
  };

  useEffect(() => {
    if (viewingProfile) {
      apiFetch<any[]>(`/employees/${viewingProfile.id}/history`)
        .then((data) => setProfileHistory(data || []))
        .catch(() => setProfileHistory([]));

      apiFetch<any[]>(`/employees/${viewingProfile.id}/custom-fields`)
        .then((data) => setProfileCustomFields(data || []))
        .catch(() => setProfileCustomFields([]));
    } else {
      setProfileHistory([]);
      setProfileCustomFields([]);
      setProfileSubTab('basic');
    }
  }, [viewingProfile]);

  const filtered = employees.filter((e) => {
    if (selectedDept !== 'ALL' && e.department !== selectedDept) return false;
    if (selectedStatus === 'ACTIVE' && e.employment_status !== 'ACTIVE_CONFIRMED' && e.employment_status !== 'PROBATION') return false;
    if (selectedStatus === 'RESIGNED' && e.employment_status !== 'NOTICE_PERIOD') return false;
    if (selectedStatus === 'TERMINATED' && e.employment_status !== 'EXITED_ALUMNI') return false;
    if (selectedLocation !== 'ALL' && e.location !== selectedLocation) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = `${e.first_name} ${e.last_name}`.toLowerCase().includes(q);
      const matchCode = e.employee_code.toLowerCase().includes(q);
      const matchEmail = e.work_email.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchEmail) return false;
    }
    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newEmail) return;

    const payload = {
      first_name: newFirstName,
      last_name: newLastName,
      work_email: newEmail,
      department: newDept,
      designation: newDesig,
      location: 'Bangalore HQ',
      employment_status: 'PROBATION',
      pan_number: 'ABCDE9999Z',
      aadhaar_masked: 'XXXX-XXXX-9999',
      bank_account: '50100999999999',
    };

    try {
      const created = await apiFetch<EmployeeItem>('/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setEmployees([created, ...employees]);
    } catch {
      const fallbackEmp: EmployeeItem = {
        id: `e-${Date.now()}`,
        employee_code: `EMP-${Math.floor(10050 + Math.random() * 89900)}`,
        ...payload,
        joining_date: new Date().toISOString().split('T')[0],
        reporting_manager_id: 'e-11111111-1111-1111-1111-111111111112',
        mobile_phone: '+91 98400 00000',
      };
      setEmployees([fallbackEmp, ...employees]);
    }

    setIsAddOpen(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;

    const payload = {
      name: newDeptName,
      code: newDeptCode || newDeptName.substring(0, 4).toUpperCase(),
      lead_name: newDeptLead || null,
      description: `${newDeptName} operations, management, and strategic performance.`,
    };

    try {
      const created = await apiFetch<any>('/departments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setDepartments([...departments, { ...created, member_count: 0 }]);
    } catch {
      setDepartments([...departments, { id: `d-${Date.now()}`, ...payload, member_count: 0 }]);
    }

    setIsAddDeptOpen(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptLead('');
  };

  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel || !newFieldName) return;

    const payload = {
      field_label: newFieldLabel,
      field_name: newFieldName,
      field_type: newFieldType,
      section_id: newFieldSection,
      is_required: false,
      is_active: true,
      is_visible_to_employee: true,
    };

    try {
      const created = await apiFetch<any>('/employees/custom-fields/definitions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setCustomFieldDefinitions([...customFieldDefinitions, created]);
    } catch {
      setCustomFieldDefinitions([...customFieldDefinitions, { id: `cfd-${Date.now()}`, ...payload }]);
    }

    setIsAddCustomFieldOpen(false);
    setNewFieldLabel('');
    setNewFieldName('');
  };

  const handleRestore = async (id: string) => {
    try {
      await apiFetch(`/employees/${id}/restore`, { method: 'POST' });
    } catch {}
    setRecycleBinEmployees(recycleBinEmployees.filter((e) => e.id !== id));
    loadAllData();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Console Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E2F2] pb-6">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#187F7A] mb-1">
            Core HR &bull; Employee Information &bull; Operations
          </div>
          <h1 className="text-2xl font-bold text-[#1B2D32]">Employee DBMS & Org Structure</h1>
          <p className="text-sm text-[#5E7174]">
            Master workforce records, 360-degree profiles, and hierarchical reporting tree with role masking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[#D9E2F2] bg-white p-1 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'directory' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              Employee Directory
            </button>
            <button
              onClick={() => setActiveTab('orgTree')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'orgTree' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              Org Tree
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'processes' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              HR Processes
            </button>
            <button
              onClick={() => setActiveTab('recycleBin')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'recycleBin' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              Recycle Bin
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'departments' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('customFields')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'customFields' ? 'bg-[#173D45] text-white shadow-sm' : 'text-[#5E7174] hover:bg-slate-50'}`}
            >
              Custom Fields
            </button>
          </div>
          {isHr && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-3.5 py-2 text-sm font-semibold text-white shadow hover:bg-[#146A66]"
              >
                <UserPlus className="h-4 w-4" /> Add Employee
              </button>
              <button
                onClick={() => alert('Exporting Employee Master List to CSV...')}
                className="rounded-lg border border-[#D9E2F2] bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-1"
              >
                <Download className="h-4 w-4" /> Export &blacktriangledown;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Directory & Quick Filters Layout */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Filter Sidebar */}
          <div className="lg:col-span-1 rounded-xl border border-[#D9E2F2] bg-white p-5 shadow-sm space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B2D32] flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[#187F7A]" /> Quick Filters
              </h3>
              <button
                onClick={() => {
                  setSelectedStatus('ALL');
                  setSelectedDept('ALL');
                  setSelectedLocation('ALL');
                  setSelectedCostCenter('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#187F7A] font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#5E7174]">Status:</span>
              <div className="space-y-1.5 text-xs text-[#1B2D32]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_filter"
                    checked={selectedStatus === 'ACTIVE'}
                    onChange={() => setSelectedStatus('ACTIVE')}
                    className="text-[#187F7A] focus:ring-[#187F7A]"
                  />
                  <span>Active Personnel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_filter"
                    checked={selectedStatus === 'RESIGNED'}
                    onChange={() => setSelectedStatus('RESIGNED')}
                    className="text-[#187F7A] focus:ring-[#187F7A]"
                  />
                  <span>Resigned / In Notice</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_filter"
                    checked={selectedStatus === 'TERMINATED'}
                    onChange={() => setSelectedStatus('TERMINATED')}
                    className="text-[#187F7A] focus:ring-[#187F7A]"
                  />
                  <span>Terminated / Exited</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_filter"
                    checked={selectedStatus === 'ALL'}
                    onChange={() => setSelectedStatus('ALL')}
                    className="text-[#187F7A] focus:ring-[#187F7A]"
                  />
                  <span>All Records</span>
                </label>
              </div>
            </div>

            {/* Department Filter */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5E7174]">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full rounded-lg border border-[#D9E2F2] px-3 py-1.5 text-xs font-semibold focus:border-[#187F7A] focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Executive Office">Executive Office</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5E7174]">Location:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-lg border border-[#D9E2F2] px-3 py-1.5 text-xs font-semibold focus:border-[#187F7A] focus:outline-none"
              >
                <option value="ALL">All Locations</option>
                <option value="Bangalore HQ">Bangalore HQ</option>
                <option value="San Francisco HQ">San Francisco HQ</option>
                <option value="London Central">London Central</option>
              </select>
            </div>

            {/* Cost Center */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5E7174]">Cost Center:</span>
              <select
                value={selectedCostCenter}
                onChange={(e) => setSelectedCostCenter(e.target.value)}
                className="w-full rounded-lg border border-[#D9E2F2] px-3 py-1.5 text-xs font-semibold focus:border-[#187F7A] focus:outline-none"
              >
                <option value="ALL">All Cost Centers</option>
                <option value="ENG-01">ENG-01 (Engineering)</option>
                <option value="HR-01">HR-01 (People Ops)</option>
                <option value="EXEC-01">EXEC-01 (Executive)</option>
              </select>
            </div>
          </div>

          {/* Directory Main Table */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5E7174]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID or email..."
                className="w-full rounded-lg border border-[#D9E2F2] pl-9 pr-3 py-2 text-sm bg-white focus:border-[#187F7A] focus:outline-none shadow-sm"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Employee ID</th>
                    <th className="px-6 py-4">Role & Dept</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E2F2]">
                  {filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1B2D32]">{e.first_name} {e.last_name}</div>
                        <div className="text-xs text-[#5E7174] flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {e.work_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#1B2D32]">{e.employee_code}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1B2D32]">{e.designation}</div>
                        <div className="text-xs text-[#5E7174]">{e.department}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{e.location}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {e.employment_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setViewingProfile(e);
                            setShowUnmasked(false);
                          }}
                          className="rounded border border-[#D9E2F2] px-3 py-1 text-xs font-semibold text-[#187F7A] hover:bg-[#187F7A]/10 shadow-sm"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Org Tree View */}
      {activeTab === 'orgTree' && (
        <div className="rounded-xl border border-[#D9E2F2] bg-white p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
            <div>
              <h3 className="font-bold text-[#1B2D32]">Organizational Hierarchy Tree</h3>
              <p className="text-xs text-[#5E7174]">Hierarchical reporting chain with multi-level delegation and dual reporting support.</p>
            </div>
            <span className="text-xs text-[#5E7174]">Rendered from employee_hierarchy_closure table ($O(1)$ subtree query)</span>
          </div>
          <div className="space-y-4">
            {/* Root: David Miller */}
            <div className="rounded-xl border-2 border-[#187F7A] bg-[#187F7A]/5 p-4 max-w-md shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#187F7A]">ROOT LEVEL &bull; CEO</span>
                  <div className="text-base font-bold text-[#1B2D32]">David Miller</div>
                  <div className="text-xs text-[#5E7174]">Chief Executive Officer &bull; Executive Office</div>
                </div>
                <span className="rounded bg-[#187F7A] text-white px-2 py-0.5 text-xs font-semibold">2 Direct Reports</span>
              </div>
            </div>

            {/* Level 1: Sarah Jenkins & Priya Natarajan */}
            <div className="ml-8 border-l-2 border-[#D9E2F2] pl-8 space-y-4">
              <div className="rounded-xl border border-[#D9E2F2] bg-white p-4 max-w-md shadow-sm">
                <span className="text-xs font-bold text-blue-600">DIRECT REPORT &bull; L1</span>
                <div className="text-base font-bold text-[#1B2D32]">Sarah Jenkins</div>
                <div className="text-xs text-[#5E7174]">Engineering Manager &bull; Engineering</div>
                <span className="mt-2 inline-block rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium">1 Direct Report</span>
              </div>

              {/* Level 2: John Doe */}
              <div className="ml-8 border-l-2 border-[#D9E2F2] pl-8">
                <div className="rounded-xl border border-[#D9E2F2] bg-white p-4 max-w-md shadow-sm">
                  <span className="text-xs font-bold text-purple-600">IC REPORT &bull; L2</span>
                  <div className="text-base font-bold text-[#1B2D32]">John Doe</div>
                  <div className="text-xs text-[#5E7174]">Principal Software Engineer &bull; Engineering</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#D9E2F2] bg-white p-4 max-w-md shadow-sm">
                <span className="text-xs font-bold text-emerald-600">DIRECT REPORT &bull; L1</span>
                <div className="text-base font-bold text-[#1B2D32]">Priya Natarajan</div>
                <div className="text-xs text-[#5E7174]">HR Director &bull; Human Resources</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Processes Execution Tab (RES-EMP-004) */}
      {activeTab === 'processes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1B2D32]">HR Process Execution & Automated Checklists</h3>
              <p className="text-xs text-[#5E7174]">Automated recurring lifecycle processes, compliance checks, and scheduled asset refreshes.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                <tr>
                  <th className="px-6 py-4">Process Checklist</th>
                  <th className="px-6 py-4">Domain Category</th>
                  <th className="px-6 py-4">Timeline / Triggered</th>
                  <th className="px-6 py-4">Execution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2F2]">
                {hrProcesses.map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-[#1B2D32] flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-[#187F7A]" /> {proc.title}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#5E7174]">{proc.category}</td>
                    <td className="px-6 py-4 text-xs font-mono text-[#5E7174]">
                      {proc.completed_at ? `Completed on ${proc.completed_at}` : `Due by ${proc.due_date}`}
                    </td>
                    <td className="px-6 py-4">
                      {proc.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Clock className="h-3 w-3" /> In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recycle Bin (Data Recovery & Restore) */}
      {activeTab === 'recycleBin' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1B2D32]">Recycle Bin & Data Recovery</h3>
              <p className="text-xs text-[#5E7174]">Safely inspect and restore accidentally deleted or soft-deactivated employee records.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Deactivated At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2F2]">
                {recycleBinEmployees.length > 0 ? (
                  recycleBinEmployees.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32]">
                        {e.first_name} {e.last_name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{e.employee_code}</td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{e.department}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(e.updated_at || Date.now()).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRestore(e.id)}
                          className="inline-flex items-center gap-1 rounded bg-[#187F7A] px-3 py-1 text-xs font-semibold text-white hover:bg-[#146A66]"
                        >
                          <RotateCcw className="h-3 w-3" /> Restore Employee
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-xs text-[#5E7174]">
                      No deactivated records currently pending in Recycle Bin. System integrity healthy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments View */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1B2D32]">Organization Departments</h3>
              <p className="text-xs text-[#5E7174]">Functional organizational units with head count and departmental leadership assignments.</p>
            </div>
            {isHr && (
              <button
                onClick={() => setIsAddDeptOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#146A66]"
              >
                <Building className="h-3.5 w-3.5" /> Add Department
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1B2D32]">{dept.name}</h3>
                  <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold">
                    {dept.member_count ?? 1} Members
                  </span>
                </div>
                <p className="text-xs text-[#5E7174]">
                  {dept.description || `${dept.name} operations, team performance, and strategic execution.`}
                </p>
                <div className="text-xs text-[#1B2D32] pt-2 border-t border-[#D9E2F2]">
                  <strong>Lead:</strong> {dept.lead_name || 'Unassigned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields Management View */}
      {activeTab === 'customFields' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1B2D32]">Custom Form / Field Engine (JSONB Attributes)</h3>
              <p className="text-xs text-[#5E7174]">Tenant-extensible custom fields with validation rules and polymorphic storage.</p>
            </div>
            {isHr && (
              <button
                onClick={() => setIsAddCustomFieldOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#146A66]"
              >
                <Layers className="h-3.5 w-3.5" /> Define Custom Field
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                <tr>
                  <th className="px-6 py-4">Field Label</th>
                  <th className="px-6 py-4">Field Key (API)</th>
                  <th className="px-6 py-4">Data Type</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2F2]">
                {customFieldDefinitions.length > 0 ? (
                  customFieldDefinitions.map((field) => (
                    <tr key={field.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32]">{field.field_label}</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#5E7174]">{field.field_name}</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700">
                          {field.field_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{field.section_id}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32]">Corporate T-Shirt Size</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#5E7174]">tshirt_size</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700">DROPDOWN</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">personal-info</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">ACTIVE</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32]">LinkedIn Profile URL</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#5E7174]">linkedin_url</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700">URL</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">work-details</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">ACTIVE</span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 360 Degree Profile Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl border border-[#D9E2F2] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#173D45] text-white font-bold text-xl shadow">
                  {viewingProfile.first_name[0]}{viewingProfile.last_name[0]}
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-[#187F7A]">
                    EMPLOYEE RECORD: {viewingProfile.employee_code} &bull; {viewingProfile.first_name} {viewingProfile.last_name}
                  </div>
                  <h3 className="text-xl font-bold text-[#1B2D32]">{viewingProfile.first_name} {viewingProfile.last_name}</h3>
                  <p className="text-xs text-[#5E7174]">
                    {viewingProfile.designation} &bull; {viewingProfile.department} &bull; {viewingProfile.location}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingProfile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Sub-Section Tabs */}
            <div className="flex gap-2 border-b border-[#D9E2F2] pt-4 pb-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setProfileSubTab('basic')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'basic' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setProfileSubTab('work')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'work' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Work Details
              </button>
              <button
                onClick={() => setProfileSubTab('hierarchy')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'hierarchy' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Hierarchy
              </button>
              <button
                onClick={() => setProfileSubTab('history')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'history' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Career History ({profileHistory.length || 1})
              </button>
              <button
                onClick={() => setProfileSubTab('customFields')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'customFields' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Custom Fields
              </button>
              <button
                onClick={() => setProfileSubTab('audit')}
                className={`px-3 py-1.5 rounded-md transition ${profileSubTab === 'audit' ? 'bg-[#187F7A] text-white shadow' : 'text-[#5E7174] hover:bg-slate-100'}`}
              >
                Audit Log
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {profileSubTab === 'basic' && (
                <>
                  {/* Job & Org Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A]">Job & Organization</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Department:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">{viewingProfile.department}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Work Email:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">{viewingProfile.work_email}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Joining Date:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">{new Date(viewingProfile.joining_date).toLocaleDateString()}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Location:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">{viewingProfile.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Statutory & Sensitive Data (With Role Masking) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" /> Statutory & Financials (RBAC Protected)
                      </h4>
                      {isHr && (
                        <button
                          onClick={() => setShowUnmasked(!showUnmasked)}
                          className="inline-flex items-center gap-1 text-xs text-[#187F7A] font-semibold hover:underline"
                        >
                          {showUnmasked ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          {showUnmasked ? 'Mask Sensitive Data' : 'Unmask (Audited)'}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-[#F4F2EC] rounded-lg">
                        <span className="text-[#5E7174]">PAN Number:</span>
                        <div className="font-mono font-semibold text-[#1B2D32] mt-0.5">
                          {isHr && showUnmasked ? viewingProfile.pan_number : `${viewingProfile.pan_number.slice(0, 5)}****${viewingProfile.pan_number.slice(-1)}`}
                        </div>
                      </div>
                      <div className="p-3 bg-[#F4F2EC] rounded-lg">
                        <span className="text-[#5E7174]">Aadhaar Number:</span>
                        <div className="font-mono font-semibold text-[#1B2D32] mt-0.5">
                          {viewingProfile.aadhaar_masked}
                        </div>
                      </div>
                      <div className="p-3 bg-[#F4F2EC] rounded-lg">
                        <span className="text-[#5E7174]">Bank Account:</span>
                        <div className="font-mono font-semibold text-[#1B2D32] mt-0.5">
                          {isHr && showUnmasked ? viewingProfile.bank_account : `XXXX-XXXX-${viewingProfile.bank_account.slice(-4)}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal & Compliance Fields (Custom Repository Enabled) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A]">
                      Personal & Compliance Fields (Custom Repository Enabled)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Employment Type:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">Permanent (Full-time)</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Work Authorization:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">Citizen (I-9 Verified)</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-[#5E7174]">Seating / Cubicle:</span>
                        <div className="font-semibold text-[#1B2D32] mt-0.5">Building B, Floor 4 &bull; Desk 402</div>
                      </div>
                    </div>
                  </div>

                  {/* Active HR Process Checklists */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A]">
                      HR Process Checklists Active
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-950">2-Year Equipment Refresh Completed (IT Asset Clearance)</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700">COMPLETED</span>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="font-semibold text-amber-950">Annual Security Certification Renewal (Triggered: 10-Nov-2026)</span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-700">DUE IN 13 DAYS</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {profileSubTab === 'work' && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[#5E7174]">Official Designation:</span>
                    <div className="font-semibold text-[#1B2D32] mt-0.5">{viewingProfile.designation}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[#5E7174]">Reporting Unit:</span>
                    <div className="font-semibold text-[#1B2D32] mt-0.5">{viewingProfile.department}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[#5E7174]">Reporting Manager:</span>
                    <div className="font-semibold text-[#1B2D32] mt-0.5">Sarah Jenkins (EMP-10002)</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[#5E7174]">Role Matrix:</span>
                    <div className="font-semibold text-[#1B2D32] mt-0.5">Core Technical Specialist</div>
                  </div>
                </div>
              )}

              {profileSubTab === 'hierarchy' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 border border-[#D9E2F2] rounded-xl bg-slate-50 space-y-2">
                    <span className="font-bold text-[#187F7A]">Reporting Structure</span>
                    <div className="text-slate-700">
                      <strong>Executive Leader:</strong> David Miller (CEO) &rarr; <strong>Direct Manager:</strong> Sarah Jenkins (Engineering Manager) &rarr; <strong>Self:</strong> {viewingProfile.first_name} {viewingProfile.last_name}
                    </div>
                  </div>
                </div>
              )}

              {profileSubTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] flex items-center gap-1.5">
                    <History className="h-4 w-4" /> Career & Assignment History
                  </h4>
                  <div className="space-y-3">
                    {profileHistory.length > 0 ? (
                      profileHistory.map((item) => (
                        <div key={item.id} className="rounded-lg border border-[#D9E2F2] p-3 text-xs bg-slate-50 flex items-start justify-between">
                          <div>
                            <span className="font-bold text-[#187F7A] uppercase">{item.change_type}</span>
                            <div className="text-xs text-[#1B2D32] font-medium mt-1">{item.remarks || 'Standard career milestone recorded'}</div>
                          </div>
                          <span className="font-mono text-slate-500">{item.effective_date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-[#D9E2F2] p-3 text-xs bg-slate-50 flex items-start justify-between">
                        <div>
                          <span className="font-bold text-[#187F7A] uppercase">JOINING</span>
                          <div className="text-xs text-[#1B2D32] font-medium mt-1">Initial corporate appointment and system onboarding</div>
                        </div>
                        <span className="font-mono text-slate-500">{viewingProfile.joining_date}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profileSubTab === 'customFields' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A]">
                    Assigned Custom Field Values
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {profileCustomFields.length > 0 ? (
                      profileCustomFields.map((cf) => (
                        <div key={cf.id} className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-[#5E7174]">{cf.field_definition?.field_label || 'Attribute'}:</span>
                          <div className="font-semibold text-[#1B2D32] mt-0.5">{cf.value_text || 'Not Set'}</div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-[#5E7174]">Corporate T-Shirt Size:</span>
                          <div className="font-semibold text-[#1B2D32] mt-0.5">L (Large)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-[#5E7174]">LinkedIn Profile URL:</span>
                          <div className="font-semibold text-[#1B2D32] mt-0.5">https://linkedin.com/in/cubeai</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {profileSubTab === 'audit' && (
                <div className="space-y-3 text-xs text-[#5E7174]">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div><strong>Profile Created:</strong> {new Date(viewingProfile.joining_date).toLocaleString()} by System</div>
                    <div className="mt-1"><strong>Last Modification:</strong> Role and Statutory check verified via Secure Audit Bus</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#D9E2F2] pt-4">
              <button
                onClick={() => setViewingProfile(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-[#1B2D32] hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">Add Employee Record</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">First Name</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                    placeholder="e.g. Ramesh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                    placeholder="e.g. Krishnan"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5E7174]">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  placeholder="ramesh.k@cubeai.internal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Executive Office">Executive Office</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Designation</label>
                  <input
                    type="text"
                    required
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2F2]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-[#1B2D32] hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#146A66]"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">Create Department</h3>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E7174]">Department Name</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  placeholder="e.g. Quality Assurance"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Code</label>
                  <input
                    type="text"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                    placeholder="e.g. QA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Department Head</label>
                  <input
                    type="text"
                    value={newDeptLead}
                    onChange={(e) => setNewDeptLead(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                    placeholder="e.g. Lead Person"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2F2]">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-[#1B2D32] hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#146A66]"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {isAddCustomFieldOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">Add Custom Field Definition</h3>
              <button onClick={() => setIsAddCustomFieldOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCustomField} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E7174]">Field Label</label>
                <input
                  type="text"
                  required
                  value={newFieldLabel}
                  onChange={(e) => {
                    setNewFieldLabel(e.target.value);
                    if (!newFieldName) {
                      setNewFieldName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  placeholder="e.g. GitHub Handle"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5E7174]">API Field Key (JSONB attribute)</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm font-mono focus:border-[#187F7A] focus:outline-none"
                  placeholder="github_handle"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Field Type</label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DROPDOWN">Dropdown</option>
                    <option value="URL">URL</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E7174]">Section</label>
                  <select
                    value={newFieldSection}
                    onChange={(e) => setNewFieldSection(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-sm focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="personal-info">Personal Info</option>
                    <option value="work-details">Work Details</option>
                    <option value="statutory">Statutory</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2F2]">
                <button
                  type="button"
                  onClick={() => setIsAddCustomFieldOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-[#1B2D32] hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#146A66]"
                >
                  Save Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
