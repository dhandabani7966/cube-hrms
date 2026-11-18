import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  ChevronDown,
  Check,
  CheckSquare,
  Square,
  X,
  Download,
  Upload,
  ArrowLeft,
  Briefcase,
  UserCheck,
  Shield,
  RefreshCw,
  Laptop,
  Eye,
  EyeOff,
  Bell,
  Settings,
  ArrowUpDown,
  History,
  Layers,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';

export interface EmployeeItem {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  work_email: string;
  personal_email?: string;
  mobile_phone?: string;
  department: string;
  designation: string;
  location?: string;
  employment_status: string;
  joining_date: string;
  date_of_birth?: string;
  gender?: string;
  role: string;
  photo?: string | null;
  reporting_manager_id?: string | null;
  pan_number?: string;
  aadhaar_masked?: string;
  bank_account?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  mail_alias: string;
  added_by: string;
  added_time: string;
  modified_by: string;
  modified_time: string;
}

export interface DesignationItem {
  id: string;
  title: string;
  code: string;
  mail_alias: string;
  added_by: string;
  added_time: string;
  modified_by: string;
  modified_time: string;
}

export interface HrProcessItem {
  id: string;
  process: string;
  status: string;
  key_field: string;
  value: string;
  effective_date: string;
  reason: string;
  employee_id?: string;
}

type TabType = 'employees' | 'userSpecific' | 'insights' | 'departments' | 'designations' | 'hrProcess';

// Robot illustrations for empty states matching the reference design
function SearchBotIllustration() {
  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-md">
        {/* Dome background */}
        <path
          d="M 20 150 A 100 100 0 0 1 220 150 Z"
          fill="#374151"
          opacity="0.4"
        />
        {/* Antenna */}
        <line x1="120" y1="52" x2="120" y2="40" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="120" cy="38" r="5" fill="#EF4444" />
        {/* Wings */}
        <ellipse cx="92" cy="70" rx="18" ry="10" fill="#93C5FD" opacity="0.8" transform="rotate(-30 92 70)" />
        <ellipse cx="148" cy="70" rx="18" ry="10" fill="#93C5FD" opacity="0.8" transform="rotate(30 148 70)" />
        {/* Head */}
        <circle cx="120" cy="75" r="28" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
        {/* Eyes */}
        <ellipse cx="112" cy="74" rx="4" ry="6" fill="#0284C7" />
        <ellipse cx="128" cy="74" rx="4" ry="6" fill="#0284C7" />
        <circle cx="113" cy="72" r="1.5" fill="#FFFFFF" />
        <circle cx="129" cy="72" r="1.5" fill="#FFFFFF" />
        {/* Body */}
        <path
          d="M 102 96 C 102 90, 138 90, 138 96 L 142 120 C 142 128, 98 128, 98 120 Z"
          fill="#3B82F6"
        />
        {/* Stripes on body */}
        <path d="M 100 106 L 140 106" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M 100 114 L 140 114" stroke="#FFFFFF" strokeWidth="2.5" />
        {/* Arms holding magnifying glass */}
        <path d="M 98 102 Q 88 115 110 120" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 142 102 Q 132 118 120 122" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Magnifying glass */}
        <circle cx="116" cy="122" r="10" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" opacity="0.9" />
        <line x1="123" y1="129" x2="132" y2="138" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
        {/* Ground puddle/shadow */}
        <ellipse cx="120" cy="148" rx="55" ry="6" fill="#1E293B" opacity="0.5" />
      </svg>
    </div>
  );
}

function BoxBotIllustration() {
  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-md">
        {/* Dome background */}
        <path
          d="M 20 150 A 100 100 0 0 1 220 150 Z"
          fill="#374151"
          opacity="0.4"
        />
        {/* Antenna */}
        <line x1="116" y1="52" x2="116" y2="40" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="116" cy="38" r="5" fill="#EF4444" />
        {/* Wings */}
        <ellipse cx="90" cy="68" rx="16" ry="9" fill="#93C5FD" opacity="0.8" transform="rotate(-30 90 68)" />
        <ellipse cx="142" cy="68" rx="16" ry="9" fill="#93C5FD" opacity="0.8" transform="rotate(30 142 68)" />
        {/* Head */}
        <circle cx="116" cy="74" r="26" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
        {/* Eyes looking down at box */}
        <ellipse cx="110" cy="76" rx="4" ry="5" fill="#0284C7" />
        <ellipse cx="124" cy="76" rx="4" ry="5" fill="#0284C7" />
        <circle cx="111" cy="77" r="1.5" fill="#FFFFFF" />
        <circle cx="125" cy="77" r="1.5" fill="#FFFFFF" />
        {/* Body */}
        <path
          d="M 100 96 C 100 90, 132 90, 132 96 L 135 116 C 135 124, 97 124, 97 116 Z"
          fill="#3B82F6"
        />
        {/* Cardboard Box */}
        <polygon points="125,108 165,108 178,138 138,138" fill="#D97706" />
        <polygon points="105,115 125,108 138,138 118,145" fill="#B45309" />
        <polygon points="125,108 145,103 165,108 145,113" fill="#FBBF24" />
        {/* Open box flaps */}
        <polygon points="105,115 95,105 115,102 125,108" fill="#F59E0B" />
        <polygon points="165,108 180,105 178,120 165,123" fill="#D97706" />
        {/* Ground shadow */}
        <ellipse cx="120" cy="148" rx="55" ry="6" fill="#1E293B" opacity="0.5" />
      </svg>
    </div>
  );
}

