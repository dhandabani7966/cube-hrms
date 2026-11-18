import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  ChevronDown,
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
  ArrowUpDown,
  History,
  Layers,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { apiFetch } from '../../lib/api';

// ─── 3 max-to-min horizontal lines funnel filter icon (CubeAI standard) ───
const FilterTaperedIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <rect x="2" y="3.5" width="12" height="1.8" rx="0.9" />
    <rect x="4.5" y="7.5" width="7" height="1.8" rx="0.9" />
    <rect x="7" y="11.5" width="2" height="1.8" rx="0.9" />
  </svg>
);

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

// Adaptive SearchBot Illustration
function SearchBotIllustration({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-md">
        <path
          d="M 20 150 A 100 100 0 0 1 220 150 Z"
          fill={isDark ? "#1E293B" : "#E2E8F0"}
          opacity={isDark ? "0.6" : "0.7"}
        />
        <circle cx="120" cy="115" r="4" fill="#3B82F6" />
        <ellipse cx="90" cy="78" rx="20" ry="12" fill={isDark ? "#0284C7" : "#38BDF8"} opacity="0.6" transform="rotate(-30 90 78)" />
        <ellipse cx="150" cy="78" rx="20" ry="12" fill={isDark ? "#0284C7" : "#38BDF8"} opacity="0.6" transform="rotate(30 150 78)" />
        <circle cx="120" cy="85" r="30" fill={isDark ? "#1E293B" : "#FFFFFF"} stroke={isDark ? "#38BDF8" : "#0284C7"} strokeWidth="3" />
        <circle cx="120" cy="50" r="5" fill="#EF4444" />
        <line x1="120" y1="55" x2="120" y2="62" stroke="#EF4444" strokeWidth="2.5" />
        <ellipse cx="112" cy="86" rx="5" ry="6" fill={isDark ? "#38BDF8" : "#0284C7"} />
        <ellipse cx="128" cy="86" rx="5" ry="6" fill={isDark ? "#38BDF8" : "#0284C7"} />
        <circle cx="113" cy="84" r="2" fill="#FFFFFF" />
        <circle cx="129" cy="84" r="2" fill="#FFFFFF" />
        <path
          d="M 102 110 C 102 102, 138 102, 138 110 L 140 135 C 140 144, 100 144, 100 135 Z"
          fill="#187F7A"
        />
        <line x1="90" y1="120" x2="80" y2="135" stroke="#187F7A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="76" cy="138" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" />
        <line x1="86" y1="148" x2="98" y2="158" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="76" cy="138" r="10" fill={isDark ? "#0284C7" : "#BAE6FD"} opacity="0.4" />
        <ellipse cx="120" cy="152" rx="60" ry="6" fill={isDark ? "#0F172A" : "#CBD5E1"} opacity="0.6" />
      </svg>
    </div>
  );
}

// Adaptive BoxBot Illustration
function BoxBotIllustration({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-md">
        <path
          d="M 20 150 A 100 100 0 0 1 220 150 Z"
          fill={isDark ? "#1E293B" : "#E2E8F0"}
          opacity={isDark ? "0.6" : "0.7"}
        />
        <circle cx="116" cy="42" r="4.5" fill="#EF4444" />
        <line x1="116" y1="46" x2="116" y2="52" stroke="#EF4444" strokeWidth="2.5" />
        <ellipse cx="90" cy="68" rx="16" ry="9" fill={isDark ? "#0284C7" : "#38BDF8"} opacity="0.6" transform="rotate(-30 90 68)" />
        <ellipse cx="142" cy="68" rx="16" ry="9" fill={isDark ? "#0284C7" : "#38BDF8"} opacity="0.6" transform="rotate(30 142 68)" />
        <circle cx="116" cy="74" r="26" fill={isDark ? "#1E293B" : "#FFFFFF"} stroke={isDark ? "#38BDF8" : "#0284C7"} strokeWidth="3" />
        <ellipse cx="110" cy="76" rx="4" ry="5" fill={isDark ? "#38BDF8" : "#0284C7"} />
        <ellipse cx="124" cy="76" rx="4" ry="5" fill={isDark ? "#38BDF8" : "#0284C7"} />
        <circle cx="111" cy="77" r="1.5" fill="#FFFFFF" />
        <circle cx="125" cy="77" r="1.5" fill="#FFFFFF" />
        <path
          d="M 100 96 C 100 90, 132 90, 132 96 L 135 116 C 135 124, 97 124, 97 116 Z"
          fill="#187F7A"
        />
        <polygon points="125,108 165,108 178,138 138,138" fill="#D97706" />
        <polygon points="105,115 125,108 138,138 118,145" fill="#B45309" />
        <polygon points="125,108 145,103 165,108 145,113" fill="#FBBF24" />
        <polygon points="105,115 95,105 115,102 125,108" fill="#F59E0B" />
        <polygon points="165,108 180,105 178,120 165,123" fill="#D97706" />
        <ellipse cx="120" cy="148" rx="55" ry="6" fill={isDark ? "#0F172A" : "#CBD5E1"} opacity="0.6" />
      </svg>
    </div>
  );
}

