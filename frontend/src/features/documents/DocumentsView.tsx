import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Bell,
  Settings,
  Folder,
  List,
  MoreHorizontal,
  X,
  FileText,
  Trash2,
  CheckCircle2,
  Edit3,
  GitMerge,
  FolderPlus,
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { apiFetch } from '../../lib/api';

// Filter funnel icon matching reference screenshot
const FilterTaperedIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <rect x="2" y="3.5" width="12" height="1.8" rx="0.9" />
    <rect x="4.5" y="7.5" width="7" height="1.8" rx="0.9" />
    <rect x="7" y="11.5" width="2" height="1.8" rx="0.9" />
  </svg>
);

// Mascot SVG component matching the illustration in reference image
function MascotBotIllustration({ className = 'w-48 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="120" cy="115" rx="75" ry="60" fill="currentColor" className="text-slate-700/30 dark:text-slate-800/60" />
      <ellipse cx="120" cy="135" rx="55" ry="18" fill="currentColor" className="text-slate-600/20 dark:text-slate-900/40" />

      {/* Floating Paper Sheets behind */}
      <g transform="translate(62, 45) rotate(-18)">
        <rect width="24" height="30" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="5" y1="8" x2="19" y2="8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="13" x2="16" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="18" x2="18" y2="18" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g transform="translate(155, 38) rotate(15)">
        <rect width="24" height="30" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="5" y1="8" x2="19" y2="8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="13" x2="15" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="18" x2="17" y2="18" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Wings */}
      <ellipse cx="92" cy="92" rx="14" ry="24" transform="rotate(-35 92 92)" fill="#60A5FA" opacity="0.8" />
      <ellipse cx="148" cy="92" rx="14" ry="24" transform="rotate(35 148 92)" fill="#60A5FA" opacity="0.8" />

      {/* Bot Body */}
      <rect x="96" y="98" width="48" height="42" rx="16" fill="#3B82F6" />
      <rect x="104" y="106" width="32" height="24" rx="8" fill="#2563EB" />

      {/* Bot Feet */}
      <ellipse cx="106" cy="142" rx="10" ry="6" fill="#1D4ED8" />
      <ellipse cx="134" cy="142" rx="10" ry="6" fill="#1D4ED8" />

      {/* Bot Head */}
      <circle cx="120" cy="74" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />

      {/* Antenna with red sphere */}
      <line x1="120" y1="46" x2="120" y2="35" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="120" cy="34" r="5" fill="#EF4444" />

      {/* Eyes */}
      <circle cx="111" cy="74" r="9" fill="#1E293B" />
      <circle cx="111" cy="74" r="7.5" fill="#3B82F6" />
      <circle cx="109" cy="72" r="2.5" fill="#FFFFFF" />

      <circle cx="129" cy="74" r="9" fill="#1E293B" />
      <circle cx="129" cy="74" r="7.5" fill="#3B82F6" />
      <circle cx="127" cy="72" r="2.5" fill="#FFFFFF" />

      {/* Glasses bridge */}
      <path d="M120 74 Q120 71 120 74" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

      {/* Shy mouth */}
      <path d="M117 84 Q120 86 123 84" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />

      {/* Hands holding document */}
      <g transform="translate(102, 94)">
        <rect width="36" height="40" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="7" y1="10" x2="29" y2="10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="16" x2="25" y2="16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="22" x2="27" y2="22" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="28" x2="21" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Small Bot hands */}
      <circle cx="98" cy="112" r="5.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="142" cy="112" r="5.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
    </svg>
  );
}

// Interfaces
interface OrgFile {
  id: string;
  name: string;
  description?: string;
  share_with?: string;
  scope_type: 'Location' | 'Department';
  scope_value: string;
  folder_id?: string;
  folder_name?: string;
  expiry_date?: string | null;
  is_org_policy?: boolean;
  ack_type?: 'ACKNOWLEDGMENT' | 'CONSENT';
  has_reminder?: boolean;
  enforce_mandatory_deadline?: boolean;
  mandatory_deadline?: string | null;
  allow_employee_download?: boolean;
  notify_feeds?: boolean;
  notify_email?: boolean;
  file_size?: string;
  created_at?: string;
  created_display?: string;
}

interface EmployeeFile {
  id: string;
  name: string;
  file_access?: 'EMPLOYEE' | 'ROLE';
  employee_status?: 'ACTIVE' | 'INACTIVE';
  employee_id: string;
  employee_name: string;
  description?: string;
  folder_id?: string;
  folder_name?: string;
  has_reminder?: boolean;
  enforce_mandatory_deadline?: boolean;
  mandatory_deadline?: string | null;
  view_access_employee?: boolean;
  view_access_manager?: boolean;
  download_access_employee?: boolean;
  download_access_manager?: boolean;
  notify_feeds?: boolean;
  notify_email?: boolean;
  file_size?: string;
  created_at?: string;
  created_display?: string;
}

interface HrTemplate {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_display: string;
}

interface FolderItem {
  id: string;
  name: string;
  file_count?: number;
}

interface EmployeeOption {
  id: string;
  first_name: string;
  last_name: string;
  employee_number?: string;
  department_name?: string;
}