export function EmployeesView() {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [isFullView, setIsFullView] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Views & Scopes dropdown
  const [viewScope, setViewScope] = useState('Employee View');
  const [dataScope, setDataScope] = useState('All Data');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isScopeMenuOpen, setIsScopeMenuOpen] = useState(false);
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);

  // Data lists
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [hrProcesses, setHrProcesses] = useState<HrProcessItem[]>([]);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // User-specific operations state
  const [userSearchText, setUserSearchText] = useState('');
  const [selectedUserForOps, setSelectedUserForOps] = useState<EmployeeItem | null>(null);

  // HR Process filter
  const [hrProcessFilter, setHrProcessFilter] = useState('All');
  const [isProcessMenuOpen, setIsProcessMenuOpen] = useState(false);

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddDesignationOpen, setIsAddDesignationOpen] = useState(false);
  const [isInitiateProcessOpen, setIsInitiateProcessOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<EmployeeItem | null>(null);
  const [revealSensitive, setRevealSensitive] = useState(false);

  // Add Employee Form State
  const [newEmpCode, setNewEmpCode] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newNickName, setNewNickName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('IT');
  const [newDesig, setNewDesig] = useState('Team Member');
  const [newRole, setNewRole] = useState('Team member');

  // Add Department Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptAlias, setNewDeptAlias] = useState('');

  // Add Designation Form State
  const [newDesigName, setNewDesigName] = useState('');
  const [newDesigCode, setNewDesigCode] = useState('');
  const [newDesigAlias, setNewDesigAlias] = useState('');

  // Initiate Process Form State
  const [procType, setProcType] = useState('Department Change');
  const [procEmpId, setProcEmpId] = useState('');
  const [procNewValue, setProcNewValue] = useState('');
  const [procEffectiveDate, setProcEffectiveDate] = useState('01-Dec-2026');
  const [procReason, setProcReason] = useState('');

  // Approval delegation form state (inside User-specific ops)
  const [delegateeId, setDelegateeId] = useState('');
  const [delegationDuration, setDelegationDuration] = useState('7 days');
  const [delegationSuccess, setDelegationSuccess] = useState(false);

  // Load initial data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [empData, deptData, desigData, procData, insights] = await Promise.all([
        apiFetch<EmployeeItem[]>('/employees'),
        apiFetch<DepartmentItem[]>('/departments'),
        apiFetch<DesignationItem[]>('/designations'),
        apiFetch<HrProcessItem[]>('/employees/processes'),
        apiFetch<any>('/employees/insights/overview'),
      ]);

      if (Array.isArray(empData)) setEmployees(empData);
      if (Array.isArray(deptData)) setDepartments(deptData);
      if (Array.isArray(desigData)) setDesignations(desigData);
      if (Array.isArray(procData)) setHrProcesses(procData);
      if (insights) setInsightsData(insights);
    } catch (err) {
      console.error('Failed to load employee DBMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered employees for Employee View
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filterDepartment !== 'ALL' && emp.department !== filterDepartment) return false;
      if (filterRole !== 'ALL' && emp.role !== filterRole) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(q);
        const matchCode = emp.employee_code.toLowerCase().includes(q);
        const matchEmail = emp.work_email.toLowerCase().includes(q);
        const matchNick = (emp.nick_name || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchEmail && !matchNick) return false;
      }
      return true;
    });
  }, [employees, filterDepartment, filterRole, searchQuery]);

  // Filtered HR processes
  const filteredProcesses = useMemo(() => {
    if (hrProcessFilter === 'All') return hrProcesses;
    return hrProcesses.filter(
      (p) => p.process.toLowerCase() === hrProcessFilter.toLowerCase(),
    );
  }, [hrProcesses, hrProcessFilter]);

  // Select all or deselect visible
  const isAllSelected = filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Submit Add Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) return;

    try {
      const payload = {
        employee_code: newEmpCode.trim() || `S${employees.length + 21}`,
        first_name: newFirstName.trim(),
        last_name: newLastName.trim(),
        nick_name: newNickName.trim() || newFirstName.trim(),
        work_email: newEmail.trim() || `${newFirstName.toLowerCase()}${newLastName.toLowerCase()}@cubeai.internal`,
        department: newDept,
        designation: newDesig,
        role: newRole,
      };

      await apiFetch<EmployeeItem>('/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsAddEmployeeOpen(false);
      setNewFirstName('');
      setNewLastName('');
      setNewNickName('');
      setNewEmail('');
      setNewEmpCode('');
      loadData();
    } catch (err) {
      console.error('Error creating employee:', err);
    }
  };

  // Submit Add Department
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    try {
      const payload = {
        name: newDeptName.trim(),
        code: newDeptCode.trim() || newDeptName.substring(0, 3).toUpperCase(),
        mail_alias: newDeptAlias.trim(),
      };

      await apiFetch<DepartmentItem>('/departments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsAddDepartmentOpen(false);
      setNewDeptName('');
      setNewDeptCode('');
      setNewDeptAlias('');
      loadData();
    } catch (err) {
      console.error('Error creating department:', err);
    }
  };

  // Submit Add Designation
  const handleAddDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesigName.trim()) return;

    try {
      const payload = {
        title: newDesigName.trim(),
        code: newDesigCode.trim() || newDesigName.substring(0, 3).toUpperCase(),
        mail_alias: newDesigAlias.trim(),
      };

      await apiFetch<DesignationItem>('/designations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsAddDesignationOpen(false);
      setNewDesigName('');
      setNewDesigCode('');
      setNewDesigAlias('');
      loadData();
    } catch (err) {
      console.error('Error creating designation:', err);
    }
  };

  // Submit Initiate Process
  const handleInitiateProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === procEmpId);

    try {
      const payload = {
        process: procType,
        employee_id: procEmpId,
        key_field: emp ? `${emp.employee_code} - ${emp.first_name} ${emp.last_name}` : 'Employee',
        value: procNewValue,
        effective_date: procEffectiveDate,
        reason: procReason || 'Role & Organization Restructuring',
      };

      await apiFetch<HrProcessItem>('/employees/processes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsInitiateProcessOpen(false);
      setProcReason('');
      setProcNewValue('');
      loadData();
    } catch (err) {
      console.error('Error initiating HR process:', err);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? employees.filter((e) => selectedIds.includes(e.id))
      : filteredEmployees;

    const headers = ['Employee ID,First Name,Last Name,Nick name,Email address,Department,Designation,Role'];
    const rows = listToExport.map((e) =>
      `"${e.employee_code}","${e.first_name}","${e.last_name}","${e.nick_name || ''}","${e.work_email}","${e.department}","${e.designation}","${e.role}"`,
    );

    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsThreeDotsOpen(false);
  };

  // CSV Import
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCsvText.trim()) return;

    const lines = importCsvText.trim().split('\n');
    let addedCount = 0;

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 3 && !parts[0].toLowerCase().includes('first name') && !parts[0].toLowerCase().includes('employee')) {
        const [first, last, email, dept, desig] = parts;
        await apiFetch('/employees', {
          method: 'POST',
          body: JSON.stringify({
            first_name: first,
            last_name: last || '',
            nick_name: first,
            work_email: email || `${first.toLowerCase()}@cubeai.internal`,
            department: dept || 'IT',
            designation: desig || 'Team Member',
            role: 'Team member',
          }),
        });
        addedCount++;
      }
    }

    setIsImportOpen(false);
    setImportCsvText('');
    loadData();
  };

  // Autocomplete matching for User-specific ops search
  const userSearchMatches = useMemo(() => {
    if (!userSearchText.trim()) return [];
    const q = userSearchText.toLowerCase();
    return employees.filter(
      (e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
        e.employee_code.toLowerCase().includes(q) ||
        (e.nick_name && e.nick_name.toLowerCase().includes(q)) ||
        e.work_email.toLowerCase().includes(q),
    );
  }, [employees, userSearchText]);

  return (
    <div className={`flex flex-col bg-[#121212] text-gray-100 min-h-screen ${isFullView ? 'fixed inset-0 z-50 overflow-auto bg-[#121212] p-4' : 'space-y-4'}`}>
      {/* Top Header Bar Matching Screenshot */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-2.5 bg-[#181818]">
        {/* Left Side: Back Arrow + Module Title + Navigation Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-white font-semibold text-sm shrink-0">
            <button
              onClick={() => setActiveTab('employees')}
              className="p-1 hover:bg-[#2A2A2A] rounded transition text-gray-400 hover:text-white"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="tracking-tight">Employee Information</span>
          </div>

          {/* Horizontal Tabs */}
          <div className="flex items-center gap-1 shrink-0 text-xs font-medium">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('userSpecific')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'userSpecific'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              User specific Operations
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'insights'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('designations')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'designations'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Designations
            </button>
            <button
              onClick={() => setActiveTab('hrProcess')}
              className={`px-3 py-2 rounded-t transition border-b-2 ${
                activeTab === 'hrProcess'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              HR Process
            </button>
          </div>
        </div>

        {/* Right Side Utility Icons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="h-7 w-7 rounded-md bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition shadow-sm"
            title="Add Employee"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (activeTab !== 'userSpecific') {
                setActiveTab('userSpecific');
              }
            }}
            className="text-gray-400 hover:text-white p-1 rounded"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-white p-1 rounded" title="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-white p-1 rounded" title="Settings">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-7 w-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="Admin"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EMPLOYEES                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'employees' && (
        <div className="flex flex-col flex-1 px-4 space-y-3">
          {/* Subheader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Left Controls: Employee View & Edit */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200 hover:bg-[#282828] transition"
                >
                  <span>{viewScope}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isViewMenuOpen && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md bg-[#222] border border-[#3A3A3A] shadow-xl py-1 z-30 text-xs">
                    {['Employee View', 'Active Employees', 'Probation Records', 'Department Wise', 'All Employees'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setViewScope(opt);
                          setIsViewMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#333] transition ${viewScope === opt ? 'text-blue-400 font-semibold' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => alert('Customizing table columns and views...')}
                className="text-xs text-blue-400 hover:underline font-medium"
              >
                Edit
              </button>
            </div>

            {/* Right Controls: Scope, Add Employee, Full View, Filter, Three Dots */}
            <div className="flex items-center gap-2">
              {/* Scope Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsScopeMenuOpen(!isScopeMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200 hover:bg-[#282828] transition"
                >
                  <span>{dataScope}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isScopeMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 rounded-md bg-[#222] border border-[#3A3A3A] shadow-xl py-1 z-30 text-xs">
                    {['All Data', 'My Direct Reports', 'Current Department', 'HQ Only'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDataScope(opt);
                          setIsScopeMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#333] transition ${dataScope === opt ? 'text-blue-400 font-semibold' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Employee Button */}
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="px-3 py-1.5 rounded-md bg-[#0088FF] hover:bg-blue-600 text-xs font-medium text-white shadow-sm transition"
              >
                Add Employee(s)
              </button>

              {/* Full View Toggle */}
              <button
                onClick={() => setIsFullView(!isFullView)}
                className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white transition"
                title={isFullView ? 'Exit Full View' : 'Full View'}
              >
                {isFullView ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-1.5 rounded border transition ${isFilterOpen ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#1F1F1F] border-[#333] text-gray-400 hover:text-white'}`}
                title="Filter Records"
              >
                <Filter className="h-3.5 w-3.5" />
              </button>

              {/* Three Dots Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                  className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white transition"
                  title="More Actions"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
                {isThreeDotsOpen && (
                  <div className="absolute right-0 mt-1 w-44 rounded-md bg-[#222] border border-[#3A3A3A] shadow-xl py-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        setIsImportOpen(true);
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#333] flex items-center gap-2 text-gray-300 transition"
                    >
                      <Upload className="h-3.5 w-3.5 text-blue-400" /> Import
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full text-left px-3 py-2 hover:bg-[#333] flex items-center gap-2 text-gray-300 transition"
                    >
                      <Download className="h-3.5 w-3.5 text-green-400" /> Export
                    </button>
                    <button
                      onClick={() => {
                        alert('Exporting historical employment records...');
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#333] flex items-center gap-2 text-gray-300 transition"
                    >
                      <History className="h-3.5 w-3.5 text-yellow-400" /> History Export
                    </button>
                    <button
                      onClick={() => {
                        setIsImportOpen(true);
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#333] flex items-center gap-2 text-gray-300 transition"
                    >
                      <Layers className="h-3.5 w-3.5 text-purple-400" /> Bulk File Upload
                    </button>
                    <button
                      onClick={() => {
                        alert('Exporting system access and security logs...');
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#333] flex items-center gap-2 text-gray-300 transition"
                    >
                      <Shield className="h-3.5 w-3.5 text-red-400" /> Export Access Log
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Search & Filter Drawer */}
          {isFilterOpen && (
            <div className="rounded-lg bg-[#1A1A1A] border border-[#333] p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, code or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded bg-[#242424] border border-[#3A3A3A] text-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Department:</span>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="rounded bg-[#242424] border border-[#3A3A3A] px-2.5 py-1 text-gray-200 text-xs"
                  >
                    <option value="ALL">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Role:</span>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="rounded bg-[#242424] border border-[#3A3A3A] px-2.5 py-1 text-gray-200 text-xs"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="Team member">Team member</option>
                    <option value="HR Admin">HR Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFilterDepartment('ALL');
                    setFilterRole('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 rounded bg-[#2A2A2A] text-gray-300 hover:text-white text-xs transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-blue-900/30 border border-blue-700/50 px-4 py-2 text-xs">
              <span className="text-blue-300 font-medium">
                {selectedIds.length} candidate/employee(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => {
                    alert(`Deactivating ${selectedIds.length} employees...`);
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white font-medium transition"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-2 py-1 text-gray-400 hover:text-white transition"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Employee Master Table matching Reference Image 2 */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#161616] overflow-x-auto shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] bg-[#1C1C1C] text-gray-400 select-none">
                  <th className="py-2.5 px-3 w-8">
                    <button onClick={toggleSelectAll} className="flex items-center text-gray-400 hover:text-white">
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Employee ID</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>First Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Last Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Nick name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Email address</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center">Photo</th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Department</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Designation</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Role</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-500">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-400" />
                      Loading employee records...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-500">
                      No matching employee records found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id);
                    return (
                      <tr
                        key={emp.id}
                        className={`hover:bg-[#1E1E1E] transition cursor-pointer ${
                          isSelected ? 'bg-blue-950/20' : ''
                        }`}
                        onClick={() => setSelectedEmployeeForDetail(emp)}
                      >
                        <td
                          className="py-2.5 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectOne(emp.id);
                          }}
                        >
                          <button className="flex items-center text-gray-400 hover:text-white">
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-gray-200">
                          {emp.employee_code}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-white">{emp.first_name}</td>
                        <td className="py-2.5 px-3 text-gray-300">{emp.last_name}</td>
                        <td className="py-2.5 px-3 text-gray-400">{emp.nick_name || emp.first_name}</td>
                        <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px] truncate max-w-[200px]">
                          {emp.work_email}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="h-7 w-7 rounded-full bg-slate-700 border border-slate-600 mx-auto flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm">
                            {emp.photo ? (
                              <img src={emp.photo} alt={emp.first_name} className="h-full w-full object-cover" />
                            ) : (
                              <span>{emp.first_name.charAt(0)}{emp.last_name.charAt(0)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-300">{emp.department}</td>
                        <td className="py-2.5 px-3 text-gray-300">{emp.designation}</td>
                        <td className="py-2.5 px-3 text-gray-400 capitalize">{emp.role || 'Team member'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
          <div className="flex items-center justify-between py-2 text-xs text-gray-400 border-t border-[#222]">
            <div>
              Total Record Count : <span className="text-blue-400 font-bold">{filteredEmployees.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>10</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-white">&lt;</button>
                <span>1 - {Math.min(10, filteredEmployees.length)}</span>
                <button className="text-gray-500 hover:text-white">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER-SPECIFIC OPERATIONS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'userSpecific' && (
        <div className="flex flex-col flex-1 px-4 py-3 space-y-5">
          {/* Top Employee Search Bar */}
          <div className="max-w-2xl mx-auto w-full relative">
            <div className="flex items-center rounded-lg bg-[#1F1F1F] border border-[#333] px-3.5 py-2.5 text-xs text-gray-200 shadow-md">
              <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search Employee"
                value={userSearchText}
                onChange={(e) => {
                  setUserSearchText(e.target.value);
                  if (!e.target.value) setSelectedUserForOps(null);
                }}
                className="w-full bg-transparent focus:outline-none placeholder-gray-500 text-xs text-white"
              />
              {userSearchText && (
                <button
                  onClick={() => {
                    setUserSearchText('');
                    setSelectedUserForOps(null);
                  }}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {userSearchText && !selectedUserForOps && userSearchMatches.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 rounded-lg bg-[#222] border border-[#3A3A3A] shadow-2xl py-1 z-30 max-h-60 overflow-y-auto text-xs">
                {userSearchMatches.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedUserForOps(emp);
                      setUserSearchText(`${emp.first_name} ${emp.last_name} (${emp.employee_code})`);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2F2F2F] flex items-center justify-between text-gray-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[10px]">
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.first_name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{emp.first_name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-white">{emp.first_name} {emp.last_name}</span>
                        <span className="text-gray-400 text-[11px] ml-1.5 font-mono">[{emp.employee_code}]</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-[11px]">{emp.department} &bull; {emp.designation}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* If No Employee Selected: Show Vector Robot Mascot Empty State (Image 3) */}
          {!selectedUserForOps ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 space-y-4">
              <SearchBotIllustration />
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Please begin typing to search for an employee
              </p>
            </div>
          ) : (
            /* Selected Employee: Detailed Lifecycle, Operations, Delegation, Assets */
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {/* Profile Card Header */}
              <div className="rounded-xl border border-[#2D2D2D] bg-[#181818] p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-700 border-2 border-blue-500 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-lg font-bold text-white">
                    {selectedUserForOps.photo ? (
                      <img src={selectedUserForOps.photo} alt={selectedUserForOps.first_name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{selectedUserForOps.first_name.charAt(0)}{selectedUserForOps.last_name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedUserForOps.first_name} {selectedUserForOps.last_name}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/40 text-blue-300 border border-blue-700/50">
                        {selectedUserForOps.employee_code}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedUserForOps.designation} &bull; {selectedUserForOps.department}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {selectedUserForOps.work_email} &bull; Joined {selectedUserForOps.joining_date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-300 border border-emerald-700/40">
                    {selectedUserForOps.employment_status || 'ACTIVE'}
                  </span>
                  <button
                    onClick={() => setSelectedEmployeeForDetail(selectedUserForOps)}
                    className="px-3 py-1.5 rounded-md bg-[#242424] hover:bg-[#333] border border-[#3A3A3A] text-xs text-gray-200 transition"
                  >
                    View 360&deg; Profile
                  </button>
                </div>
              </div>

              {/* Grid of Operations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Approval Delegation */}
                <div className="rounded-xl border border-[#2D2D2D] bg-[#181818] p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-400" />
                    Approval Delegation
                  </h3>
                  <p className="text-xs text-gray-400">
                    Temporarily delegate manager sign-off authority (leave approvals, expense claims) to another team member during absence.
                  </p>
                  {delegationSuccess && (
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" /> Delegation successfully saved!
                    </div>
                  )}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Delegatee Employee:</label>
                      <select
                        value={delegateeId}
                        onChange={(e) => setDelegateeId(e.target.value)}
                        className="w-full rounded bg-[#242424] border border-[#3A3A3A] px-3 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select a colleague...</option>
                        {employees.filter((e) => e.id !== selectedUserForOps.id).map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.first_name} {e.last_name} ({e.designation})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Duration:</label>
                      <select
                        value={delegationDuration}
                        onChange={(e) => setDelegationDuration(e.target.value)}
                        className="w-full rounded bg-[#242424] border border-[#3A3A3A] px-3 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="3 days">3 Days (Short leave)</option>
                        <option value="7 days">7 Days (Standard vacation)</option>
                        <option value="14 days">14 Days (Extended leave)</option>
                        <option value="30 days">30 Days (Sabbatical)</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setDelegationSuccess(true);
                        setTimeout(() => setDelegationSuccess(false), 3000);
                      }}
                      className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                    >
                      Save Delegation
                    </button>
                  </div>
                </div>

                {/* 2. Assigned Assets & Equipment */}
                <div className="rounded-xl border border-[#2D2D2D] bg-[#181818] p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-purple-400" />
                    Assigned Assets & Hardware
                  </h3>
                  <p className="text-xs text-gray-400">
                    Corporate inventory and clearance records tracked under this employee ID.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-[#222] border border-[#333] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-200">Apple MacBook Pro 16" (M3 Max)</div>
                        <div className="text-[11px] text-gray-500 font-mono">SN: C02GM098Q6L4 &bull; Issued Jan 2024</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-medium">In Use</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#222] border border-[#333] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-200">Dell UltraSharp 27" 4K Monitor</div>
                        <div className="text-[11px] text-gray-500 font-mono">SN: DL-4K-998822 &bull; Issued Jan 2024</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-medium">In Use</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#222] border border-[#333] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-200">Hardware Security Token (YubiKey 5C)</div>
                        <div className="text-[11px] text-gray-500 font-mono">ID: YK-2024-991 &bull; Active MFA</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 font-medium">Verified</span>
                    </div>
                  </div>
                </div>

                {/* 3. Personal Timeline & Career Milestones */}
                <div className="rounded-xl border border-[#2D2D2D] bg-[#181818] p-5 shadow-sm space-y-4 md:col-span-2">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-amber-400" />
                    Career Milestones & Personal Timeline
                  </h3>
                  <div className="relative border-l border-[#333] ml-3 pl-5 space-y-4 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-[#181818]" />
                      <div className="font-semibold text-white">Joined as {selectedUserForOps.designation}</div>
                      <div className="text-gray-400 text-[11px]">{selectedUserForOps.joining_date} &bull; Department: {selectedUserForOps.department}</div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Offer accepted, background checks verified, and atomic onboarding record created.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#181818]" />
                      <div className="font-semibold text-white">Probation Confirmation</div>
                      <div className="text-gray-400 text-[11px]">90-Day Performance Review Completed</div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Employment confirmed to Full-Time Permanent Status.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-purple-500 border-2 border-[#181818]" />
                      <div className="font-semibold text-white">Annual Appraisal & Role Level Progression</div>
                      <div className="text-gray-400 text-[11px]">01-Oct-2026 &bull; Compensation & Band Alignment</div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Rating: Exceeds Expectations. Promoted to Senior Grade.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INSIGHTS                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'insights' && (
        <div className="flex flex-col flex-1 px-4 py-3 space-y-6">
          {/* Top 3 Metric Cards matching Reference Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Headcount & growth rate */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 text-xs shadow-sm">
              <h3 className="font-bold text-gray-300 text-xs tracking-wider mb-3">Headcount &amp; growth rate</h3>
              <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2B2B2B] pt-3">
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className="text-base font-bold text-white mt-1">{insightsData?.headcount ?? employees.length}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">+{insightsData?.headcountGrowthYoY ?? 12.5}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">+{insightsData?.headcountGrowthMoM ?? 4.2}%</div>
                </div>
              </div>
            </div>

            {/* Card 2: Employee addition & growth rate */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 text-xs shadow-sm">
              <h3 className="font-bold text-gray-300 text-xs tracking-wider mb-3">Employee addition &amp; growth rate</h3>
              <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2B2B2B] pt-3">
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className="text-base font-bold text-white mt-1">{insightsData?.additionCount ?? 8}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">+{insightsData?.additionGrowthYoY ?? 10.0}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">+{insightsData?.additionGrowthMoM ?? 2.1}%</div>
                </div>
              </div>
            </div>

            {/* Card 3: Employee attrition & growth rate */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 text-xs shadow-sm">
              <h3 className="font-bold text-gray-300 text-xs tracking-wider mb-3">Employee attrition &amp; growth rate</h3>
              <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2B2B2B] pt-3">
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className="text-base font-bold text-white mt-1">{insightsData?.attritionCount ?? 0}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-base font-bold text-gray-400 mt-1">0.00%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-base font-bold text-gray-400 mt-1">0.00%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Charts: Additions & Attrition over Last Six Months */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Addition Trend */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">Employee addition trend (Last Six Months)</span>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-teal-500" /> Count</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Percentage</span>
                </div>
              </div>
              <div className="h-44 flex items-end justify-between px-6 pt-6 pb-2 border-b border-[#333] relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-6 border-b border-[#262626]" />
                <div className="absolute inset-x-0 top-18 border-b border-[#262626]" />
                <div className="absolute inset-x-0 top-30 border-b border-[#262626]" />

                {['June', 'July', 'August', 'September', 'October', 'November'].map((month, idx) => {
                  const counts = [0, 0, 0, 0, 1, 8];
                  const count = counts[idx];
                  const height = count === 0 ? 4 : count === 1 ? 28 : 100;
                  return (
                    <div key={month} className="flex flex-col items-center gap-2 z-10">
                      <span className="text-[10px] text-gray-400 font-mono">{count}</span>
                      <div
                        style={{ height: `${height}px` }}
                        className={`w-6 rounded-t transition-all ${count > 0 ? 'bg-teal-500/80 hover:bg-teal-400' : 'bg-[#2A2A2A]'}`}
                      />
                      <span className="text-[10px] text-gray-400">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attrition Trend */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">Employee attrition trend (Last Six Months)</span>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-teal-500" /> Count</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Percentage</span>
                </div>
              </div>
              <div className="h-44 flex items-end justify-between px-6 pt-6 pb-2 border-b border-[#333] relative">
                <div className="absolute inset-x-0 top-6 border-b border-[#262626]" />
                <div className="absolute inset-x-0 top-18 border-b border-[#262626]" />
                <div className="absolute inset-x-0 top-30 border-b border-[#262626]" />

                {['June', 'July', 'August', 'September', 'October', 'November'].map((month) => (
                  <div key={month} className="flex flex-col items-center gap-2 z-10">
                    <span className="text-[10px] text-gray-500 font-mono">0</span>
                    <div style={{ height: '4px' }} className="w-6 rounded-t bg-[#2A2A2A]" />
                    <span className="text-[10px] text-gray-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donut Distribution Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Designations Top 10 */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <h4 className="font-bold text-gray-300 text-xs">Designations (Top 10)</h4>
              <div className="flex items-center justify-around py-3">
                {/* SVG Donut */}
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" strokeWidth="22" strokeDasharray="58 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="22" strokeDasharray="25 100" strokeDashoffset="-58" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" strokeWidth="22" strokeDasharray="10 100" strokeDashoffset="-83" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="22" strokeDasharray="7 100" strokeDashoffset="-93" />
                </svg>
                {/* Legend */}
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span>Team Member (58%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Administration (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span>CEO (8%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span>Manager (8%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Top 10 */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <h4 className="font-bold text-gray-300 text-xs">Department (Top 10)</h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#06B6D4" strokeWidth="22" strokeDasharray="67 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#6366F1" strokeWidth="22" strokeDasharray="25 100" strokeDashoffset="-67" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#EC4899" strokeWidth="22" strokeDasharray="8 100" strokeDashoffset="-92" />
                </svg>
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <span>IT (67%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span>Management (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    <span>HR / Marketing (8%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <h4 className="font-bold text-gray-300 text-xs">Age</h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#38BDF8" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#F97316" strokeWidth="18" strokeDasharray="30 100" strokeDashoffset="-50" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#A855F7" strokeWidth="18" strokeDasharray="20 100" strokeDashoffset="-80" />
                </svg>
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    <span>25 - 34 yrs (50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span>35 - 44 yrs (30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span>&lt; 25 yrs (20%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="rounded-lg bg-[#181818] border border-[#2B2B2B] p-4 space-y-3">
              <h4 className="font-bold text-gray-300 text-xs">Gender</h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#EC4899" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="-50" />
                </svg>
                <div className="space-y-1 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span>Male (50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    <span>Female (50%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DEPARTMENTS                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && (
        <div className="flex flex-col flex-1 px-4 space-y-3">
          {/* Subheader */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200">
                <span>Department View</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button className="text-xs text-blue-400 hover:underline font-medium">Edit</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200">
                <span>All Data</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => setIsAddDepartmentOpen(true)}
                className="px-3 py-1.5 rounded-md bg-[#0088FF] hover:bg-blue-600 text-xs font-medium text-white shadow-sm transition"
              >
                Add Department
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <Filter className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Departments Table matching Reference Image 5 */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#161616] overflow-x-auto shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] bg-[#1C1C1C] text-gray-400 select-none">
                  <th className="py-2.5 px-3 w-8">
                    <Square className="h-4 w-4" />
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Department Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Mail Alias</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Added By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Added Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Modified By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Modified Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Department Code</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-gray-300">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-[#1E1E1E] transition">
                    <td className="py-2.5 px-3">
                      <Square className="h-4 w-4 text-gray-500" />
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">{dept.name}</td>
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{dept.mail_alias || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-300">{dept.added_by || '1 - Dhandabani - M'}</td>
                    <td className="py-2.5 px-3 text-gray-400">{dept.added_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-2.5 px-3 text-gray-300">{dept.modified_by || '1 - Dhandabani - M'}</td>
                    <td className="py-2.5 px-3 text-gray-400">{dept.modified_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-300">{dept.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between py-2 text-xs text-gray-400 border-t border-[#222]">
            <div>
              Total Record Count : <span className="text-blue-400 font-bold">{departments.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>10</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-white">&lt;</button>
                <span>1 - {departments.length}</span>
                <button className="text-gray-500 hover:text-white">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DESIGNATIONS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'designations' && (
        <div className="flex flex-col flex-1 px-4 space-y-3">
          {/* Subheader */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200">
                <span>Designation View</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button className="text-xs text-blue-400 hover:underline font-medium">Edit</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-xs font-medium text-gray-200">
                <span>All Data</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => setIsAddDesignationOpen(true)}
                className="px-3 py-1.5 rounded-md bg-[#0088FF] hover:bg-blue-600 text-xs font-medium text-white shadow-sm transition"
              >
                Add Designation
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <Filter className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Designations Table matching Reference Image 6 */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#161616] overflow-x-auto shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] bg-[#1C1C1C] text-gray-400 select-none">
                  <th className="py-2.5 px-3 w-8">
                    <Square className="h-4 w-4" />
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Designation Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Mail Alias</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Added By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Added Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Modified By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Modified Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                      <span>Designation Code</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-gray-300">
                {designations.map((des) => (
                  <tr key={des.id} className="hover:bg-[#1E1E1E] transition">
                    <td className="py-2.5 px-3">
                      <Square className="h-4 w-4 text-gray-500" />
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">{des.title}</td>
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{des.mail_alias || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-300">{des.added_by || '1 - Dhandabani - M'}</td>
                    <td className="py-2.5 px-3 text-gray-400">{des.added_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-2.5 px-3 text-gray-300">{des.modified_by || '1 - Dhandabani - M'}</td>
                    <td className="py-2.5 px-3 text-gray-400">{des.modified_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-300">{des.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between py-2 text-xs text-gray-400 border-t border-[#222]">
            <div>
              Total Record Count : <span className="text-blue-400 font-bold">{designations.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>10</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-white">&lt;</button>
                <span>1 - {designations.length}</span>
                <button className="text-gray-500 hover:text-white">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: HR PROCESS                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'hrProcess' && (
        <div className="flex flex-col flex-1 px-4 space-y-3">
          {/* Subheader Toolbar matching Reference Image 7 */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Process</span>
              <div className="relative">
                <button
                  onClick={() => setIsProcessMenuOpen(!isProcessMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-200 hover:bg-[#282828] transition font-medium min-w-[140px] justify-between"
                >
                  <span>{hrProcessFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isProcessMenuOpen && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md bg-[#222] border border-[#3A3A3A] shadow-xl py-1 z-30 text-xs">
                    {['All', 'Department Change', 'Location Change', 'Designation Change'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setHrProcessFilter(opt);
                          setIsProcessMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#333] transition ${hrProcessFilter === opt ? 'text-blue-400 font-semibold' : 'text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInitiateProcessOpen(true)}
                className="px-3.5 py-1.5 rounded-md bg-[#0088FF] hover:bg-blue-600 text-xs font-medium text-white shadow-sm transition"
              >
                Initiate Process
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <Filter className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded bg-[#1F1F1F] border border-[#333] text-gray-400 hover:text-white">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* HR Process Table Header */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#161616] overflow-x-auto shadow-inner min-h-[300px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] bg-[#1C1C1C] text-gray-400 select-none">
                  <th className="py-2.5 px-4 font-medium w-28">Status</th>
                  <th className="py-2.5 px-4 font-medium">Key Field</th>
                  <th className="py-2.5 px-4 font-medium">Value</th>
                  <th className="py-2.5 px-4 font-medium">Effective date</th>
                  <th className="py-2.5 px-4 font-medium">Process</th>
                  <th className="py-2.5 px-4 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] text-gray-300">
                {filteredProcesses.length > 0 ? (
                  filteredProcesses.map((proc) => (
                    <tr key={proc.id} className="hover:bg-[#1E1E1E] transition">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            proc.status === 'Approved'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50'
                              : proc.status === 'Pending'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-700/50'
                          }`}
                        >
                          {proc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{proc.key_field}</td>
                      <td className="py-3 px-4 text-blue-300 font-mono text-[11px]">{proc.value}</td>
                      <td className="py-3 px-4 text-gray-400">{proc.effective_date}</td>
                      <td className="py-3 px-4 font-medium text-gray-200">{proc.process}</td>
                      <td className="py-3 px-4 text-gray-400 italic">{proc.reason}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>

            {/* Empty State with Vector Box Mascot matching Image 7 */}
            {filteredProcesses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <BoxBotIllustration />
                <p className="text-sm text-gray-400 font-medium tracking-wide">
                  No records found
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD EMPLOYEE                                                     */}
      {/* ========================================================================= */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#1C1C1C] border border-[#333] shadow-2xl p-6 text-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-400" /> Add Employee
              </h3>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Arun"
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Nick Name</label>
                  <input
                    type="text"
                    value={newNickName}
                    onChange={(e) => setNewNickName(e.target.value)}
                    placeholder="e.g. Arun"
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={newEmpCode}
                    onChange={(e) => setNewEmpCode(e.target.value)}
                    placeholder={`e.g. S${employees.length + 21}`}
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Work Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="arunkumar@cubeai.internal"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Designation</label>
                  <select
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {designations.map((d) => (
                      <option key={d.id} value={d.title}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">System Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Team member">Team member</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#2C2C2C]">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#282828] text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD DEPARTMENT                                                   */}
      {/* ========================================================================= */}
      {isAddDepartmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#1C1C1C] border border-[#333] shadow-2xl p-6 text-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <h3 className="font-bold text-base text-white">Add Department</h3>
              <button
                onClick={() => setIsAddDepartmentOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Quality Assurance"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Department Code</label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  placeholder="e.g. QA"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Mail Alias</label>
                <input
                  type="email"
                  value={newDeptAlias}
                  onChange={(e) => setNewDeptAlias(e.target.value)}
                  placeholder="qa@cubeai.internal"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#2C2C2C]">
                <button
                  type="button"
                  onClick={() => setIsAddDepartmentOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#282828] text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD DESIGNATION                                                  */}
      {/* ========================================================================= */}
      {isAddDesignationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#1C1C1C] border border-[#333] shadow-2xl p-6 text-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <h3 className="font-bold text-base text-white">Add Designation</h3>
              <button
                onClick={() => setIsAddDesignationOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDesignation} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Designation Title *</label>
                <input
                  type="text"
                  required
                  value={newDesigName}
                  onChange={(e) => setNewDesigName(e.target.value)}
                  placeholder="e.g. Lead Architect"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Designation Code</label>
                <input
                  type="text"
                  value={newDesigCode}
                  onChange={(e) => setNewDesigCode(e.target.value)}
                  placeholder="e.g. LA"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Mail Alias</label>
                <input
                  type="email"
                  value={newDesigAlias}
                  onChange={(e) => setNewDesigAlias(e.target.value)}
                  placeholder="architects@cubeai.internal"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#2C2C2C]">
                <button
                  type="button"
                  onClick={() => setIsAddDesignationOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#282828] text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Save Designation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INITIATE HR PROCESS                                              */}
      {/* ========================================================================= */}
      {isInitiateProcessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#1C1C1C] border border-[#333] shadow-2xl p-6 text-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <h3 className="font-bold text-base text-white">Initiate HR Process</h3>
              <button
                onClick={() => setIsInitiateProcessOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleInitiateProcess} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Process Type</label>
                <select
                  data-testid="proc-type-select"
                  value={procType}
                  onChange={(e) => setProcType(e.target.value)}
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Department Change">Department Change</option>
                  <option value="Location Change">Location Change</option>
                  <option value="Designation Change">Designation Change</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Select Employee *</label>
                <select
                  data-testid="proc-emp-select"
                  required
                  value={procEmpId}
                  onChange={(e) => setProcEmpId(e.target.value)}
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.employee_code} - {e.first_name} {e.last_name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">New Value / Transfer Target *</label>
                <input
                  data-testid="proc-value-input"
                  type="text"
                  required
                  value={procNewValue}
                  onChange={(e) => setProcNewValue(e.target.value)}
                  placeholder="e.g. Engineering -> Management"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Effective Date</label>
                <input
                  type="text"
                  value={procEffectiveDate}
                  onChange={(e) => setProcEffectiveDate(e.target.value)}
                  placeholder="01-Dec-2026"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Reason / Business Justification</label>
                <textarea
                  rows={2}
                  value={procReason}
                  onChange={(e) => setProcReason(e.target.value)}
                  placeholder="e.g. Department reorganization and internal career transition"
                  className="w-full rounded bg-[#252525] border border-[#3A3A3A] p-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#2C2C2C]">
                <button
                  type="button"
                  onClick={() => setIsInitiateProcessOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#282828] text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  data-testid="proc-submit-btn"
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Submit Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: IMPORT CANDIDATES / EMPLOYEES                                    */}
      {/* ========================================================================= */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#1C1C1C] border border-[#333] shadow-2xl p-6 text-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-400" /> Import Employees (CSV)
              </h3>
              <button
                onClick={() => setIsImportOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Paste CSV formatted records below (First Name, Last Name, Email, Department, Designation):
            </p>
            <form onSubmit={handleImportSubmit} className="space-y-3 text-xs">
              <textarea
                rows={5}
                required
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                placeholder="Deepak, Sharma, deepak.s@cubeai.internal, IT, Team Member&#10;Kavita, Rao, kavita.r@cubeai.internal, Management, Administration"
                className="w-full rounded bg-[#242424] border border-[#3A3A3A] p-3 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex items-center justify-between pt-3 border-t border-[#2C2C2C]">
                <button
                  type="button"
                  onClick={() => setImportCsvText('Rajesh, Iyer, rajesh.i@cubeai.internal, Engineering, Principal Software Engineer\nMeena, Kumari, meena.k@cubeai.internal, HR, Manager')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Load Sample Data
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportOpen(false)}
                    className="px-4 py-1.5 rounded bg-[#282828] text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                  >
                    Import Employees
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: 360-DEGREE EMPLOYEE PROFILE DETAIL                        */}
      {/* ========================================================================= */}
      {selectedEmployeeForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-[#181818] border-l border-[#2F2F2F] shadow-2xl p-6 overflow-y-auto space-y-6 text-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex items-center justify-center text-sm font-bold text-white">
                  {selectedEmployeeForDetail.photo ? (
                    <img src={selectedEmployeeForDetail.photo} alt={selectedEmployeeForDetail.first_name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{selectedEmployeeForDetail.first_name.charAt(0)}{selectedEmployeeForDetail.last_name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedEmployeeForDetail.first_name} {selectedEmployeeForDetail.last_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-blue-400">{selectedEmployeeForDetail.employee_code}</span>
                    <span className="text-gray-500">&bull;</span>
                    <span className="text-xs text-emerald-400 font-semibold">{selectedEmployeeForDetail.employment_status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForDetail(null)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Information Tabs */}
            <div className="space-y-4 text-xs">
              <div className="rounded-lg bg-[#222] p-4 border border-[#333] space-y-2.5">
                <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-blue-400" /> Employment Details
                </h4>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">Department</span>
                  <span className="text-white font-medium">{selectedEmployeeForDetail.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">Designation</span>
                  <span className="text-white font-medium">{selectedEmployeeForDetail.designation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">System Role</span>
                  <span className="text-white font-medium">{selectedEmployeeForDetail.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">Joining Date</span>
                  <span className="text-white font-medium">{selectedEmployeeForDetail.joining_date}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Work Email</span>
                  <span className="text-blue-400 font-mono">{selectedEmployeeForDetail.work_email}</span>
                </div>
              </div>

              {/* Sensitive Masked Data with toggle */}
              <div className="rounded-lg bg-[#222] p-4 border border-[#333] space-y-2.5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" /> Compliance &amp; Bank Info
                  </h4>
                  <button
                    onClick={() => setRevealSensitive(!revealSensitive)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
                  >
                    {revealSensitive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {revealSensitive ? 'Mask' : 'Reveal'}
                  </button>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">PAN Number</span>
                  <span className="text-white font-mono">{revealSensitive ? (selectedEmployeeForDetail.pan_number || 'ABCDE1234F') : 'ABCDE****F'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2D2D2D]">
                  <span className="text-gray-400">Aadhaar Card</span>
                  <span className="text-white font-mono">{revealSensitive ? (selectedEmployeeForDetail.aadhaar_masked || 'XXXX-XXXX-9012') : 'XXXX-XXXX-****'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Bank Account</span>
                  <span className="text-white font-mono">{revealSensitive ? (selectedEmployeeForDetail.bank_account || '50100234567890') : '50100*******90'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('userSpecific');
                    setSelectedUserForOps(selectedEmployeeForDetail);
                    setSelectedEmployeeForDetail(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition text-center shadow-md"
                >
                  Open Operations Panel
                </button>
                <button
                  onClick={() => setSelectedEmployeeForDetail(null)}
                  className="px-4 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#333] text-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