export function EmployeesView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  // Auto-close any open dropdown or popover card when touching or clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsThreeDotsOpen(false);
        setIsViewMenuOpen(false);
        setIsScopeMenuOpen(false);
        setIsProcessMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
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
      showToast('Employee created and saved to database successfully!');
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
      showToast('Department created and saved to database successfully!');
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
      showToast('Designation created and saved to database successfully!');
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
      showToast('HR process initiated and updated in workforce database!');
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
    showToast(`Exported ${listToExport.length} employee records to CSV!`);
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
    showToast(`Successfully imported ${addedCount} employee(s)!`);
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
    <div className={`flex flex-col transition-colors min-h-screen ${
      isDark ? 'bg-[#0F172A] text-gray-100' : 'bg-[#F8FAFC] text-[#1B2D32]'
    } ${isFullView ? 'fixed inset-0 z-50 overflow-auto p-4' : 'space-y-4'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold bg-[#187F7A] text-white animate-in slide-in-from-top-2">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Top Header Navigation Bar ── */}
      <div className={`border-b flex items-center justify-between px-6 py-3 select-none transition-colors ${
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0] shadow-sm'
      }`}>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {/* Back button & Module Brand Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('employees')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isDark ? 'hover:bg-[#334155] text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-[#5E7174] hover:text-[#0B1730]'
              }`}
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                  Employee Information
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wider ${
                  isDark ? 'bg-teal-950/80 text-teal-400 border border-teal-800' : 'bg-teal-50 text-[#187F7A] border border-teal-200'
                }`}>
                  CORE HR
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal Navigation Tabs */}
          <div className="flex items-center gap-1 shrink-0 text-xs font-medium">
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'employees'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Employees</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'employees'
                  ? isDark ? 'bg-teal-900/60 text-teal-300' : 'bg-teal-100 text-[#187F7A]'
                  : isDark ? 'bg-slate-800 text-gray-400' : 'bg-slate-100 text-gray-500'
              }`}>
                {employees.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('userSpecific')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'userSpecific'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>User specific Operations</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'insights'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'departments'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Departments</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'departments'
                  ? isDark ? 'bg-teal-900/60 text-teal-300' : 'bg-teal-100 text-[#187F7A]'
                  : isDark ? 'bg-slate-800 text-gray-400' : 'bg-slate-100 text-gray-500'
              }`}>
                {departments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('designations')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'designations'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Designations</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'designations'
                  ? isDark ? 'bg-teal-900/60 text-teal-300' : 'bg-teal-100 text-[#187F7A]'
                  : isDark ? 'bg-slate-800 text-gray-400' : 'bg-slate-100 text-gray-500'
              }`}>
                {designations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hrProcess')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'hrProcess'
                  ? isDark ? 'border-teal-400 text-teal-300 font-bold' : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>HR Process</span>
            </button>
          </div>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (activeTab === 'departments') setIsAddDepartmentOpen(true);
              else if (activeTab === 'designations') setIsAddDesignationOpen(true);
              else if (activeTab === 'hrProcess') setIsInitiateProcessOpen(true);
              else setIsAddEmployeeOpen(true);
            }}
            className="h-8 w-8 rounded-lg bg-[#187F7A] hover:bg-[#146A66] flex items-center justify-center text-white transition shadow-sm cursor-pointer"
            title="Create New"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (activeTab !== 'userSpecific') setActiveTab('userSpecific');
            }}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-[#334155]' : 'text-gray-600 hover:text-[#0B1730] hover:bg-slate-100'
            }`}
            title="Quick Search Employee"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="Admin"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EMPLOYEES DIRECTORY & MASTER TABLE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'employees' && (
        <div className="flex flex-col flex-1 px-6 space-y-4">
          {/* Subheader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Left Controls: View selector & Edit */}
            <div className="flex items-center gap-3">
              <div className="relative" data-dropdown="viewScope">
                <button
                  onClick={() => {
                    setIsViewMenuOpen((prev) => !prev);
                    setIsScopeMenuOpen(false);
                    setIsThreeDotsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#334155]' : 'bg-white border-[#CBD5E1] text-[#0B1730] hover:bg-slate-50'
                  }`}
                >
                  <span>{viewScope}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isViewMenuOpen && (
                  <div className={`absolute left-0 mt-1 w-48 rounded-lg border shadow-xl py-1 z-30 text-xs ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                  }`}>
                    {['Employee View', 'Active Personnel', 'Probation Records', 'Department Wise', 'All Data'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setViewScope(opt);
                          setIsViewMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition cursor-pointer ${
                          viewScope === opt
                            ? isDark ? 'bg-teal-950/60 text-teal-300 font-bold' : 'bg-teal-50 text-[#187F7A] font-bold'
                            : isDark ? 'text-gray-300 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => showToast('Column view customization saved!')}
                className={`text-xs font-semibold cursor-pointer ${isDark ? 'text-teal-400 hover:underline' : 'text-[#187F7A] hover:underline'}`}
              >
                Edit
              </button>
            </div>

            {/* Right Controls: Scope, Add Employee, Full View, Filter, Three Dots */}
            <div className="flex items-center gap-2">
              {/* Scope Dropdown */}
              <div className="relative" data-dropdown="dataScope">
                <button
                  onClick={() => {
                    setIsScopeMenuOpen((prev) => !prev);
                    setIsViewMenuOpen(false);
                    setIsThreeDotsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#334155]' : 'bg-white border-[#CBD5E1] text-[#0B1730] hover:bg-slate-50'
                  }`}
                >
                  <span>{dataScope}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isScopeMenuOpen && (
                  <div className={`absolute right-0 mt-1 w-44 rounded-lg border shadow-xl py-1 z-30 text-xs ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                  }`}>
                    {['All Data', 'My Direct Reports', 'Current Department', 'HQ Only'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDataScope(opt);
                          setIsScopeMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition cursor-pointer ${
                          dataScope === opt
                            ? isDark ? 'bg-teal-950/60 text-teal-300 font-bold' : 'bg-teal-50 text-[#187F7A] font-bold'
                            : isDark ? 'text-gray-300 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Employee(s) Button */}
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Employee(s)</span>
              </button>

              {/* Full View Toggle */}
              <button
                onClick={() => setIsFullView(!isFullView)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400 hover:text-white' : 'bg-white border-[#CBD5E1] text-[#5E7174] hover:text-[#0B1730]'
                }`}
                title={isFullView ? 'Exit Full View' : 'Full View'}
              >
                {isFullView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Filter Button (with 3-tapered-lines standard icon) */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isFilterOpen
                    ? isDark ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-teal-50 border-[#187F7A] text-[#187F7A]'
                    : isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400 hover:text-white' : 'bg-white border-[#CBD5E1] text-[#5E7174] hover:text-[#0B1730]'
                }`}
                title="Filter Records"
              >
                <FilterTaperedIcon className="h-4 w-4" />
              </button>

              {/* Three Dots Menu */}
              <div className="relative" data-dropdown="threeDots">
                <button
                  onClick={() => {
                    setIsThreeDotsOpen((prev) => !prev);
                    setIsViewMenuOpen(false);
                    setIsScopeMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400 hover:text-white' : 'bg-white border-[#CBD5E1] text-[#5E7174] hover:text-[#0B1730]'
                  }`}
                  title="More Actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {isThreeDotsOpen && (
                  <div className={`absolute right-0 mt-1 w-48 rounded-lg border shadow-xl py-1 z-30 text-xs ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                  }`}>
                    <button
                      onClick={() => {
                        setIsImportOpen(true);
                        setIsThreeDotsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition cursor-pointer ${
                        isDark ? 'text-gray-200 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                      }`}
                    >
                      <Upload className="h-4 w-4 text-blue-500" />
                      <span>Import</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition cursor-pointer ${
                        isDark ? 'text-gray-200 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                      }`}
                    >
                      <Download className="h-4 w-4 text-emerald-500" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast('Exported historical employment audit trail successfully!');
                        setIsThreeDotsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition cursor-pointer ${
                        isDark ? 'text-gray-200 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                      }`}
                    >
                      <History className="h-4 w-4 text-amber-500" />
                      <span>History Export</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsImportOpen(true);
                        setIsThreeDotsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition cursor-pointer ${
                        isDark ? 'text-gray-200 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="h-4 w-4 text-purple-500" />
                      <span>Bulk File Upload</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast('Exported system access and security logs successfully!');
                        setIsThreeDotsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition cursor-pointer ${
                        isDark ? 'text-gray-200 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                      }`}
                    >
                      <Shield className="h-4 w-4 text-red-500" />
                      <span>Export Access Log</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Search & Filter Bar Flyout */}
          {isFilterOpen && (
            <div className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4 text-xs transition-colors shadow-sm ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, code or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none transition ${
                      isDark
                        ? 'bg-[#0F172A] border-[#334155] text-white placeholder-gray-500 focus:border-teal-500'
                        : 'bg-white border-[#CBD5E1] text-[#0B1730] placeholder-gray-400 focus:border-[#187F7A]'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-gray-400 font-medium' : 'text-[#5E7174] font-medium'}>Department:</span>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    <option value="ALL">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-gray-400 font-medium' : 'text-[#5E7174] font-medium'}>Role:</span>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
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
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Bulk Selection Action Dock */}
          {selectedIds.length > 0 && (
            <div className={`flex items-center justify-between rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md border ${
              isDark ? 'bg-teal-950/60 border-teal-700/60 text-teal-200' : 'bg-teal-50 border-teal-200 text-[#187F7A]'
            }`}>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span>{selectedIds.length} employee record(s) selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-medium transition cursor-pointer"
                >
                  Export Selected
                </button>
                <button
                  onClick={() => {
                    showToast(`Mass status update applied for ${selectedIds.length} employees.`);
                    setSelectedIds([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#334155]' : 'bg-white border-[#CBD5E1] text-[#0B1730] hover:bg-slate-50'
                  }`}
                >
                  Mass Update
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Employee Master Table */}
          <div className={`rounded-xl border overflow-x-auto shadow-sm transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b select-none font-semibold ${
                  isDark ? 'bg-[#0F172A] border-[#334155] text-gray-400' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                }`}>
                  <th className="py-3 px-3 w-8">
                    <button onClick={toggleSelectAll} className="flex items-center cursor-pointer">
                      {isAllSelected ? (
                        <CheckSquare className={`h-4 w-4 ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`} />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Employee ID</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>First Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Last Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Nick name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Email address</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold text-center">Photo</th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Department</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Designation</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                      <span>Role</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-[#334155] text-gray-300' : 'divide-[#F1F5F9] text-[#1B2D32]'
              }`}>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-gray-400">
                      <RefreshCw className={`h-6 w-6 animate-spin mx-auto mb-2 ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`} />
                      <span>Loading workforce records...</span>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-gray-400">
                      No matching employee records found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id);
                    return (
                      <tr
                        key={emp.id}
                        className={`transition cursor-pointer ${
                          isSelected
                            ? isDark ? 'bg-teal-950/30' : 'bg-teal-50/70'
                            : isDark ? 'hover:bg-[#334155]/40' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedEmployeeForDetail(emp)}
                      >
                        <td
                          className="py-3 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectOne(emp.id);
                          }}
                        >
                          <button className="flex items-center cursor-pointer">
                            {isSelected ? (
                              <CheckSquare className={`h-4 w-4 ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`} />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                          {emp.employee_code}
                        </td>
                        <td className={`py-3 px-3 font-semibold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                          {emp.first_name}
                        </td>
                        <td className={`py-3 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {emp.last_name}
                        </td>
                        <td className="py-3 px-3 text-gray-400">
                          {emp.nick_name || emp.first_name}
                        </td>
                        <td className={`py-3 px-3 font-mono text-[11px] truncate max-w-[200px] ${
                          isDark ? 'text-teal-300' : 'text-[#187F7A]'
                        }`}>
                          {emp.work_email}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className={`h-7 w-7 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm border ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-100 border-[#CBD5E1] text-[#0B1730]'
                          }`}>
                            {emp.photo ? (
                              <img src={emp.photo} alt={emp.first_name} className="h-full w-full object-cover" />
                            ) : (
                              <span>{emp.first_name.charAt(0)}{emp.last_name.charAt(0)}</span>
                            )}
                          </div>
                        </td>
                        <td className={`py-3 px-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                          {emp.department}
                        </td>
                        <td className={`py-3 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {emp.designation}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            isDark ? 'bg-slate-800 text-gray-300' : 'bg-slate-100 text-gray-700'
                          }`}>
                            {emp.role || 'Team member'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
          <div className={`flex items-center justify-between py-2 text-xs border-t transition-colors ${
            isDark ? 'border-[#334155] text-gray-400' : 'border-[#E2E8F0] text-[#5E7174]'
          }`}>
            <div>
              Total Record Count : <span className={`font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>{filteredEmployees.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 font-semibold">
                <span>10</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="hover:opacity-80 cursor-pointer">&lt;</button>
                <span>1 - {Math.min(10, filteredEmployees.length)}</span>
                <button className="hover:opacity-80 cursor-pointer">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER-SPECIFIC OPERATIONS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'userSpecific' && (
        <div className="flex flex-col flex-1 px-6 py-3 space-y-6">
          {/* Top Search Bar */}
          <div className="max-w-2xl mx-auto w-full relative">
            <div className={`flex items-center rounded-xl border px-4 py-3 text-xs shadow-md transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}>
              <Search className="h-4 w-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search Employee"
                value={userSearchText}
                onChange={(e) => {
                  setUserSearchText(e.target.value);
                  if (!e.target.value) setSelectedUserForOps(null);
                }}
                className={`w-full bg-transparent focus:outline-none text-xs font-medium placeholder-gray-400 ${
                  isDark ? 'text-white' : 'text-[#0B1730]'
                }`}
              />
              {userSearchText && (
                <button
                  onClick={() => {
                    setUserSearchText('');
                    setSelectedUserForOps(null);
                  }}
                  className="text-gray-400 hover:opacity-80 ml-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {!selectedUserForOps && (
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Try searching:</span>
                {employees.slice(0, 4).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedUserForOps(emp);
                      setUserSearchText(`${emp.first_name} ${emp.last_name} (${emp.employee_code})`);
                    }}
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition cursor-pointer ${
                      isDark
                        ? 'bg-[#1E293B] border-[#334155] text-teal-300 hover:bg-[#334155]'
                        : 'bg-white border-[#CBD5E1] text-[#187F7A] hover:bg-teal-50'
                    }`}
                  >
                    {emp.first_name} {emp.last_name} ({emp.employee_code})
                  </button>
                ))}
              </div>
            )}

            {/* Dropdown Suggestions */}
            {userSearchText && !selectedUserForOps && userSearchMatches.length > 0 && (
              <div className={`absolute left-0 right-0 mt-2 rounded-xl border shadow-2xl py-1 z-30 max-h-60 overflow-y-auto text-xs ${
                isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
              }`}>
                {userSearchMatches.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedUserForOps(emp);
                      setUserSearchText(`${emp.first_name} ${emp.last_name} (${emp.employee_code})`);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition cursor-pointer ${
                      isDark ? 'hover:bg-[#334155] text-gray-200' : 'hover:bg-slate-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-6 w-6 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold ${
                        isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-[#0B1730]'
                      }`}>
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.first_name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{emp.first_name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                          {emp.first_name} {emp.last_name}
                        </span>
                        <span className="text-gray-400 text-[11px] ml-1.5 font-mono">[{emp.employee_code}]</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-[11px]">{emp.department} &bull; {emp.designation}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Empty State: SearchBot Illustration */}
          {!selectedUserForOps ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 space-y-4">
              <SearchBotIllustration isDark={isDark} />
              <p className={`text-sm font-semibold tracking-wide ${isDark ? 'text-gray-300' : 'text-[#475569]'}`}>
                Please begin typing to search for an employee
              </p>
              <p className={`text-xs max-w-md text-center ${isDark ? 'text-gray-500' : 'text-[#94A3B8]'}`}>
                Access user-specific operations, career milestones, approval delegation, hardware clearances, and organizational reporting tree.
              </p>
            </div>
          ) : (
            /* Selected Employee Life-Cycle & Operations Dashboard */
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {/* Executive Header Banner */}
              <div className={`rounded-xl border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-full border-2 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-lg font-bold ${
                    isDark ? 'border-teal-400 bg-slate-700 text-white' : 'border-[#187F7A] bg-teal-50 text-[#187F7A]'
                  }`}>
                    {selectedUserForOps.photo ? (
                      <img src={selectedUserForOps.photo} alt={selectedUserForOps.first_name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{selectedUserForOps.first_name.charAt(0)}{selectedUserForOps.last_name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                        {selectedUserForOps.first_name} {selectedUserForOps.last_name}
                      </h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isDark ? 'bg-teal-950/60 text-teal-300 border-teal-700/50' : 'bg-teal-50 text-[#187F7A] border-teal-200'
                      }`}>
                        {selectedUserForOps.employee_code}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedUserForOps.designation} &bull; {selectedUserForOps.department}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {selectedUserForOps.work_email} &bull; Joined {selectedUserForOps.joining_date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {selectedUserForOps.employment_status || 'ACTIVE'}
                  </span>
                  <button
                    onClick={() => setSelectedEmployeeForDetail(selectedUserForOps)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-gray-200 hover:bg-[#334155]' : 'bg-white border-[#CBD5E1] text-[#0B1730] hover:bg-slate-50'
                    }`}
                  >
                    View 360&deg; Profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUserForOps(null);
                      setUserSearchText('');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Grid of Modular Operations Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Approval Delegation Card */}
                <div className={`rounded-xl border p-5 shadow-sm space-y-4 transition-colors ${
                  isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    <UserCheck className={`h-4 w-4 ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`} />
                    <span>Approval Delegation</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Temporarily delegate manager sign-off authority (leave approvals, expense claims) to another team member during absence.
                  </p>
                  {delegationSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Delegation authority successfully saved!</span>
                    </div>
                  )}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className={`block mb-1 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Delegatee Employee:
                      </label>
                      <select
                        value={delegateeId}
                        onChange={(e) => setDelegateeId(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                        }`}
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
                      <label className={`block mb-1 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Duration:
                      </label>
                      <select
                        value={delegationDuration}
                        onChange={(e) => setDelegationDuration(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                        }`}
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
                      className="w-full py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer"
                    >
                      Save Delegation
                    </button>
                  </div>
                </div>

                {/* 2. Assigned Assets & Hardware Card */}
                <div className={`rounded-xl border p-5 shadow-sm space-y-4 transition-colors ${
                  isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    <Laptop className="h-4 w-4 text-purple-500" />
                    <span>Assigned Assets &amp; Hardware</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Corporate inventory and clearance records tracked under this employee ID.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-[#E2E8F0]'
                    }`}>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>Apple MacBook Pro 16" (M3 Max)</div>
                        <div className="text-[11px] text-gray-400 font-mono">SN: C02GM098Q6L4 &bull; Issued Jan 2024</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isDark ? 'bg-teal-950/60 text-teal-300' : 'bg-teal-100 text-[#187F7A]'
                      }`}>In Use</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-[#E2E8F0]'
                    }`}>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>Dell UltraSharp 27" 4K Monitor</div>
                        <div className="text-[11px] text-gray-400 font-mono">SN: DL-4K-998822 &bull; Issued Jan 2024</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isDark ? 'bg-teal-950/60 text-teal-300' : 'bg-teal-100 text-[#187F7A]'
                      }`}>In Use</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-[#E2E8F0]'
                    }`}>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>Hardware Security Token (YubiKey 5C)</div>
                        <div className="text-[11px] text-gray-400 font-mono">ID: YK-2024-991 &bull; Active MFA</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Verified</span>
                    </div>
                  </div>
                </div>

                {/* 3. Personal Timeline & Career Milestones Card */}
                <div className={`rounded-xl border p-5 shadow-sm space-y-4 md:col-span-2 transition-colors ${
                  isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    <History className="h-4 w-4 text-amber-500" />
                    <span>Career Milestones &amp; Personal Timeline</span>
                  </h3>
                  <div className={`relative border-l ml-3 pl-5 space-y-4 text-xs ${
                    isDark ? 'border-[#334155]' : 'border-[#CBD5E1]'
                  }`}>
                    <div className="relative">
                      <div className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 ${
                        isDark ? 'bg-teal-400 border-[#1E293B]' : 'bg-[#187F7A] border-white'
                      }`} />
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                        Joined as {selectedUserForOps.designation}
                      </div>
                      <div className="text-gray-400 text-[11px]">{selectedUserForOps.joining_date} &bull; Department: {selectedUserForOps.department}</div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Offer accepted, background checks verified, and atomic onboarding record created.
                      </p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 bg-emerald-500 ${
                        isDark ? 'border-[#1E293B]' : 'border-white'
                      }`} />
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                        Probation Confirmation
                      </div>
                      <div className="text-gray-400 text-[11px]">90-Day Performance Review Completed</div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Employment confirmed to Full-Time Permanent Status.
                      </p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 bg-purple-500 ${
                        isDark ? 'border-[#1E293B]' : 'border-white'
                      }`} />
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                        Annual Appraisal &amp; Role Level Progression
                      </div>
                      <div className="text-gray-400 text-[11px]">01-Oct-2026 &bull; Compensation &amp; Band Alignment</div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Rating: Exceeds Expectations. Promoted to Senior Grade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INSIGHTS & ANALYTICS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'insights' && (
        <div className="flex flex-col flex-1 px-6 py-3 space-y-6">
          {/* Top 3 KPI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Headcount & growth rate */}
            <div className={`rounded-xl border p-5 text-xs shadow-sm transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h3 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Headcount &amp; growth rate
              </h3>
              <div className={`grid grid-cols-3 gap-2 text-center border-t pt-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    {insightsData?.headcount ?? employees.length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">
                    +{insightsData?.headcountGrowthYoY ?? 12.5}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">
                    +{insightsData?.headcountGrowthMoM ?? 4.2}%
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Employee addition & growth rate */}
            <div className={`rounded-xl border p-5 text-xs shadow-sm transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h3 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Employee addition &amp; growth rate
              </h3>
              <div className={`grid grid-cols-3 gap-2 text-center border-t pt-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    {insightsData?.additionCount ?? 8}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">
                    +{insightsData?.additionGrowthYoY ?? 10.0}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">
                    +{insightsData?.additionGrowthMoM ?? 2.1}%
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Employee attrition & growth rate */}
            <div className={`rounded-xl border p-5 text-xs shadow-sm transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h3 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Employee attrition &amp; growth rate
              </h3>
              <div className={`grid grid-cols-3 gap-2 text-center border-t pt-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                <div>
                  <div className="text-gray-400 text-[11px]">Mean (Nov)</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    {insightsData?.attritionCount ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">YoY</div>
                  <div className="text-xl font-bold text-gray-400 mt-1">0.00%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">MoM</div>
                  <div className="text-xl font-bold text-gray-400 mt-1">0.00%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Charts: Additions & Attrition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Addition Trend */}
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                  Employee addition trend (Last Six Months)
                </span>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-sm bg-[#187F7A]" /> Count
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" /> Percentage
                  </span>
                </div>
              </div>
              <div className={`h-48 flex items-end justify-between px-6 pt-6 pb-2 border-b relative ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                {/* Horizontal grid lines */}
                <div className={`absolute inset-x-0 top-8 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />
                <div className={`absolute inset-x-0 top-20 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />
                <div className={`absolute inset-x-0 top-32 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />

                {['June', 'July', 'August', 'September', 'October', 'November'].map((month, idx) => {
                  const counts = [0, 0, 0, 0, 1, 8];
                  const count = counts[idx];
                  const height = count === 0 ? 6 : count === 1 ? 32 : 115;
                  return (
                    <div key={month} className="flex flex-col items-center gap-2 z-10">
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{count}</span>
                      <div
                        style={{ height: `${height}px` }}
                        className={`w-7 rounded-t-lg transition-all ${
                          count > 0 ? 'bg-[#187F7A] hover:bg-[#146A66]' : isDark ? 'bg-[#334155]' : 'bg-slate-200'
                        }`}
                      />
                      <span className="text-[10px] text-gray-400 font-medium">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attrition Trend */}
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                  Employee attrition trend (Last Six Months)
                </span>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-sm bg-[#187F7A]" /> Count
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" /> Percentage
                  </span>
                </div>
              </div>
              <div className={`h-48 flex items-end justify-between px-6 pt-6 pb-2 border-b relative ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <div className={`absolute inset-x-0 top-8 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />
                <div className={`absolute inset-x-0 top-20 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />
                <div className={`absolute inset-x-0 top-32 border-b ${isDark ? 'border-[#334155]/40' : 'border-slate-100'}`} />

                {['June', 'July', 'August', 'September', 'October', 'November'].map((month) => (
                  <div key={month} className="flex flex-col items-center gap-2 z-10">
                    <span className="text-[10px] text-gray-400 font-mono font-bold">0</span>
                    <div style={{ height: '6px' }} className={`w-7 rounded-t-lg ${isDark ? 'bg-[#334155]' : 'bg-slate-200'}`} />
                    <span className="text-[10px] text-gray-400 font-medium">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donut Demographic Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Designations Top 10 */}
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Designations (Top 10)
              </h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#187F7A" strokeWidth="22" strokeDasharray="58 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#0284C7" strokeWidth="22" strokeDasharray="25 100" strokeDashoffset="-58" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" strokeWidth="22" strokeDasharray="10 100" strokeDashoffset="-83" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="22" strokeDasharray="7 100" strokeDashoffset="-93" />
                </svg>
                <div className={`space-y-1.5 text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#187F7A]" />
                    <span>Team Member (58%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
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
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Department (Top 10)
              </h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#06B6D4" strokeWidth="22" strokeDasharray="67 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#6366F1" strokeWidth="22" strokeDasharray="25 100" strokeDashoffset="-67" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#EC4899" strokeWidth="22" strokeDasharray="8 100" strokeDashoffset="-92" />
                </svg>
                <div className={`space-y-1.5 text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Age
              </h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#38BDF8" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#F97316" strokeWidth="18" strokeDasharray="30 100" strokeDashoffset="-50" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#A855F7" strokeWidth="18" strokeDasharray="20 100" strokeDashoffset="-80" />
                </svg>
                <div className={`space-y-1.5 text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
            <div className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-[#0B1730]'}`}>
                Gender
              </h4>
              <div className="flex items-center justify-around py-3">
                <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#0284C7" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#EC4899" strokeWidth="18" strokeDasharray="50 100" strokeDashoffset="-50" />
                </svg>
                <div className={`space-y-1.5 text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
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
        <div className="flex flex-col flex-1 px-6 space-y-4">
          {/* Subheader */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
              }`}>
                <span>Department View</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => showToast('Department view customized!')}
                className={`text-xs font-semibold ${isDark ? 'text-teal-400 hover:underline' : 'text-[#187F7A] hover:underline'}`}
              >
                Edit
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
              }`}>
                <span>All Data</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => setIsAddDepartmentOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Department</span>
              </button>
              <button className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400' : 'bg-white border-[#CBD5E1] text-[#5E7174]'
              }`}>
                <FilterTaperedIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Departments Table */}
          <div className={`rounded-xl border overflow-x-auto shadow-sm transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b select-none font-semibold ${
                  isDark ? 'bg-[#0F172A] border-[#334155] text-gray-400' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                }`}>
                  <th className="py-3 px-3 w-8">
                    <Square className="h-4 w-4 text-gray-400" />
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Department Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Mail Alias</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Added By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Added Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Modified By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Modified Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Department Code</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-[#334155] text-gray-300' : 'divide-[#F1F5F9] text-[#1B2D32]'
              }`}>
                {departments.map((dept) => (
                  <tr key={dept.id} className={`transition ${
                    isDark ? 'hover:bg-[#334155]/40' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-3 px-3">
                      <Square className="h-4 w-4 text-gray-400" />
                    </td>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{dept.name}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-400">{dept.mail_alias || '-'}</td>
                    <td className="py-3 px-3 text-gray-500">{dept.added_by || '1 - Dhandabani - M'}</td>
                    <td className="py-3 px-3 text-gray-400">{dept.added_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-3 px-3 text-gray-500">{dept.modified_by || '1 - Dhandabani - M'}</td>
                    <td className="py-3 px-3 text-gray-400">{dept.modified_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>{dept.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex items-center justify-between py-2 text-xs border-t transition-colors ${
            isDark ? 'border-[#334155] text-gray-400' : 'border-[#E2E8F0] text-[#5E7174]'
          }`}>
            <div>
              Total Record Count : <span className={`font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>{departments.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 font-semibold">
                <span>10</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="hover:opacity-80 cursor-pointer">&lt;</button>
                <span>1 - {departments.length}</span>
                <button className="hover:opacity-80 cursor-pointer">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DESIGNATIONS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'designations' && (
        <div className="flex flex-col flex-1 px-6 space-y-4">
          {/* Subheader */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
              }`}>
                <span>Designation View</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => showToast('Designation view customized!')}
                className={`text-xs font-semibold ${isDark ? 'text-teal-400 hover:underline' : 'text-[#187F7A] hover:underline'}`}
              >
                Edit
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
              }`}>
                <span>All Data</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => setIsAddDesignationOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Designation</span>
              </button>
              <button className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400' : 'bg-white border-[#CBD5E1] text-[#5E7174]'
              }`}>
                <FilterTaperedIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Designations Table */}
          <div className={`rounded-xl border overflow-x-auto shadow-sm transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b select-none font-semibold ${
                  isDark ? 'bg-[#0F172A] border-[#334155] text-gray-400' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                }`}>
                  <th className="py-3 px-3 w-8">
                    <Square className="h-4 w-4 text-gray-400" />
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Designation Name</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Mail Alias</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Added By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Added Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Modified By</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Modified Time</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Designation Code</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-[#334155] text-gray-300' : 'divide-[#F1F5F9] text-[#1B2D32]'
              }`}>
                {designations.map((des) => (
                  <tr key={des.id} className={`transition ${
                    isDark ? 'hover:bg-[#334155]/40' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-3 px-3">
                      <Square className="h-4 w-4 text-gray-400" />
                    </td>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{des.title}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-400">{des.mail_alias || '-'}</td>
                    <td className="py-3 px-3 text-gray-500">{des.added_by || '1 - Dhandabani - M'}</td>
                    <td className="py-3 px-3 text-gray-400">{des.added_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className="py-3 px-3 text-gray-500">{des.modified_by || '1 - Dhandabani - M'}</td>
                    <td className="py-3 px-3 text-gray-400">{des.modified_time || '16-Nov-2026 02:58 PM'}</td>
                    <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>{des.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`flex items-center justify-between py-2 text-xs border-t transition-colors ${
            isDark ? 'border-[#334155] text-gray-400' : 'border-[#E2E8F0] text-[#5E7174]'
          }`}>
            <div>
              Total Record Count : <span className={`font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>{designations.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 font-semibold">
                <span>10</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="hover:opacity-80 cursor-pointer">&lt;</button>
                <span>1 - {designations.length}</span>
                <button className="hover:opacity-80 cursor-pointer">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: HR PROCESS                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'hrProcess' && (
        <div className="flex flex-col flex-1 px-6 space-y-4">
          {/* Subheader Toolbar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-[#475569]'}`}>Process:</span>
              <div className="relative" data-dropdown="hrProcess">
                <button
                  onClick={() => {
                    setIsProcessMenuOpen((prev) => !prev);
                    setIsThreeDotsOpen(false);
                    setIsViewMenuOpen(false);
                    setIsScopeMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold min-w-[150px] justify-between cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                >
                  <span>{hrProcessFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {isProcessMenuOpen && (
                  <div className={`absolute left-0 mt-1 w-48 rounded-lg border shadow-xl py-1 z-30 text-xs ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                  }`}>
                    {['All', 'Department Change', 'Location Change', 'Designation Change'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setHrProcessFilter(opt);
                          setIsProcessMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition cursor-pointer ${
                          hrProcessFilter === opt
                            ? isDark ? 'bg-teal-950/60 text-teal-300 font-bold' : 'bg-teal-50 text-[#187F7A] font-bold'
                            : isDark ? 'text-gray-300 hover:bg-[#334155]' : 'text-gray-700 hover:bg-slate-100'
                        }`}
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
                className="px-3.5 py-1.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Initiate Process</span>
              </button>
              <button className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400' : 'bg-white border-[#CBD5E1] text-[#5E7174]'
              }`}>
                <FilterTaperedIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* HR Process Table Header */}
          <div className={`rounded-xl border overflow-x-auto shadow-sm min-h-[300px] transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b select-none font-semibold ${
                  isDark ? 'bg-[#0F172A] border-[#334155] text-gray-400' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                }`}>
                  <th className="py-3 px-4 font-semibold w-28">Status</th>
                  <th className="py-3 px-4 font-semibold">Key Field</th>
                  <th className="py-3 px-4 font-semibold">Value</th>
                  <th className="py-3 px-4 font-semibold">Effective date</th>
                  <th className="py-3 px-4 font-semibold">Process</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-[#334155] text-gray-300' : 'divide-[#F1F5F9] text-[#1B2D32]'
              }`}>
                {filteredProcesses.length > 0 ? (
                  filteredProcesses.map((proc) => (
                    <tr key={proc.id} className={`transition ${
                      isDark ? 'hover:bg-[#334155]/40' : 'hover:bg-slate-50'
                    }`}>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            proc.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : proc.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-teal-50 text-[#187F7A] border-teal-200'
                          }`}
                        >
                          {proc.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{proc.key_field}</td>
                      <td className={`py-3 px-4 font-mono text-[11px] font-bold ${isDark ? 'text-teal-300' : 'text-[#187F7A]'}`}>{proc.value}</td>
                      <td className="py-3 px-4 text-gray-400">{proc.effective_date}</td>
                      <td className={`py-3 px-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{proc.process}</td>
                      <td className="py-3 px-4 text-gray-400 italic">{proc.reason}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>

            {/* Empty State with BoxBot Illustration */}
            {filteredProcesses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <BoxBotIllustration isDark={isDark} />
                <p className={`text-sm font-semibold tracking-wide ${isDark ? 'text-gray-300' : 'text-[#475569]'}`}>
                  No records found
                </p>
                <p className={`text-xs max-w-sm text-center ${isDark ? 'text-gray-500' : 'text-[#94A3B8]'}`}>
                  Initiate a department, designation, or location transfer to track workforce restructuring workflows.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 space-y-4 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`font-bold text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                <Plus className="h-4 w-4 text-[#187F7A]" />
                <span>Add Employee</span>
              </h3>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Arun"
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nick Name
                  </label>
                  <input
                    type="text"
                    value={newNickName}
                    onChange={(e) => setNewNickName(e.target.value)}
                    placeholder="e.g. Arun"
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={newEmpCode}
                    onChange={(e) => setNewEmpCode(e.target.value)}
                    placeholder={`e.g. S${employees.length + 21}`}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="arunkumar@cubeai.internal"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Designation
                  </label>
                  <select
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    {designations.map((d) => (
                      <option key={d.id} value={d.title}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  System Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                >
                  <option value="Team member">Team member</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-4 border-t ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                Add Department
              </h3>
              <button
                onClick={() => setIsAddDepartmentOpen(false)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Quality Assurance"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Department Code
                </label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  placeholder="e.g. QA"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mail Alias
                </label>
                <input
                  type="email"
                  value={newDeptAlias}
                  onChange={(e) => setNewDeptAlias(e.target.value)}
                  placeholder="qa@cubeai.internal"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div className={`flex items-center justify-end gap-2 pt-4 border-t ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddDepartmentOpen(false)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                Add Designation
              </h3>
              <button
                onClick={() => setIsAddDesignationOpen(false)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDesignation} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Designation Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDesigName}
                  onChange={(e) => setNewDesigName(e.target.value)}
                  placeholder="e.g. Lead Architect"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Designation Code
                </label>
                <input
                  type="text"
                  value={newDesigCode}
                  onChange={(e) => setNewDesigCode(e.target.value)}
                  placeholder="e.g. LA"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mail Alias
                </label>
                <input
                  type="email"
                  value={newDesigAlias}
                  onChange={(e) => setNewDesigAlias(e.target.value)}
                  placeholder="architects@cubeai.internal"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none font-mono ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>
              <div className={`flex items-center justify-end gap-2 pt-4 border-t ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddDesignationOpen(false)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                Initiate HR Process
              </h3>
              <button
                onClick={() => setIsInitiateProcessOpen(false)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleInitiateProcess} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Process Type
                </label>
                <select
                  data-testid="proc-type-select"
                  value={procType}
                  onChange={(e) => setProcType(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                >
                  <option value="Department Change">Department Change</option>
                  <option value="Location Change">Location Change</option>
                  <option value="Designation Change">Designation Change</option>
                </select>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Employee *
                </label>
                <select
                  data-testid="proc-emp-select"
                  required
                  value={procEmpId}
                  onChange={(e) => setProcEmpId(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
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
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Value / Transfer Target *
                </label>
                <input
                  data-testid="proc-value-input"
                  type="text"
                  required
                  value={procNewValue}
                  onChange={(e) => setProcNewValue(e.target.value)}
                  placeholder="e.g. Engineering -> Management"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Effective Date
                </label>
                <input
                  type="text"
                  value={procEffectiveDate}
                  onChange={(e) => setProcEffectiveDate(e.target.value)}
                  placeholder="01-Dec-2026"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reason / Business Justification
                </label>
                <textarea
                  rows={2}
                  value={procReason}
                  onChange={(e) => setProcReason(e.target.value)}
                  placeholder="e.g. Department reorganization and internal career transition"
                  className={`w-full rounded-lg border p-2.5 focus:outline-none resize-none ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-4 border-t ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsInitiateProcessOpen(false)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  data-testid="proc-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer shadow-sm"
                >
                  Submit Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: IMPORT EMPLOYEES                                                 */}
      {/* ========================================================================= */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 space-y-4 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`font-bold text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                <Upload className="h-4 w-4 text-[#187F7A]" />
                <span>Import Employees (CSV)</span>
              </h3>
              <button
                onClick={() => setIsImportOpen(false)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Paste CSV formatted records below (First Name, Last Name, Email, Department, Designation):
            </p>
            <form onSubmit={handleImportSubmit} className="space-y-3 text-xs">
              <textarea
                rows={5}
                required
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                placeholder="Deepak, Sharma, deepak.s@cubeai.internal, IT, Team Member&#10;Kavita, Rao, kavita.r@cubeai.internal, Management, Administration"
                className={`w-full rounded-lg border p-3 font-mono text-[11px] focus:outline-none resize-none ${
                  isDark ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                }`}
              />
              <div className={`flex items-center justify-between pt-3 border-t ${
                isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'
              }`}>
                <button
                  type="button"
                  onClick={() => setImportCsvText('Rajesh, Iyer, rajesh.i@cubeai.internal, Engineering, Principal Software Engineer\nMeena, Kumari, meena.k@cubeai.internal, HR, Manager')}
                  className={`text-xs font-semibold ${isDark ? 'text-teal-400 hover:underline' : 'text-[#187F7A] hover:underline'}`}
                >
                  Load Sample Data
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportOpen(false)}
                    className={`px-4 py-2 rounded-lg border font-semibold transition cursor-pointer ${
                      isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition cursor-pointer shadow-sm"
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
      {/* DRAWER: 360-DEGREE EMPLOYEE PROFILE DETAIL                                */}
      {/* ========================================================================= */}
      {selectedEmployeeForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md h-full border-l shadow-2xl p-6 overflow-y-auto space-y-6 transition-colors ${
            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-100' : 'bg-white border-[#E2E8F0] text-[#1B2D32]'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3.5">
                <div className={`h-14 w-14 rounded-full border-2 overflow-hidden flex items-center justify-center text-sm font-bold shadow-md ${
                  isDark ? 'border-teal-400 bg-slate-700 text-white' : 'border-[#187F7A] bg-teal-50 text-[#187F7A]'
                }`}>
                  {selectedEmployeeForDetail.photo ? (
                    <img src={selectedEmployeeForDetail.photo} alt={selectedEmployeeForDetail.first_name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{selectedEmployeeForDetail.first_name.charAt(0)}{selectedEmployeeForDetail.last_name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                    {selectedEmployeeForDetail.first_name} {selectedEmployeeForDetail.last_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`font-mono text-xs font-bold ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>
                      {selectedEmployeeForDetail.employee_code}
                    </span>
                    <span className="text-gray-400">&bull;</span>
                    <span className="text-xs text-emerald-500 font-bold">{selectedEmployeeForDetail.employment_status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForDetail(null)}
                className="text-gray-400 hover:opacity-80 p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Information Cards */}
            <div className="space-y-4 text-xs">
              <div className={`rounded-xl p-4 border space-y-2.5 ${
                isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-[#E2E8F0]'
              }`}>
                <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 ${
                  isDark ? 'text-teal-300' : 'text-[#187F7A]'
                }`}>
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Employment Details</span>
                </h4>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">Department</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{selectedEmployeeForDetail.department}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">Designation</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{selectedEmployeeForDetail.designation}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">System Role</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{selectedEmployeeForDetail.role}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">Joining Date</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>{selectedEmployeeForDetail.joining_date}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Work Email</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-teal-300' : 'text-[#187F7A]'}`}>
                    {selectedEmployeeForDetail.work_email}
                  </span>
                </div>
              </div>

              {/* Sensitive Compliance Data with Toggle */}
              <div className={`rounded-xl p-4 border space-y-2.5 ${
                isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-slate-50 border-[#E2E8F0]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-emerald-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Compliance &amp; Bank Info</span>
                  </h4>
                  <button
                    onClick={() => setRevealSensitive(!revealSensitive)}
                    className={`flex items-center gap-1 text-[11px] font-bold ${
                      isDark ? 'text-teal-400 hover:underline' : 'text-[#187F7A] hover:underline'
                    }`}
                  >
                    {revealSensitive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{revealSensitive ? 'Mask' : 'Reveal'}</span>
                  </button>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">PAN Number</span>
                  <span className="font-mono font-bold">
                    {revealSensitive ? (selectedEmployeeForDetail.pan_number || 'ABCDE1234F') : 'ABCDE****F'}
                  </span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
                  <span className="text-gray-400 font-medium">Aadhaar Card</span>
                  <span className="font-mono font-bold">
                    {revealSensitive ? (selectedEmployeeForDetail.aadhaar_masked || 'XXXX-XXXX-9012') : 'XXXX-XXXX-****'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Bank Account</span>
                  <span className="font-mono font-bold">
                    {revealSensitive ? (selectedEmployeeForDetail.bank_account || '50100234567890') : '50100*******90'}
                  </span>
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
                  className="flex-1 py-2.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold transition text-center shadow-md cursor-pointer"
                >
                  Open Operations Panel
                </button>
                <button
                  onClick={() => setSelectedEmployeeForDetail(null)}
                  className={`px-4 py-2.5 rounded-lg border font-semibold transition cursor-pointer ${
                    isDark ? 'bg-[#0F172A] border-[#334155] text-gray-300 hover:text-white' : 'bg-slate-100 border-[#CBD5E1] text-gray-700 hover:bg-slate-200'
                  }`}
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