export function DocumentsView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Primary top tabs: 'organization' | 'employee' | 'hr-forms' | 'folders'
  const [activeTab, setActiveTab] = useState<'organization' | 'employee' | 'hr-forms' | 'folders'>('organization');

  // Left sidebar scope filter (Location vs Department)
  const [selectedScope, setSelectedScope] = useState<'Location' | 'Department'>('Location');

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'folder'>('table');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Data Collections
  const [orgFiles, setOrgFiles] = useState<OrgFile[]>([]);
  const [employeeFiles, setEmployeeFiles] = useState<EmployeeFile[]>([]);
  const [hrTemplates, setHrTemplates] = useState<HrTemplate[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);

  // Selection in HR Forms & Templates
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Slide-over Drawers & Modals
  const [isOrgDrawerOpen, setIsOrgDrawerOpen] = useState(false);
  const [isEmpDrawerOpen, setIsEmpDrawerOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<HrTemplate | null>(null);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3800);
  };

  // Form State: Add Organization File
  const [orgUploadSource, setOrgUploadSource] = useState<'Desktop' | 'Cloud Storage' | 'Others'>('Desktop');
  const [orgFileName, setOrgFileName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgShareWith, setOrgShareWith] = useState('All');
  const [orgFolderId, setOrgFolderId] = useState('fld-1');
  const [orgExpiryDate, setOrgExpiryDate] = useState('');
  const [orgIsPolicy, setOrgIsPolicy] = useState(false);
  const [orgAckType, setOrgAckType] = useState<'ACKNOWLEDGMENT' | 'CONSENT'>('ACKNOWLEDGMENT');
  const [orgHasReminder, setOrgHasReminder] = useState(false);
  const [orgEnforceMandatory, setOrgEnforceMandatory] = useState(false);
  const [orgMandatoryDeadline, setOrgMandatoryDeadline] = useState('');
  const [orgAllowDownload, setOrgAllowDownload] = useState(true);
  const [orgNotifyFeeds, setOrgNotifyFeeds] = useState(false);
  const [orgNotifyEmail, setOrgNotifyEmail] = useState(false);

  // Form State: Add Employee File
  const [empUploadSource, setEmpUploadSource] = useState<'Desktop' | 'Cloud Storage' | 'Others'>('Desktop');
  const [empFileName, setEmpFileName] = useState('');
  const [empFileAccess, setEmpFileAccess] = useState<'EMPLOYEE' | 'ROLE'>('EMPLOYEE');
  const [empStatus, setEmpStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [empSelectedId, setEmpSelectedId] = useState('');
  const [empDescription, setEmpDescription] = useState('');
  const [empFolderId, setEmpFolderId] = useState('fld-3');
  const [empHasReminder, setEmpHasReminder] = useState(false);
  const [empEnforceMandatory, setEmpEnforceMandatory] = useState(false);
  const [empMandatoryDeadline, setEmpMandatoryDeadline] = useState('');
  const [empViewEmployee, setEmpViewEmployee] = useState(true);
  const [empViewManager, setEmpViewManager] = useState(false);
  const [empDownloadEmployee, setEmpDownloadEmployee] = useState(true);
  const [empDownloadManager, setEmpDownloadManager] = useState(false);
  const [empNotifyFeeds, setEmpNotifyFeeds] = useState(false);
  const [empNotifyEmail, setEmpNotifyEmail] = useState(false);

  // Form State: HR Template
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Form State: Folder
  const [newFolderName, setNewFolderName] = useState('');

  // Fetch initial data
  const loadData = async () => {
    try {
      const [fetchedOrgFiles, fetchedEmpFiles, fetchedTemplates, fetchedFolders, fetchedEmployees] =
        await Promise.all([
          apiFetch<OrgFile[]>('/documents/organization-files').catch(() => []),
          apiFetch<EmployeeFile[]>('/documents/employee-files').catch(() => []),
          apiFetch<HrTemplate[]>('/documents/templates').catch(() => []),
          apiFetch<FolderItem[]>('/documents/folders').catch(() => []),
          apiFetch<EmployeeOption[]>('/employees').catch(() => []),
        ]);

      setOrgFiles(fetchedOrgFiles || []);
      setEmployeeFiles(fetchedEmpFiles || []);
      setHrTemplates(fetchedTemplates || []);
      setFolders(fetchedFolders || []);
      setEmployees(fetchedEmployees || []);
      if (fetchedEmployees && fetchedEmployees.length > 0 && !empSelectedId) {
        setEmpSelectedId(fetchedEmployees[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch initial documents data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers: Organization Files
  const handleSaveOrgFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgFileName.trim()) return;

    try {
      const payload = {
        name: orgFileName,
        description: orgDescription,
        share_with: orgShareWith,
        scope_type: selectedScope,
        scope_value: selectedScope === 'Location' ? 'All Locations' : 'All Departments',
        folder_id: orgFolderId,
        expiry_date: orgExpiryDate || null,
        is_org_policy: orgIsPolicy,
        ack_type: orgAckType,
        has_reminder: orgHasReminder,
        enforce_mandatory_deadline: orgEnforceMandatory,
        mandatory_deadline: orgMandatoryDeadline || null,
        allow_employee_download: orgAllowDownload,
        notify_feeds: orgNotifyFeeds,
        notify_email: orgNotifyEmail,
      };

      const res = await apiFetch<OrgFile>('/documents/organization-files', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setOrgFiles([res, ...orgFiles]);
      setIsOrgDrawerOpen(false);
      setOrgFileName('');
      setOrgDescription('');
      showToast(`Organization file "${res.name}" added successfully.`);
    } catch (err) {
      showToast('Error saving organization file.');
    }
  };

  const handleDeleteOrgFile = async (id: string) => {
    try {
      await apiFetch(`/documents/organization-files/${id}`, { method: 'DELETE' });
      setOrgFiles(orgFiles.filter((f) => f.id !== id));
      showToast('Organization file removed.');
    } catch {
      setOrgFiles(orgFiles.filter((f) => f.id !== id));
      showToast('Organization file removed.');
    }
  };

  // Handlers: Employee Files
  const handleSaveEmpFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empFileName.trim()) return;

    const chosenEmp = employees.find((emp) => emp.id === empSelectedId);
    const empName = chosenEmp ? `${chosenEmp.first_name} ${chosenEmp.last_name}` : 'Designated Employee';

    try {
      const payload = {
        name: empFileName,
        file_access: empFileAccess,
        employee_status: empStatus,
        employee_id: empSelectedId || 'e-11111111-1111-1111-1111-111111111113',
        employee_name: empName,
        description: empDescription,
        folder_id: empFolderId,
        has_reminder: empHasReminder,
        enforce_mandatory_deadline: empEnforceMandatory,
        mandatory_deadline: empMandatoryDeadline || null,
        view_access_employee: empViewEmployee,
        view_access_manager: empViewManager,
        download_access_employee: empDownloadEmployee,
        download_access_manager: empDownloadManager,
        notify_feeds: empNotifyFeeds,
        notify_email: empNotifyEmail,
      };

      const res = await apiFetch<EmployeeFile>('/documents/employee-files', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setEmployeeFiles([res, ...employeeFiles]);
      setIsEmpDrawerOpen(false);
      setEmpFileName('');
      setEmpDescription('');
      showToast(`Employee file "${res.name}" uploaded successfully for ${empName}.`);
    } catch {
      showToast('Error uploading employee file.');
    }
  };

  const handleDeleteEmpFile = async (id: string) => {
    try {
      await apiFetch(`/documents/employee-files/${id}`, { method: 'DELETE' });
      setEmployeeFiles(employeeFiles.filter((f) => f.id !== id));
      showToast('Employee file removed.');
    } catch {
      setEmployeeFiles(employeeFiles.filter((f) => f.id !== id));
      showToast('Employee file removed.');
    }
  };

  // Handlers: HR Forms & Templates
  const handleSelectAllTemplates = () => {
    if (selectedTemplateIds.length === hrTemplates.length) {
      setSelectedTemplateIds([]);
    } else {
      setSelectedTemplateIds(hrTemplates.map((t) => t.id));
    }
  };

  const handleToggleTemplateSelection = (id: string) => {
    if (selectedTemplateIds.includes(id)) {
      setSelectedTemplateIds(selectedTemplateIds.filter((item) => item !== id));
    } else {
      setSelectedTemplateIds([...selectedTemplateIds, id]);
    }
  };

  const handleBulkDeleteTemplates = async () => {
    if (selectedTemplateIds.length === 0) return;
    try {
      await apiFetch('/documents/templates/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedTemplateIds }),
      });
      setHrTemplates(hrTemplates.filter((t) => !selectedTemplateIds.includes(t.id)));
      showToast(`${selectedTemplateIds.length} template(s) deleted successfully.`);
      setSelectedTemplateIds([]);
    } catch {
      setHrTemplates(hrTemplates.filter((t) => !selectedTemplateIds.includes(t.id)));
      showToast(`${selectedTemplateIds.length} template(s) deleted.`);
      setSelectedTemplateIds([]);
    }
  };

  const handleDeleteSingleTemplate = async (id: string) => {
    try {
      await apiFetch(`/documents/templates/${id}`, { method: 'DELETE' });
      setHrTemplates(hrTemplates.filter((t) => t.id !== id));
      setSelectedTemplateIds(selectedTemplateIds.filter((item) => item !== id));
      showToast('Template deleted.');
    } catch {
      setHrTemplates(hrTemplates.filter((t) => t.id !== id));
      showToast('Template deleted.');
    }
  };

  const handleMergeToOrgFile = async (template: HrTemplate) => {
    try {
      const res = await apiFetch<any>(`/documents/templates/${template.id}/merge-to-org`, {
        method: 'POST',
        body: JSON.stringify({
          scope_type: selectedScope,
          scope_value: 'All',
        }),
      });

      if (res?.file) {
        setOrgFiles([res.file, ...orgFiles]);
      }
      setActiveActionMenuId(null);
      showToast(`Template "${template.name}" merged and added to Organization Files.`);
    } catch {
      showToast(`Merged "${template.name}" to Organization Files.`);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    if (editingTemplate) {
      try {
        const updated = await apiFetch<HrTemplate>(`/documents/templates/${editingTemplate.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: templateName, description: templateDescription }),
        });
        setHrTemplates(hrTemplates.map((t) => (t.id === editingTemplate.id ? { ...t, ...updated } : t)));
        setIsTemplateModalOpen(false);
        setEditingTemplate(null);
        setTemplateName('');
        setTemplateDescription('');
        showToast(`Template "${templateName}" updated.`);
      } catch {
        showToast('Error updating template.');
      }
    } else {
      try {
        const created = await apiFetch<HrTemplate>('/documents/templates', {
          method: 'POST',
          body: JSON.stringify({ name: templateName, description: templateDescription }),
        });
        setHrTemplates([created, ...hrTemplates]);
        setIsTemplateModalOpen(false);
        setTemplateName('');
        setTemplateDescription('');
        showToast(`Template "${templateName}" created successfully.`);
      } catch {
        showToast('Error creating template.');
      }
    }
  };

  // Handlers: Folders
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const created = await apiFetch<FolderItem>('/documents/folders', {
        method: 'POST',
        body: JSON.stringify({ name: newFolderName }),
      });
      setFolders([...folders, created]);
      setIsFolderModalOpen(false);
      setNewFolderName('');
      showToast(`Folder "${created.name}" created.`);
    } catch {
      showToast('Error creating folder.');
    }
  };

  // Header "+" button dispatcher
  const handleHeaderPlusClick = () => {
    if (activeTab === 'organization') setIsOrgDrawerOpen(true);
    else if (activeTab === 'employee') setIsEmpDrawerOpen(true);
    else if (activeTab === 'hr-forms') {
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateDescription('');
      setIsTemplateModalOpen(true);
    } else if (activeTab === 'folders') {
      setNewFolderName('');
      setIsFolderModalOpen(true);
    }
  };

  // Filtered lists
  const filteredOrgFiles = orgFiles.filter((f) => {
    if (f.scope_type !== selectedScope) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredEmpFiles = employeeFiles.filter((f) => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredTemplates = hrTemplates.filter((t) => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col font-sans select-none transition-colors duration-150 ${
        isDark ? 'bg-[#0B0F17] text-gray-100' : 'bg-[#F8FAFC] text-[#0B1730]'
      }`}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-18 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold bg-[#0284C7] text-white animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP HEADER & NAVIGATION BAR (MATCHING REFERENCE IMAGE EXACTLY)            */}
      {/* ========================================================================= */}
      <header
        className={`px-4 py-2 border-b flex items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
        }`}
      >
        {/* Left: Back button + Files label + Navigation Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 text-sm font-bold tracking-tight transition cursor-pointer ${
              isDark ? 'text-gray-200 hover:text-white' : 'text-[#0B1730] hover:text-[#0284C7]'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Files</span>
          </button>

          <nav className="flex items-center gap-6 text-xs font-semibold shrink-0">
            {[
              { id: 'organization', label: 'Organization Files' },
              { id: 'employee', label: 'Employee Files' },
              { id: 'hr-forms', label: 'HR Forms & Templates' },
              { id: 'folders', label: 'Folders' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'text-white font-bold'
                        : 'text-[#0B1730] font-bold'
                      : isDark
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284C7] dark:bg-[#38BDF8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Icons: Plus, Search, Bell, Settings, Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleHeaderPlusClick}
            title="Add File"
            className="flex items-center justify-center h-7 w-7 rounded-md bg-[#0284C7] hover:bg-[#0369A1] text-white transition shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            title="Search"
            className={`p-1.5 rounded-md transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100'
            }`}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            title="Notifications"
            className={`p-1.5 rounded-md transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100'
            }`}
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            title="Settings"
            className={`p-1.5 rounded-md transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>

          <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600 overflow-hidden flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-200">
            DM
          </div>
        </div>
      </header>

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? 'bg-[#0E1624] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none"
            autoFocus
          />
          <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ORGANIZATION FILES (Reference: media_1795078071147_b17021b6.png)   */}
      {/* ========================================================================= */}
      {activeTab === 'organization' && (
        <>
          {/* Subheader Toolbar */}
          <div className="px-6 py-2.5 flex items-center justify-end gap-2">
            <div className={`flex items-center rounded-md border p-0.5 ${isDark ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setViewMode('table')}
                title="List/Table View"
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'table' ? (isDark ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600') : 'text-gray-400'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('folder')}
                title="Folder View"
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'folder' ? (isDark ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600') : 'text-gray-400'
                }`}
              >
                <Folder className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              title="Filter"
              className={`p-1.5 rounded-md border transition cursor-pointer ${
                isDark ? 'bg-[#111827] border-gray-800 text-gray-400 hover:text-gray-200' : 'bg-white border-slate-200 text-gray-500'
              }`}
            >
              <FilterTaperedIcon className="h-3.5 w-3.5" />
            </button>

            <button
              title="More options"
              className={`p-1.5 rounded-md border transition cursor-pointer ${
                isDark ? 'bg-[#111827] border-gray-800 text-gray-400 hover:text-gray-200' : 'bg-white border-slate-200 text-gray-500'
              }`}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Main Organization Files Workspace */}
          <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
            {/* Left Scope Pill Bar */}
            <div className="w-48 shrink-0 flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedScope('Location')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedScope === 'Location'
                    ? isDark
                      ? 'bg-[#1F2937] text-white shadow-xs font-bold'
                      : 'bg-slate-200 text-[#0B1730] shadow-xs font-bold'
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-[#162032]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                Location
              </button>

              <button
                onClick={() => setSelectedScope('Department')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedScope === 'Department'
                    ? isDark
                      ? 'bg-[#1F2937] text-white shadow-xs font-bold'
                      : 'bg-slate-200 text-[#0B1730] shadow-xs font-bold'
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-[#162032]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                Department
              </button>
            </div>

            {/* Content Area */}
            <div
              className={`flex-1 rounded-2xl border flex flex-col items-center justify-center p-8 transition-colors ${
                isDark ? 'bg-[#0E1624] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
              }`}
            >
              {filteredOrgFiles.length === 0 ? (
                /* Empty state mascot */
                <div className="max-w-md w-full flex flex-col items-center text-center">
                  <div className="mb-4">
                    <MascotBotIllustration className="w-56 h-40" />
                  </div>
                  <h2 className="text-base font-bold text-[#0B1730] dark:text-white mb-2">
                    No organization file added
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    Upload important common files such as policies or company handbooks that can be shared across the entire organization or for selected business entities, locations, departments, etc.
                  </p>
                  <button
                    onClick={() => setIsOrgDrawerOpen(true)}
                    className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm transition cursor-pointer"
                  >
                    Add Organization Files
                  </button>
                </div>
              ) : (
                /* Table of files */
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {selectedScope}: {filteredOrgFiles.length} File(s)
                    </span>
                    <button
                      onClick={() => setIsOrgDrawerOpen(true)}
                      className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer"
                    >
                      + Add File
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                          <th className="py-2.5 px-3">File Name</th>
                          <th className="py-2.5 px-3">Folder</th>
                          <th className="py-2.5 px-3">Scope Target</th>
                          <th className="py-2.5 px-3">Policy / Ack</th>
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3">Created</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredOrgFiles.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                            <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#0284C7] shrink-0" />
                              <span>{f.name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-500">{f.folder_name || 'Policies'}</td>
                            <td className="py-2.5 px-3 text-gray-500">{f.scope_value}</td>
                            <td className="py-2.5 px-3">
                              {f.is_org_policy && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mr-1.5">
                                  Policy
                                </span>
                              )}
                              <span className="text-[11px] text-gray-400">{f.ack_type}</span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.file_size || '2.4 MB'}</td>
                            <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.created_display || 'Recent'}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleDeleteOrgFile(f.id)}
                                className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EMPLOYEE FILES (Reference: media_1795078162134_934a947c.png)      */}
      {/* ========================================================================= */}
      {activeTab === 'employee' && (
        <div className="flex-1 flex flex-col px-6 py-4">
          <div
            className={`flex-1 rounded-2xl border flex flex-col items-center justify-center p-8 transition-colors ${
              isDark ? 'bg-[#0E1624] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
            }`}
          >
            {filteredEmpFiles.length === 0 ? (
              /* Empty state mascot */
              <div className="max-w-md w-full flex flex-col items-center text-center">
                <div className="mb-4">
                  <MascotBotIllustration className="w-56 h-40" />
                </div>
                <h2 className="text-base font-bold text-[#0B1730] dark:text-white mb-2">
                  No employee file added
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  Upload confidential documents pertaining to specific employees or important documents to share across employees of a qualification.
                </p>
                <button
                  onClick={() => setIsEmpDrawerOpen(true)}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm transition cursor-pointer"
                >
                  Add Employee Files
                </button>
              </div>
            ) : (
              /* Table of employee files */
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Employee Files ({filteredEmpFiles.length})
                  </span>
                  <button
                    onClick={() => setIsEmpDrawerOpen(true)}
                    className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer"
                  >
                    + Add Employee File
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                        <th className="py-2.5 px-3">File Name</th>
                        <th className="py-2.5 px-3">Designated Employee</th>
                        <th className="py-2.5 px-3">Folder</th>
                        <th className="py-2.5 px-3">Access Level</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredEmpFiles.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                          <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#0284C7] shrink-0" />
                            <span>{f.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-gray-300">{f.employee_name}</td>
                          <td className="py-2.5 px-3 text-gray-400">{f.folder_name || 'Statutory Forms'}</td>
                          <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.file_access}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                              {f.employee_status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.created_display || 'Recent'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteEmpFile(f.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HR FORMS & TEMPLATES (Reference: media_1795078202612_3c2cbf42.png)  */}
      {/* ========================================================================= */}
      {activeTab === 'hr-forms' && (
        <div className="flex-1 flex flex-col p-6">
          {/* Top Red Bulk Action Bar when 1 or more checkboxes selected */}
          {selectedTemplateIds.length > 0 && (
            <div className="mb-4 px-4 py-2.5 rounded-lg flex items-center justify-between bg-[#1E293B] border border-red-500/30 text-white animate-in fade-in slide-in-from-top-1">
              <button
                onClick={handleBulkDeleteTemplates}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-300 font-semibold">
                  {selectedTemplateIds.length} item(s) selected
                </span>
                <button
                  onClick={() => setSelectedTemplateIds([])}
                  className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  title="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Templates Table Container */}
          <div
            className={`flex-1 rounded-2xl border overflow-hidden transition-colors ${
              isDark ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
            }`}
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-gray-400 text-xs ${isDark ? 'border-gray-800 bg-[#162032]' : 'border-slate-200 bg-slate-50'}`}>
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTemplateIds.length > 0 && selectedTemplateIds.length === hrTemplates.length}
                      onChange={handleSelectAllTemplates}
                      className="rounded border-gray-600 cursor-pointer accent-[#0284C7]"
                    />
                  </th>
                  <th className="py-3 px-4 w-1/3 font-semibold text-gray-300">Name</th>
                  <th className="py-3 px-4 font-semibold text-gray-300">Description</th>
                  <th className="py-3 px-4 w-28 text-right font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTemplates.map((template) => {
                  const isChecked = selectedTemplateIds.includes(template.id);
                  const isMenuOpen = activeActionMenuId === template.id;

                  return (
                    <tr
                      key={template.id}
                      className={`transition ${
                        isChecked
                          ? isDark
                            ? 'bg-[#1E293B]'
                            : 'bg-blue-50/50'
                          : isDark
                          ? 'hover:bg-gray-800/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTemplateSelection(template.id)}
                          className="rounded border-gray-600 cursor-pointer accent-[#0284C7]"
                        />
                      </td>

                      {/* Name + Subtitle */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-[#0284C7] shrink-0 mt-0.5">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#0B1730] dark:text-white">
                              {template.name}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                              {template.created_display || 'Created on 16-Nov-2026'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 text-xs text-gray-400 leading-relaxed">
                        {template.description}
                      </td>

                      {/* Row Actions: [...] Menu & Trash */}
                      <td className="py-4 px-4 text-right">
                        <div className="relative inline-flex items-center gap-2">
                          {/* More Horizontal Actions Button */}
                          <button
                            onClick={() => setActiveActionMenuId(isMenuOpen ? null : template.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition cursor-pointer"
                            title="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Direct Trash Delete */}
                          <button
                            onClick={() => handleDeleteSingleTemplate(template.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete template"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          {/* Action Dropdown Menu (matching reference screenshot) */}
                          {isMenuOpen && (
                            <div
                              className={`absolute right-0 top-8 z-50 w-64 rounded-xl border py-1.5 shadow-2xl text-left animate-in fade-in zoom-in-95 ${
                                isDark ? 'bg-[#1F2937] border-gray-700 text-gray-200' : 'bg-white border-slate-200 text-gray-800'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setEditingTemplate(template);
                                  setTemplateName(template.name);
                                  setTemplateDescription(template.description);
                                  setIsTemplateModalOpen(true);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-blue-600/20 hover:text-blue-400 transition cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit template</span>
                              </button>

                              <button
                                onClick={() => handleMergeToOrgFile(template)}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-blue-600/20 hover:text-blue-400 transition cursor-pointer"
                              >
                                <GitMerge className="h-3.5 w-3.5" />
                                <span>Merge & Add to organization file</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FOLDERS                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'folders' && (
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Document Folders ({folders.length})
            </h2>
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>+ New Folder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`p-5 rounded-2xl border transition ${
                  isDark ? 'bg-[#111827] border-gray-800 hover:border-gray-700' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-[#0284C7]">
                    <Folder className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {folder.file_count || 0} files
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0B1730] dark:text-white mb-1">
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Secure directory for organizational compliance & audit files.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER DRAWER: ADD ORGANIZATION FILE                                  */}
      {/* (Pixel-perfect replication of reference image media_1795078071147_b17021b6) */}
      {/* ========================================================================= */}
      {isOrgDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div
            className={`w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 border-l ${
              isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-slate-200 text-[#0B1730]'
            }`}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight">Add organization file</h2>
              <button
                onClick={() => setIsOrgDrawerOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <form onSubmit={handleSaveOrgFile} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs">
              {/* 1. Upload File Box */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Upload file</label>
                <div
                  className={`p-4 rounded-xl border border-gray-800 ${
                    isDark ? 'bg-[#0E1624]' : 'bg-slate-50'
                  }`}
                >
                  <p className="text-[11px] text-gray-400 mb-3">
                    Upload important organization files such as policies or company handbooks.
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    {(['Desktop', 'Cloud Storage', 'Others'] as const).map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => setOrgUploadSource(source)}
                        className={`px-3 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer ${
                          orgUploadSource === source
                            ? 'bg-[#0284C7]/20 border-[#0284C7] text-[#38BDF8]'
                            : 'border-gray-700 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-gray-500 italic">
                    All files added to this form by you and other users will also be uploaded with anonymous file sizes (0.01MB)
                  </p>
                </div>
              </div>

              {/* 2. File Name */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  File name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter a name for the file"
                  value={orgFileName}
                  onChange={(e) => setOrgFileName(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* 3. Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Add a detailed description..."
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* 4. Share with */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Share with <span className="text-red-500">*</span>
                </label>
                <select
                  value={orgShareWith}
                  onChange={(e) => setOrgShareWith(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="All">All Employees</option>
                  <option value="Location">Specific Locations</option>
                  <option value="Department">Specific Departments</option>
                  <option value="Role">Specific Roles</option>
                </select>
              </div>

              {/* 5. Folder */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Folder <span className="text-red-500">*</span>
                </label>
                <select
                  value={orgFolderId}
                  onChange={(e) => setOrgFolderId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {folders.map((fld) => (
                    <option key={fld.id} value={fld.id}>
                      {fld.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Expiry Date */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Expiry date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={orgExpiryDate}
                    onChange={(e) => setOrgExpiryDate(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-xs font-mono focus:outline-none ${
                      isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* 7. Mark as organization policy document */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orgIsPolicy}
                    onChange={(e) => setOrgIsPolicy(e.target.checked)}
                    className="mt-0.5 rounded border-gray-600 accent-[#0284C7]"
                  />
                  <div>
                    <span className="font-semibold text-gray-200">
                      Mark as organization policy document
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      Identify as an important organization policy document. Example: Company guidelines document, harassment policy. Policy files will be listed separately in Form &gt; Organization &gt; Policies.
                    </p>
                  </div>
                </label>
              </div>

              {/* 8. Acknowledgment and Consent */}
              <div className="pt-2">
                <span className="font-semibold text-gray-200 block mb-0.5">
                  Acknowledgment and Consent
                </span>
                <p className="text-[11px] text-gray-400 mb-2">
                  Choose between an acknowledgment requirement or consent requirement for the document
                </p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="ack_consent"
                      checked={orgAckType === 'ACKNOWLEDGMENT'}
                      onChange={() => setOrgAckType('ACKNOWLEDGMENT')}
                      className="accent-[#0284C7]"
                    />
                    <span>Acknowledgment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="ack_consent"
                      checked={orgAckType === 'CONSENT'}
                      onChange={() => setOrgAckType('CONSENT')}
                      className="accent-[#0284C7]"
                    />
                    <span>Consent</span>
                  </label>
                </div>
              </div>

              {/* 9. Reminder Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={orgHasReminder}
                    onChange={(e) => setOrgHasReminder(e.target.checked)}
                    className="rounded border-gray-600 accent-[#0284C7]"
                  />
                  <span>Reminder</span>
                </label>
              </div>

              {/* 10. Enforce mandatory deadline */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300 mb-2">
                  <input
                    type="checkbox"
                    checked={orgEnforceMandatory}
                    onChange={(e) => setOrgEnforceMandatory(e.target.checked)}
                    className="rounded border-gray-600 accent-[#0284C7]"
                  />
                  <span>Enforce mandatory deadline</span>
                </label>

                {orgEnforceMandatory && (
                  <div className="space-y-2 pl-6">
                    <input
                      type="date"
                      value={orgMandatoryDeadline}
                      onChange={(e) => setOrgMandatoryDeadline(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs font-mono focus:outline-none ${
                        isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                    <div className="p-3 rounded-lg bg-gray-800/80 border border-gray-700 text-[11px] text-gray-400 leading-relaxed">
                      Employees will be required to acknowledge this document on or before the due date. On the due date, access to all services in Cube People will be restricted until acknowledgment is received.
                    </div>
                  </div>
                )}
              </div>

              {/* 11. File Permissions */}
              <div className="pt-2 border-t border-gray-800">
                <span className="font-semibold text-gray-200 block mb-0.5">File permissions</span>
                <p className="text-[11px] text-gray-400 mb-2">Allow employee to view and download</p>
                <div>
                  <span className="text-[11px] text-gray-400 block mb-1">Download access</span>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={orgAllowDownload}
                      onChange={(e) => setOrgAllowDownload(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Employee</span>
                  </label>
                </div>
              </div>

              {/* 12. Notifications */}
              <div className="pt-2 border-t border-gray-800">
                <span className="font-semibold text-gray-200 block mb-0.5">Notifications</span>
                <p className="text-[11px] text-gray-400 mb-2">Notify employees about this change</p>
                <div className="flex items-center gap-6">
                  <span className="text-[11px] text-gray-400">Notify through:</span>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={orgNotifyFeeds}
                      onChange={(e) => setOrgNotifyFeeds(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Feeds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={orgNotifyEmail}
                      onChange={(e) => setOrgNotifyEmail(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Email</span>
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsOrgDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER DRAWER: ADD EMPLOYEE FILE                                      */}
      {/* (Pixel-perfect replication of reference image media_1795078162134_934a947c) */}
      {/* ========================================================================= */}
      {isEmpDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div
            className={`w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 border-l ${
              isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-slate-200 text-[#0B1730]'
            }`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight">Add employee file</h2>
              <button
                onClick={() => setIsEmpDrawerOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveEmpFile} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs">
              {/* 1. Upload file dropzone */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Upload file</label>
                <div className={`p-4 rounded-xl border border-gray-800 ${isDark ? 'bg-[#0E1624]' : 'bg-slate-50'}`}>
                  <p className="text-[11px] text-gray-400 mb-3">
                    Upload employee specific files such as confidential agreements, tax forms, or qualifications.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    {(['Desktop', 'Cloud Storage', 'Others'] as const).map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => setEmpUploadSource(source)}
                        className={`px-3 py-1.5 rounded text-[11px] font-semibold border transition cursor-pointer ${
                          empUploadSource === source
                            ? 'bg-[#0284C7]/20 border-[#0284C7] text-[#38BDF8]'
                            : 'border-gray-700 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    All files added to this form by you and other users will also be uploaded with anonymous file sizes (0.01MB)
                  </p>
                </div>
              </div>

              {/* 2. File name */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  File name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter a name for the file"
                  value={empFileName}
                  onChange={(e) => setEmpFileName(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* 3. File access (Employee vs Role) */}
              <div>
                <span className="font-semibold text-gray-300 block mb-1">File access</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="emp_file_access"
                      checked={empFileAccess === 'EMPLOYEE'}
                      onChange={() => setEmpFileAccess('EMPLOYEE')}
                      className="accent-[#0284C7]"
                    />
                    <span>Employee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="emp_file_access"
                      checked={empFileAccess === 'ROLE'}
                      onChange={() => setEmpFileAccess('ROLE')}
                      className="accent-[#0284C7]"
                    />
                    <span>Role</span>
                  </label>
                </div>
              </div>

              {/* 4. Employee Status (Active vs Inactive) */}
              <div>
                <span className="font-semibold text-gray-300 block mb-1">Employee Status</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="emp_status"
                      checked={empStatus === 'ACTIVE'}
                      onChange={() => setEmpStatus('ACTIVE')}
                      className="accent-[#0284C7]"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="emp_status"
                      checked={empStatus === 'INACTIVE'}
                      onChange={() => setEmpStatus('INACTIVE')}
                      className="accent-[#0284C7]"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* 5. Employee Dropdown (Loads live from employees DB) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={empSelectedId}
                  onChange={(e) => setEmpSelectedId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} {emp.employee_number ? `(${emp.employee_number})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Add a detailed description..."
                  value={empDescription}
                  onChange={(e) => setEmpDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {/* 7. Folder */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Folder <span className="text-red-500">*</span>
                </label>
                <select
                  value={empFolderId}
                  onChange={(e) => setEmpFolderId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {folders.map((fld) => (
                    <option key={fld.id} value={fld.id}>
                      {fld.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Acknowledge Section */}
              <div className="pt-2 border-t border-gray-800">
                <span className="font-semibold text-gray-200 block mb-0.5">Acknowledge</span>
                <p className="text-[11px] text-gray-400 mb-2">
                  When enabled, employees will be required to manually acknowledge reading the sent documents.
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={empHasReminder}
                      onChange={(e) => setEmpHasReminder(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Reminder</span>
                  </label>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300 mb-2">
                      <input
                        type="checkbox"
                        checked={empEnforceMandatory}
                        onChange={(e) => setEmpEnforceMandatory(e.target.checked)}
                        className="rounded border-gray-600 accent-[#0284C7]"
                      />
                      <span>Enforce mandatory deadline</span>
                    </label>

                    {empEnforceMandatory && (
                      <div className="space-y-2 pl-6">
                        <input
                          type="date"
                          value={empMandatoryDeadline}
                          onChange={(e) => setEmpMandatoryDeadline(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border text-xs font-mono focus:outline-none ${
                            isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                          }`}
                        />
                        <div className="p-3 rounded-lg bg-gray-800/80 border border-gray-700 text-[11px] text-gray-400 leading-relaxed">
                          Employees will be required to acknowledge this document on or before the due date. On the due date, access to all services in Cube People will be restricted until acknowledgment is received.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 9. File permissions */}
              <div className="pt-2 border-t border-gray-800 space-y-3">
                <span className="font-semibold text-gray-200 block">File permissions</span>
                <div>
                  <span className="text-[11px] text-gray-400 block mb-1">View access</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={empViewEmployee}
                        onChange={(e) => setEmpViewEmployee(e.target.checked)}
                        className="rounded border-gray-600 accent-[#0284C7]"
                      />
                      <span>Employee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={empViewManager}
                        onChange={(e) => setEmpViewManager(e.target.checked)}
                        className="rounded border-gray-600 accent-[#0284C7]"
                      />
                      <span>Reporting manager</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-gray-400 block mb-1">Download access</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={empDownloadEmployee}
                        onChange={(e) => setEmpDownloadEmployee(e.target.checked)}
                        className="rounded border-gray-600 accent-[#0284C7]"
                      />
                      <span>Employee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={empDownloadManager}
                        onChange={(e) => setEmpDownloadManager(e.target.checked)}
                        className="rounded border-gray-600 accent-[#0284C7]"
                      />
                      <span>Reporting manager</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 10. Notifications */}
              <div className="pt-2 border-t border-gray-800">
                <span className="font-semibold text-gray-200 block mb-0.5">Notifications</span>
                <p className="text-[11px] text-gray-400 mb-2">Notify employee about this change</p>
                <div className="flex items-center gap-6">
                  <span className="text-[11px] text-gray-400">Notify through:</span>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={empNotifyFeeds}
                      onChange={(e) => setEmpNotifyFeeds(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Feeds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={empNotifyEmail}
                      onChange={(e) => setEmpNotifyEmail(e.target.checked)}
                      className="rounded border-gray-600 accent-[#0284C7]"
                    />
                    <span>Email</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmpDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT HR FORM TEMPLATE                                        */}
      {/* ========================================================================= */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-slate-200 text-[#0B1730]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-sm font-bold">
                {editingTemplate ? 'Edit template' : 'Add HR Template'}
              </h3>
              <button
                onClick={() => {
                  setIsTemplateModalOpen(false);
                  setEditingTemplate(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Employee NDA Agreement"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed guidelines or template purpose..."
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsTemplateModalOpen(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE FOLDER                                                      */}
      {/* ========================================================================= */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-slate-200 text-[#0B1730]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-sm font-bold">Create Document Folder</h3>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Health & Safety Compliance"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
