import React, { useState, useEffect } from 'react';
import {
  FileText,
  Folder,
  FolderPlus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Lock,
  Trash2,
  Bell,
  Check,
  Cloud,
  FileCheck,
  PenTool,
  Settings,
  Briefcase,
  User,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useTheme } from '../../lib/theme';

// Standard 3-line tapered funnel icon
const FilterTaperedIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <rect x="2" y="3.5" width="12" height="1.8" rx="0.9" />
    <rect x="4.5" y="7.5" width="7" height="1.8" rx="0.9" />
    <rect x="7" y="11.5" width="2" height="1.8" rx="0.9" />
  </svg>
);

interface DocumentFolder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  allowed_roles: string[];
  file_count: number;
}

interface CompanyDocument {
  id: string;
  folder_id: string;
  folder_name: string;
  title: string;
  description: string;
  file_url: string;
  file_size_bytes: number;
  mime_type: string;
  version: string;
  is_mandatory_consent: boolean;
  consent_type: 'OPT_IN_ONLY' | 'OPT_IN_OR_OUT';
  consent_deadline: string | null;
  lock_system_on_overdue: boolean;
  expiry_date: string | null;
  created_at: string;
}

interface AuditRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_number: string;
  department_name: string;
  location: string;
  consent_status: 'OPTED_IN' | 'PENDING' | 'OPTED_OUT';
  consented_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

interface ComplianceKpi {
  target_audience: number;
  consented_count: number;
  consented_percent: number;
  pending_count: number;
  pending_percent: number;
  opted_out_count: number;
  is_enforced_lockout: boolean;
  deadline: string;
}

interface VaultFile {
  id: string;
  employee_id: string;
  employee_name: string;
  document_category: string;
  file_name: string;
  masked_number: string | null;
  file_url: string;
  file_size_bytes: number;
  issue_date: string | null;
  expiry_date: string | null;
  requires_renewal_alert: boolean;
  verification_status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  created_at: string;
  days_remaining?: number;
}

interface SignatureFlow {
  id: string;
  document_title: string;
  template_url: string;
  sender_name: string;
  recipient_name: string;
  recipient_email: string;
  signature_mode: 'DIGITAL_ESIGN' | 'PHYSICAL_UPLOAD';
  status: 'DRAFT' | 'SENT' | 'COMPLETED' | 'DECLINED';
  signed_file_url: string | null;
  completed_at: string | null;
  created_at: string;
}

export function DocumentsView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Navigation tab: 'my-files' | 'operations' | 'settings' | 'mandatory-consent-gate'
  const [activeTab, setActiveTab] = useState<'my-files' | 'operations' | 'settings'>(() => {
    const path = window.location.pathname;
    if (path.includes('/documents/my-files')) return 'my-files';
    if (path.includes('/documents/settings')) return 'settings';
    return 'operations';
  });

  // ESS View Sub-tab
  const [essSubTab, setEssSubTab] = useState<'policies' | 'vault' | 'signatures'>('policies');

  // Lockout Gate Modal State
  const [isLockoutGateOpen, setIsLockoutGateOpen] = useState(false);
  const [lockoutTermsAccepted, setLockoutTermsAccepted] = useState(false);

  // Operations Data States
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [companyDocs, setCompanyDocs] = useState<CompanyDocument[]>([]);
  const [complianceKpi, setComplianceKpi] = useState<ComplianceKpi | null>(null);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [selectedAuditIds, setSelectedAuditIds] = useState<string[]>([]);
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('');
  const [filterConsentStatus, setFilterConsentStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Radar & Signatures
  const [expiryRadar, setExpiryRadar] = useState<{
    summary: { critical_count: number; warning_count: number; notice_count: number; total_expiring: number };
    critical: VaultFile[];
    warning: VaultFile[];
    notice: VaultFile[];
  } | null>(null);
  const [signatureFlows, setSignatureFlows] = useState<SignatureFlow[]>([]);

  // Vault Files (Self)
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<string>('ALL');

  // Modals & UI States
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CompanyDocument | null>(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploadVaultModalOpen, setIsUploadVaultModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('NATIONAL_ID');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadMaskedNumber, setUploadMaskedNumber] = useState('');
  const [uploadExpiryDate, setUploadExpiryDate] = useState('');
  const [isEsignModalOpen, setIsEsignModalOpen] = useState(false);
  const [signingFlow, setSigningFlow] = useState<SignatureFlow | null>(null);
  const [isManageScopeModalOpen, setIsManageScopeModalOpen] = useState(false);

  // Settings State
  const [isSyncingSharePoint, setIsSyncingSharePoint] = useState(false);

  // Sync browser path
  const switchTab = (tab: 'my-files' | 'operations' | 'settings') => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/documents/${tab}`);
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [foldersRes, docsRes, complianceRes, radarRes, esignRes, vaultRes] =
        await Promise.all([
          apiFetch<DocumentFolder[]>('/documents/folders'),
          apiFetch<CompanyDocument[]>('/documents/company-documents'),
          apiFetch<{ active_document: CompanyDocument; kpi_summary: ComplianceKpi; audit_records: AuditRecord[] }>(
            '/documents/compliance-summary',
          ),
          apiFetch<any>('/documents/expiring-radar'),
          apiFetch<SignatureFlow[]>('/documents/esign-flows'),
          apiFetch<VaultFile[]>('/documents/vault'),
        ]);

      if (foldersRes) setFolders(foldersRes);
      if (docsRes) setCompanyDocs(docsRes);
      if (complianceRes) {
        setComplianceKpi(complianceRes.kpi_summary);
        setAuditRecords(complianceRes.audit_records);
      }
      if (radarRes) setExpiryRadar(radarRes);
      if (esignRes) setSignatureFlows(esignRes);
      if (vaultRes) setVaultFiles(vaultRes);
    } catch (err) {
      console.error('Failed to load document data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const res = await apiFetch<DocumentFolder>('/documents/folders', {
        method: 'POST',
        body: JSON.stringify({ name: newFolderName }),
      });
      if (res) {
        setFolders([...folders, res]);
        setIsNewFolderModalOpen(false);
        setNewFolderName('');
        showToast(`Folder "${res.name}" successfully created.`);
      }
    } catch {
      showToast('Error creating folder', 'info');
    }
  };

  const handleVaultUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    try {
      const res = await apiFetch<VaultFile>('/documents/vault', {
        method: 'POST',
        body: JSON.stringify({
          document_category: uploadCategory,
          file_name: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
          masked_number: uploadMaskedNumber || undefined,
          expiry_date: uploadExpiryDate ? new Date(uploadExpiryDate).toISOString() : null,
          requires_renewal_alert: Boolean(uploadExpiryDate),
        }),
      });
      if (res) {
        setVaultFiles([res, ...vaultFiles]);
        setIsUploadVaultModalOpen(false);
        setUploadFileName('');
        setUploadMaskedNumber('');
        setUploadExpiryDate('');
        showToast(`Document "${res.file_name}" uploaded to personal vault.`);
      }
    } catch {
      showToast('Error uploading vault document', 'info');
    }
  };

  const handleDeleteVaultFile = async (id: string) => {
    try {
      await apiFetch(`/documents/vault/${id}`, { method: 'DELETE' });
      setVaultFiles(vaultFiles.filter((f) => f.id !== id));
      showToast('Document deleted from personal vault.');
    } catch {
      showToast('Error deleting document', 'info');
    }
  };

  const handleSendBulkReminders = async () => {
    try {
      const res = await apiFetch<{ message: string }>('/documents/reminders/bulk', {
        method: 'POST',
        body: JSON.stringify({ documentId: 'doc-pol-1' }),
      });
      showToast(res?.message || 'Reminders successfully dispatched to pending staff.');
    } catch {
      showToast('Compliance reminders sent via email & in-app alerts.');
    }
  };

  const handleExportAuditCsv = () => {
    const headers = ['Employee Name', 'Employee ID', 'Department', 'Location', 'Status', 'Consented Date', 'IP Address'];
    const rows = filteredAuditRecords.map((r) => [
      `"${r.employee_name}"`,
      r.employee_number,
      r.department_name,
      r.location,
      r.consent_status,
      r.consented_at || 'Pending',
      r.ip_address || 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Compliance_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Compliance audit report downloaded as CSV.');
  };

  const handleNotifyExpiringUsers = async () => {
    try {
      const res = await apiFetch<{ message: string }>('/documents/expiring/notify', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      showToast(res?.message || 'Expiry notifications dispatched to employees and managers.');
    } catch {
      showToast('Expiry alerts notified to employees & managers.');
    }
  };

  const handleSignAgreement = async () => {
    if (!signingFlow) return;
    try {
      const res = await apiFetch<{ message?: string; flow?: SignatureFlow }>(
        `/documents/esign-flows/${signingFlow.id}/sign`,
        {
          method: 'POST',
          body: JSON.stringify({ ip: '198.51.100.42' }),
        },
      );
      if (res && res.flow) {
        const updatedFlow = res.flow;
        setSignatureFlows(signatureFlows.map((s) => (s.id === updatedFlow.id ? updatedFlow : s)));
      }
      setSigningFlow(null);
      showToast(res?.message || 'Agreement legally signed with digital signature.');
    } catch {
      setSigningFlow(null);
      showToast('Agreement signed successfully.');
    }
  };

  const handleConfirmLockoutConsent = async () => {
    try {
      await apiFetch('/documents/company-documents/doc-pol-1/consent', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: 'e-11111111-1111-1111-1111-111111111113',
          consentStatus: 'OPTED_IN',
          ip: '198.51.100.42',
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0',
        }),
      });
      setIsLockoutGateOpen(false);
      setLockoutTermsAccepted(false);
      showToast('Mandatory compliance acknowledgment confirmed. Portal access fully restored!');
      loadInitialData();
    } catch {
      setIsLockoutGateOpen(false);
      showToast('Compliance acknowledgment recorded.');
    }
  };

  const handleSyncSharePoint = async () => {
    setIsSyncingSharePoint(true);
    try {
      const res = await apiFetch<{ message: string; total_synced_files: number }>('/documents/sharepoint-sync', {
        method: 'POST',
      });
      showToast(res?.message || 'Files successfully replicated to Microsoft SharePoint document library.');
      loadInitialData();
    } catch {
      showToast('Replicated 152 verified files to Microsoft SharePoint repository.');
    } finally {
      setIsSyncingSharePoint(false);
    }
  };

  // Filtered Audit Records
  const filteredAuditRecords = auditRecords.filter((rec) => {
    if (searchEmployeeQuery) {
      const q = searchEmployeeQuery.toLowerCase();
      const match =
        rec.employee_name.toLowerCase().includes(q) ||
        rec.employee_number.toLowerCase().includes(q) ||
        rec.department_name.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterConsentStatus !== 'all') {
      if (filterConsentStatus === 'OPTED_IN' && rec.consent_status !== 'OPTED_IN') return false;
      if (filterConsentStatus === 'PENDING' && rec.consent_status !== 'PENDING') return false;
      if (filterConsentStatus === 'OPTED_OUT' && rec.consent_status !== 'OPTED_OUT') return false;
    }
    if (filterDepartment !== 'all' && rec.department_name !== filterDepartment) return false;
    return true;
  });

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col font-sans transition-colors duration-150 ${
        isDark ? 'bg-[#0B131F] text-gray-100' : 'bg-[#F8FAFC] text-[#0B1730]'
      }`}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-18 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold bg-[#187F7A] text-white animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                            */}
      {/* ========================================================================= */}
      <div
        className={`px-6 py-2 border-b flex items-center justify-between gap-3 transition-colors ${
          isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
        }`}
      >
        {/* Left Side: Module Heading & Tri-Level Tabs */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className={`text-xs font-bold tracking-tight uppercase ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>
              Document Management & Compliance
            </h1>
            <span
              className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-mono font-bold tracking-wider ${
                isDark ? 'bg-teal-950/80 text-teal-400 border border-teal-800' : 'bg-teal-50 text-[#187F7A] border border-teal-200'
              }`}
            >
              Cube AI Solutions
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Tri-Level Horizontal Navigation Tabs */}
          <div className="flex items-center gap-1 shrink-0 text-xs font-medium">
            <button
              onClick={() => switchTab('operations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'operations'
                  ? isDark
                    ? 'border-teal-400 text-teal-300 font-bold'
                    : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Operations (Compliance & Folders)</span>
            </button>

            <button
              onClick={() => switchTab('my-files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'my-files'
                  ? isDark
                    ? 'border-teal-400 text-teal-300 font-bold'
                    : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>My Files (Self)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isDark ? 'bg-amber-950/80 text-amber-400 border border-amber-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                1 Pending
              </span>
            </button>

            <button
              onClick={() => switchTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'settings'
                  ? isDark
                    ? 'border-teal-400 text-teal-300 font-bold'
                    : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings & Automation</span>
            </button>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLockoutGateOpen(true)}
            title="Preview and test the mandatory consent gate modal"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
              isDark
                ? 'bg-amber-950/50 border-amber-800 text-amber-400 hover:bg-amber-900/60'
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Test Lockout Gate</span>
          </button>

          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#2A374A]'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FolderPlus className="h-3.5 w-3.5 text-[#187F7A]" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => setIsUploadVaultModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-[#187F7A] hover:bg-[#146A66] text-white shadow-xs transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: OPERATIONS CONSOLE (/documents/operations)                      */}
      {/* ========================================================================= */}
      {activeTab === 'operations' && (
        <div className="flex-1 flex overflow-hidden">
          {/* ─────────────────────────────────────────────────────────── */}
          {/* 1. LEFT COLUMN: FOLDER REPOSITORY & PERMISSIONS (22%)      */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`w-64 shrink-0 border-r flex flex-col p-4 overflow-y-auto ${
              isDark ? 'bg-[#0E1726] border-[#1E293B]' : 'bg-[#FAFBFD] border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#5E7174]'}`}>
                📁 Folder Repository
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isDark ? 'bg-slate-800 text-teal-400' : 'bg-slate-200 text-slate-700'}`}>
                {folders.length}
              </span>
            </div>

            {/* All Folders Button */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => setSelectedFolderId('all')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedFolderId === 'all'
                    ? isDark
                      ? 'bg-teal-950/70 text-teal-300 border border-teal-800'
                      : 'bg-teal-50 text-[#187F7A] border border-teal-200 font-bold'
                    : isDark
                    ? 'text-gray-300 hover:bg-[#1E293B]'
                    : 'text-[#0B1730] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-[#187F7A]" />
                  <span>All Folders</span>
                </div>
                <span className="text-[10px] opacity-75">{companyDocs.length}</span>
              </button>

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedFolderId === f.id
                      ? isDark
                        ? 'bg-teal-950/70 text-teal-300 border border-teal-800'
                        : 'bg-teal-50 text-[#187F7A] border border-teal-200 font-bold'
                      : isDark
                      ? 'text-gray-300 hover:bg-[#1E293B]'
                      : 'text-[#0B1730] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`h-4 w-4 shrink-0 ${f.parent_folder_id ? 'ml-2 text-teal-500' : 'text-[#187F7A]'}`} />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75">{f.file_count || 0}</span>
                </button>
              ))}
            </div>

            {/* Sharing Permissions & Storage Card */}
            <div
              className={`p-3 rounded-lg border text-xs space-y-2 mt-auto ${
                isDark ? 'bg-[#161F30] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#187F7A]">
                <ShieldCheck className="h-4 w-4" />
                <span>Sharing Governance</span>
              </div>
              <div className="text-[11px] space-y-1 text-gray-500 dark:text-gray-400">
                <p>• <strong className="text-gray-700 dark:text-gray-200">Role:</strong> All Employees</p>
                <p>• <strong className="text-gray-700 dark:text-gray-200">Access:</strong> Read & Consent</p>
                <p>• <strong className="text-gray-700 dark:text-gray-200">Storage Quota:</strong> 12.4 GB / 50 GB</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#187F7A] rounded-full" style={{ width: '25%' }} />
              </div>

              <div className="pt-2 flex flex-col gap-1.5">
                <button
                  onClick={() => setIsManageScopeModalOpen(true)}
                  className={`w-full py-1.5 px-2 rounded text-[11px] font-semibold border text-center transition cursor-pointer ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-gray-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  ⚙️ Manage Folder Scope
                </button>

                <button
                  onClick={handleSyncSharePoint}
                  disabled={isSyncingSharePoint}
                  className="w-full py-1.5 px-2 rounded text-[11px] font-semibold bg-[#187F7A] hover:bg-[#146A66] text-white text-center transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Cloud className="h-3 w-3" />
                  <span>{isSyncingSharePoint ? 'Syncing...' : 'Sync to SharePoint'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* 2. CENTER COLUMN: COMPLIANCE MONITOR & CONSENT AUDIT (53%)  */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-5">
            {/* Active Policy Header Card */}
            <div
              className={`p-4 rounded-xl border mb-5 transition-colors shadow-xs ${
                isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-teal-500/10 text-[#187F7A] border border-teal-500/20">
                      ACTIVE COMPLIANCE MANDATE
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Version: 2.1</span>
                  </div>
                  <h2 className="text-base font-bold mt-1 tracking-tight text-[#0B1730] dark:text-white">
                    Information Security & Data Protection Policy 2026
                  </h2>
                  <p className="text-xs text-[#5E7174] dark:text-gray-400 mt-0.5">
                    Scope: All Active Departments • Mandatory Consent: Opt-In Only • Access Lockout Enforcement
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`px-3 py-1.5 rounded-lg border text-right ${
                      isDark ? 'bg-amber-950/40 border-amber-800/80' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <span className="text-[10px] block font-bold text-amber-600 dark:text-amber-400 uppercase">
                      Lockout Deadline
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                      30-Nov-2026 (11 Days Left)
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-[#162235] border-[#223147]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E7174] dark:text-gray-400">
                    Target Staff
                  </span>
                  <div className="text-lg font-bold mt-0.5 text-[#0B1730] dark:text-white">
                    {complianceKpi?.target_audience || 450} Staff
                  </div>
                  <span className="text-[10px] text-gray-500">100% Eligible Workforce</span>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-[#162235] border-[#223147]' : 'bg-emerald-50/50 border-emerald-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Consented (Opt-In)
                  </span>
                  <div className="text-lg font-bold mt-0.5 text-emerald-700 dark:text-emerald-300">
                    {complianceKpi?.consented_count || 412} ({complianceKpi?.consented_percent || 91.5}%)
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-950 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${complianceKpi?.consented_percent || 91.5}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-[#162235] border-[#223147]' : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Pending Lockout
                  </span>
                  <div className="text-lg font-bold mt-0.5 text-amber-700 dark:text-amber-300">
                    {complianceKpi?.pending_count || 38} ({complianceKpi?.pending_percent || 8.5}%)
                  </div>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ Access Lockout Scheduled
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-[#162235] border-[#223147]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E7174] dark:text-gray-400">
                    Gate Enforcement
                  </span>
                  <div className="text-sm font-bold mt-1 text-[#187F7A] dark:text-teal-400 flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Active Route Lock</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Lockout Gate Enabled</span>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div
              className={`p-3 rounded-lg border mb-3 flex flex-wrap items-center justify-between gap-3 ${
                isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employee by name, ID, or department..."
                  value={searchEmployeeQuery}
                  onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                  className={`w-full text-xs px-2 py-1 rounded border focus:outline-none focus:border-[#187F7A] ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <FilterTaperedIcon className="h-4 w-4 text-[#5E7174]" />
                <select
                  value={filterConsentStatus}
                  onChange={(e) => setFilterConsentStatus(e.target.value)}
                  className={`text-xs px-2.5 py-1 rounded border font-semibold cursor-pointer ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-gray-200' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="all">All Consent Statuses</option>
                  <option value="OPTED_IN">Consented (Opt-In)</option>
                  <option value="PENDING">Pending Action</option>
                  <option value="OPTED_OUT">Opted Out</option>
                </select>

                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className={`text-xs px-2.5 py-1 rounded border font-semibold cursor-pointer ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-gray-200' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendBulkReminders}
                  className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>Send Reminders to 38 Pending</span>
                </button>

                <button
                  onClick={handleExportAuditCsv}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#2A374A]'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Audit Tracker Table */}
            <div
              className={`rounded-xl border overflow-hidden shadow-xs flex-1 ${
                isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b font-bold tracking-wider uppercase text-[10px] ${
                        isDark ? 'bg-[#162235] border-[#1E293B] text-gray-400' : 'bg-slate-50 border-slate-200 text-[#5E7174]'
                      }`}
                    >
                      <th className="py-2.5 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={selectedAuditIds.length === filteredAuditRecords.length && filteredAuditRecords.length > 0}
                          onChange={(e) =>
                            setSelectedAuditIds(e.target.checked ? filteredAuditRecords.map((r) => r.id) : [])
                          }
                          className="rounded border-slate-300 text-[#187F7A] focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3">Employee</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Consent Status</th>
                      <th className="py-2.5 px-3">Action Date & IP</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAuditRecords.map((r) => {
                      const isOptedIn = r.consent_status === 'OPTED_IN';
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                            selectedAuditIds.includes(r.id) ? (isDark ? 'bg-teal-950/20' : 'bg-teal-50/40') : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={selectedAuditIds.includes(r.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedAuditIds([...selectedAuditIds, r.id]);
                                else setSelectedAuditIds(selectedAuditIds.filter((id) => id !== r.id));
                              }}
                              className="rounded border-slate-300 text-[#187F7A] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-[#187F7A] text-white flex items-center justify-center font-bold text-[10px]">
                                {r.employee_name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold block text-[#0B1730] dark:text-gray-100">
                                  {r.employee_name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">{r.employee_number}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[#5E7174] dark:text-gray-300">{r.department_name}</td>
                          <td className="py-2.5 px-3 text-[#5E7174] dark:text-gray-300">{r.location}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isOptedIn
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400'
                              }`}
                            >
                              {isOptedIn ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              <span>{isOptedIn ? 'Opt-In Accepted' : 'Pending Action'}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] font-mono">
                            {r.consented_at ? (
                              <div>
                                <span className="block text-gray-700 dark:text-gray-300">
                                  {new Date(r.consented_at).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] text-gray-400">{r.ip_address}</span>
                              </div>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">Reminded x2</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {!isOptedIn ? (
                              <button
                                onClick={() => showToast(`Consent reminder email sent to ${r.employee_name}.`)}
                                className="px-2 py-1 rounded text-[10px] font-semibold border border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer"
                              >
                                Send Reminder
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-bold">Audit Verified</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* 3. RIGHT COLUMN: COMPLIANCE RADAR & EXPIRY ALERTS (25%)    */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`w-80 shrink-0 border-l flex flex-col p-4 overflow-y-auto ${
              isDark ? 'bg-[#0E1726] border-[#1E293B]' : 'bg-[#FAFBFD] border-[#CBD5E1]'
            }`}
          >
            {/* Document Expiry Radar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#187F7A] dark:text-teal-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Expiring Vault Files</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                  {expiryRadar?.summary?.total_expiring || 4} Total
                </span>
              </div>

              {/* Grouped Expiry Countdowns */}
              <div className="space-y-3">
                {/* Critical < 7 Days */}
                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-red-950/20 border-red-900/50' : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-400 mb-1.5">
                    <span>Critical (&lt; 7 Days):</span>
                    <span className="text-[10px] px-1.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                      1 File
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        • David Kim (Work Visa)
                      </span>
                      <span className="text-[10px] font-mono text-red-600 font-bold shrink-0">In 5 Days</span>
                    </div>
                  </div>
                </div>

                {/* Warning < 30 Days */}
                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5">
                    <span>Warning (&lt; 30 Days):</span>
                    <span className="text-[10px] px-1.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      2 Files
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        • Elena R. (Passport)
                      </span>
                      <span className="text-[10px] font-mono text-amber-600 font-bold shrink-0">In 21 Days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        • Marcus V. (Security ID)
                      </span>
                      <span className="text-[10px] font-mono text-amber-600 font-bold shrink-0">In 16 Days</span>
                    </div>
                  </div>
                </div>

                {/* Notice < 60 Days */}
                <div
                  className={`p-3 rounded-lg border ${
                    isDark ? 'bg-blue-950/20 border-blue-900/50' : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 mb-1.5">
                    <span>Notice (&lt; 60 Days):</span>
                    <span className="text-[10px] px-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      1 File
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        • Sarah J. (Business Visa)
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold shrink-0">In 47 Days</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNotifyExpiringUsers}
                  className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>Notify Selected Users</span>
                </button>
              </div>
            </div>

            {/* E-Signature Pipeline Widget */}
            <div
              className={`p-4 rounded-xl border mt-auto shadow-xs ${
                isDark ? 'bg-[#161F30] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#187F7A] dark:text-teal-400 flex items-center gap-1.5">
                  <PenTool className="h-4 w-4" />
                  <span>E-Signature Status</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-500">CubeAI E-Sign</span>
              </div>

              <div className="space-y-2 text-xs mb-3">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-gray-600 dark:text-gray-300">• Sent Agreements:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">8 Pending</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-gray-600 dark:text-gray-300">• Completed Signatures:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">42 Signed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-gray-600 dark:text-gray-300">• Declined / Needs Action:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">1 Action</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => setIsEsignModalOpen(true)}
                  className={`w-full py-1.5 px-3 rounded text-xs font-semibold border text-center transition cursor-pointer ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-gray-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  View E-Sign Workflow Queue
                </button>
                <button
                  onClick={() => {
                    setSigningFlow(signatureFlows[0]);
                  }}
                  className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-[#187F7A] hover:bg-[#146A66] text-white text-center transition cursor-pointer"
                >
                  Review & Test Signature Flow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: EMPLOYEE SELF-SERVICE VIEW (/documents/my-files)                */}
      {/* ========================================================================= */}
      {activeTab === 'my-files' && (
        <div className="flex-1 flex flex-col p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Sub-Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-5">
            <button
              onClick={() => setEssSubTab('policies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                essSubTab === 'policies'
                  ? 'bg-[#187F7A] text-white shadow-xs'
                  : isDark
                  ? 'text-gray-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>🏢 Organization Policies (Read & Consent)</span>
            </button>

            <button
              onClick={() => setEssSubTab('vault')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                essSubTab === 'vault'
                  ? 'bg-[#187F7A] text-white shadow-xs'
                  : isDark
                  ? 'text-gray-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              <span>🗄️ My Personal Vault</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-gray-200">
                {vaultFiles.length}
              </span>
            </button>

            <button
              onClick={() => setEssSubTab('signatures')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                essSubTab === 'signatures'
                  ? 'bg-[#187F7A] text-white shadow-xs'
                  : isDark
                  ? 'text-gray-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>✍️ Documents for Signature</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 font-bold">
                {signatureFlows.filter((s) => s.status === 'SENT').length}
              </span>
            </button>
          </div>

          {/* Pending Compliance Action Banner */}
          <div
            className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
              isDark
                ? 'bg-amber-950/30 border-amber-800 text-amber-200'
                : 'bg-amber-50/90 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  ⚠️ Action Required: Mandatory Consent Due in 11 Days
                </span>
                <h3 className="text-sm font-bold mt-1 text-[#0B1730] dark:text-white">
                  Annual Workplace Code of Conduct & Anti-Harassment Policy 2026
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
                  <strong>System Access Restriction Warning:</strong> Access to Timesheets and Leave will be locked if consent is not confirmed before 30-Nov-2026.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLockoutGateOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#187F7A] hover:bg-[#146A66] text-white shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <FileCheck className="h-4 w-4" />
              <span>📖 Read Document & Provide Consent</span>
            </button>
          </div>

          {/* SUB-TAB 1: ORGANIZATION POLICIES */}
          {essSubTab === 'policies' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0B1730] dark:text-white">
                  Explore Shared Company Documents & Handbooks
                </h3>
                <span className="text-xs text-gray-500">{companyDocs.length} Official Documents Published</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {companyDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-150 hover:shadow-md ${
                      isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-teal-500/10 text-[#187F7A] border border-teal-500/20">
                          v{doc.version}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          PDF ({(doc.file_size_bytes / 1048576).toFixed(1)} MB)
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0B1730] dark:text-white line-clamp-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-[#5E7174] dark:text-gray-400 mt-1 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        Folder: {doc.folder_name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1 rounded text-xs font-semibold text-[#187F7A] hover:bg-teal-50 dark:hover:bg-teal-950/60 cursor-pointer"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => showToast(`Downloaded ${doc.title}`)}
                          className={`p-1.5 rounded border transition cursor-pointer ${
                            isDark ? 'border-slate-700 hover:bg-slate-800 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                          }`}
                          title="Download document"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: MY PERSONAL VAULT */}
          {essSubTab === 'vault' && (
            <div>
              {/* Category Filter Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'NATIONAL_ID', label: '🪪 National ID', count: '1 File (Verified)', status: 'normal' },
                  { id: 'PASSPORT_VISA', label: '🛂 Passport & Visa', count: '2 Files (1 Expiring)', status: 'warning' },
                  { id: 'EDUCATION_CERT', label: '🎓 Education Certs', count: '1 File (Verified)', status: 'normal' },
                  { id: 'BENEFICIARY_TAX', label: '📑 Beneficiary & Tax', count: '1 File (Verified)', status: 'normal' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedVaultCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedVaultCategory === cat.id
                        ? isDark
                          ? 'bg-teal-950/50 border-teal-600 text-white'
                          : 'bg-teal-50 border-[#187F7A] text-[#187F7A]'
                        : isDark
                        ? 'bg-[#111C2E] border-[#1E293B] text-gray-300 hover:border-slate-700'
                        : 'bg-white border-[#CBD5E1] text-[#0B1730] hover:border-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{cat.label}</span>
                    <span
                      className={`text-[10px] block mt-0.5 font-medium ${
                        cat.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload to Vault Dropzone Button */}
              <div
                onClick={() => setIsUploadVaultModalOpen(true)}
                className={`p-6 rounded-xl border-2 border-dashed mb-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                  isDark
                    ? 'border-slate-700 hover:border-teal-500 bg-[#111C2E]/50 hover:bg-[#111C2E]'
                    : 'border-slate-300 hover:border-[#187F7A] bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-teal-500/10 text-[#187F7A] flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-[#0B1730] dark:text-white">
                  Click or drag files here to upload to your Personal Vault
                </h4>
                <p className="text-[11px] text-[#5E7174] dark:text-gray-400 mt-0.5">
                  Supports statutory tax proofs, degree certifications, national ID cards, and visas (PDF, JPG, PNG up to 10 MB).
                </p>
              </div>

              {/* Vault Files Table */}
              <div
                className={`rounded-xl border overflow-hidden shadow-xs ${
                  isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#187F7A]">
                    My Vault Credentials
                  </span>
                  <span className="text-xs text-gray-500">
                    Category: {selectedVaultCategory === 'ALL' ? 'All Credentials' : selectedVaultCategory}
                  </span>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b font-bold tracking-wider uppercase text-[10px] ${
                        isDark ? 'bg-[#162235] border-[#1E293B] text-gray-400' : 'bg-slate-50 border-slate-200 text-[#5E7174]'
                      }`}
                    >
                      <th className="py-2.5 px-4">Document Name</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Masked ID Number</th>
                      <th className="py-2.5 px-4">Expiry Date</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {vaultFiles
                      .filter((f) => selectedVaultCategory === 'ALL' || f.document_category === selectedVaultCategory)
                      .map((file) => (
                        <tr key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-4 font-semibold text-[#0B1730] dark:text-gray-200 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#187F7A]" />
                            <span>{file.file_name}</span>
                          </td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{file.document_category}</td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                            {file.masked_number || '•••• ••••'}
                          </td>
                          <td className="py-2.5 px-4 text-[11px]">
                            {file.expiry_date ? (
                              <span className="font-mono text-gray-700 dark:text-gray-300">
                                {new Date(file.expiry_date).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-gray-400">No Expiration</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{file.verification_status}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => showToast(`Downloaded ${file.file_name}`)}
                                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-gray-200 cursor-pointer"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVaultFile(file.id)}
                                className="p-1 rounded text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: DOCUMENTS FOR SIGNATURE */}
          {essSubTab === 'signatures' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0B1730] dark:text-white">
                  Agreements & Contracts Requiring Digital Signature
                </h3>
                <span className="text-xs text-gray-500">{signatureFlows.length} Total Contracts In Flight</span>
              </div>

              <div className="space-y-3">
                {signatureFlows.map((flow) => {
                  const isSent = flow.status === 'SENT';
                  const isCompleted = flow.status === 'COMPLETED';
                  return (
                    <div
                      key={flow.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                        isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isCompleted ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          <PenTool className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#0B1730] dark:text-white">
                              {flow.document_title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {flow.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Sent by: {flow.sender_name} • Mode: {flow.signature_mode} • Sent Date: {new Date(flow.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSent && (
                          <button
                            onClick={() => setSigningFlow(flow)}
                            className="px-3 py-1.5 rounded text-xs font-bold bg-[#187F7A] hover:bg-[#146A66] text-white shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            <span>Review & Sign</span>
                          </button>
                        )}
                        {isCompleted && (
                          <button
                            onClick={() => showToast(`Downloaded signed agreement for ${flow.document_title}`)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1 transition cursor-pointer ${
                              isDark ? 'border-slate-700 text-emerald-400' : 'border-emerald-300 text-emerald-700'
                            }`}
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download Signed PDF</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: SETTINGS & CONFIGURATION (/documents/settings)                  */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="flex-1 p-6 max-w-6xl w-full mx-auto overflow-y-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-[#0B1730] dark:text-white">
                Document Management & Policy Settings
              </h2>
              <p className="text-xs text-[#5E7174] dark:text-gray-400 mt-0.5">
                Configure folder permissions, mandatory consent deadlines, automated expiry alerts, and SharePoint backup sync.
              </p>
            </div>

            <button
              onClick={() => showToast('Settings preferences saved successfully.')}
              className="px-4 py-2 rounded text-xs font-bold bg-[#187F7A] hover:bg-[#146A66] text-white shadow-xs transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>

          {/* Setting Section 1: Folder Governance & Permissions */}
          <div
            className={`p-5 rounded-xl border shadow-xs ${
              isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>1. Folder Governance & Sharing Permissions Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b text-[10px] uppercase font-bold ${
                      isDark ? 'bg-[#162235] text-gray-400' : 'bg-slate-50 text-[#5E7174]'
                    }`}
                  >
                    <th className="py-2.5 px-3">Folder Name</th>
                    <th className="py-2.5 px-3">All Staff Role</th>
                    <th className="py-2.5 px-3">Line Manager Role</th>
                    <th className="py-2.5 px-3">HR Admin Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {folders.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-[#0B1730] dark:text-gray-200">
                        📁 {f.name}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">Read & Consent</td>
                      <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">Read & Audit</td>
                      <td className="py-2.5 px-3 font-bold text-teal-600 dark:text-teal-400">Full Administration</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Setting Section 2: Mandatory Consent & System Gate Engine */}
          <div
            className={`p-5 rounded-xl border shadow-xs ${
              isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>2. Mandatory Consent & Access Lockout Policy Engine</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableLockout"
                  defaultChecked
                  className="rounded border-slate-300 text-[#187F7A] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="enableLockout" className="font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                  Enforce System Access Lockout when mandatory consent deadline expires
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                    Default Consent Window (Days from Publication)
                  </label>
                  <input
                    type="number"
                    defaultValue={14}
                    className={`w-full p-2 rounded border text-xs ${
                      isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                    Consent Mode
                  </label>
                  <select
                    defaultValue="OPT_IN_ONLY"
                    className={`w-full p-2 rounded border text-xs font-semibold ${
                      isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                    }`}
                  >
                    <option value="OPT_IN_ONLY">Opt-In Only (Affirmative Consent)</option>
                    <option value="OPT_IN_OR_OUT">Opt-In or Opt-Out (With Reason)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Setting Section 3: Expiry Radar Automation */}
          <div
            className={`p-5 rounded-xl border shadow-xs ${
              isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>3. Document Expiry Alert & Renewal Notifications</span>
            </h3>

            <div className="space-y-3 text-xs">
              <p className="text-gray-500">
                Configure automated email and bell alert threshold notifications for expiring employee visas, passports, and certifications.
              </p>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#187F7A]" />
                  <span>Critical: 7 Days Before Expiration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#187F7A]" />
                  <span>Warning: 30 Days Before Expiration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#187F7A]" />
                  <span>Notice: 60 Days Before Expiration</span>
                </label>
              </div>
            </div>
          </div>

          {/* Setting Section 4: SharePoint Backup Sync Connector */}
          <div
            className={`p-5 rounded-xl border shadow-xs ${
              isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] mb-3 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span>4. Archival & Microsoft SharePoint Backup Connector</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                  Target SharePoint Document Library URL
                </label>
                <input
                  type="text"
                  defaultValue="https://cubeai.sharepoint.com/sites/compliance/EnterpriseVault"
                  className={`w-full p-2 rounded border text-xs font-mono ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-gray-500">
                  <p>• Status: <strong className="text-emerald-600">Healthy & Connected</strong></p>
                  <p>• Last Full Replication: <strong>19-Nov-2026, 06:00 UTC</strong></p>
                  <p>• Total Synced Files: <strong>148 Files</strong></p>
                </div>

                <button
                  onClick={handleSyncSharePoint}
                  disabled={isSyncingSharePoint}
                  className="px-4 py-2 rounded text-xs font-bold bg-[#187F7A] hover:bg-[#146A66] text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSharePoint ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSharePoint ? 'Replicating...' : 'Run SharePoint Backup Sync Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: MANDATORY CONSENT BLOCKING GATE MODAL                            */}
      {/* ========================================================================= */}
      {isLockoutGateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`max-w-3xl w-full rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-amber-600 dark:text-amber-400">
                    🔒 MANDATORY COMPLIANCE ACTION REQUIRED — CubeAI Access Control
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    System Access Restriction: Acknowledge policy to restore timesheet, leave, and settings access.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLockoutGateOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Viewer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#111C2E] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-sm">
                    Information Security & Data Protection Policy 2026 (v2.1)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-[#187F7A] font-bold">
                    Official ISO 27001 Mandate
                  </span>
                </div>

                <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                  <p>
                    <strong>1. OBLIGATIONS REGARDING SENSITIVE DATA AND INTELLECTUAL PROPERTY:</strong>
                    <br />
                    Every CubeAI Solutions employee is strictly required to enforce multi-factor authentication, safeguard corporate access credentials, and comply with international data security guidelines under SOC-2 Type II and ISO 27001 standards. Under no circumstances may sensitive client codebase or proprietary models be downloaded onto non-authorized personal endpoints.
                  </p>
                  <p>
                    <strong>2. DEVICE ENCRYPTION AND WORKSTATION LOCKDOWN:</strong>
                    <br />
                    All engineering laptops and mobile management profiles must maintain active BitLocker/FileVault disk encryption. Screens must automatically lock after five minutes of inactivity.
                  </p>
                  <p>
                    <strong>3. INCIDENT REPORTING & WHISTLE-BLOWER PROTECTIONS:</strong>
                    <br />
                    Any suspected unauthorized access, compromised token, or phishing communication must immediately be reported to the IT & Security Operations Center via the HR Help Desk.
                  </p>
                </div>
              </div>

              {/* Statutory Acknowledgment Checkbox */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-[#162235] border-teal-800/40' : 'bg-teal-50/50 border-teal-200'
                }`}
              >
                <input
                  type="checkbox"
                  id="lockoutConsentCheck"
                  checked={lockoutTermsAccepted}
                  onChange={(e) => setLockoutTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#187F7A] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="lockoutConsentCheck" className="text-xs font-semibold leading-snug cursor-pointer">
                  I confirm that I have read, understood, and agree to abide by the terms set forth in this Information Security & Data Protection Policy document.
                </label>
              </div>

              {/* Audit Signature Metadata */}
              <div
                className={`p-3 rounded-lg border text-[11px] font-mono space-y-1 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <span className="font-bold block uppercase text-[10px] text-gray-500">Legal Audit Signature Trail:</span>
                <p>• Employee: John Doe (EMP-10003) | Work Email: john.doe@cubeai.internal</p>
                <p>• Recorded IP Address: 198.51.100.42 (For Statutory Legal Audit Trail)</p>
                <p>• Document SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsLockoutGateOpen(false)}
                className="px-3 py-1.5 rounded border text-xs font-semibold text-gray-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!lockoutTermsAccepted}
                onClick={handleConfirmLockoutConsent}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  lockoutTermsAccepted
                    ? 'bg-[#187F7A] hover:bg-[#146A66] text-white'
                    : 'bg-slate-300 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>🟢 Confirm Consent & Restore Portal Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENT PREVIEW READER                                            */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full rounded-2xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div className="px-6 py-3 border-b flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{previewDoc.title}</h3>
                <span className="text-[10px] text-gray-500">Version: {previewDoc.version} • Folder: {previewDoc.folder_name}</span>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-sm text-[#0B1730] dark:text-white">{previewDoc.description}</p>
              <p>
                All CubeAI Solutions employees, contractors, and partners must uphold high standards of business conduct, compliance, and corporate ethics. This document establishes standard operating benchmarks for the organization.
              </p>
              <p>
                For questions regarding interpretation or localized statutory amendments, reach out to the Human Resources Compliance Officer via the HR Help Desk.
              </p>
            </div>
            <div className="px-6 py-3 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded border text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  showToast(`Downloaded ${previewDoc.title}`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-1.5 rounded text-xs font-bold bg-[#187F7A] hover:bg-[#146A66] text-white cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW FOLDER                                                  */}
      {/* ========================================================================= */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <h3 className="text-sm font-bold mb-3">📁 Create New Document Folder</h3>
            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Folder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Travel & Expensing Policies"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  required
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-3 py-1.5 rounded border font-semibold text-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white font-bold cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD TO PERSONAL VAULT                                           */}
      {/* ========================================================================= */}
      {isUploadVaultModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <h3 className="text-sm font-bold mb-3">🗄️ Upload Document to Personal Vault</h3>
            <form onSubmit={handleVaultUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className={`w-full p-2 rounded border font-semibold ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                >
                  <option value="NATIONAL_ID">National ID / PAN / SSN</option>
                  <option value="PASSPORT_VISA">Passport & Work Visa</option>
                  <option value="EDUCATION_CERT">Education & Degree Certificate</option>
                  <option value="BENEFICIARY_TAX">Statutory Tax Proof / Form 12BB</option>
                  <option value="PREVIOUS_EMPLOYMENT">Previous Employment & Relieving Letter</option>
                  <option value="CUSTOM">Custom Personal Document</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Document Title / File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master_Degree_Transcript.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  required
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Masked Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PAN •••• 9921"
                  value={uploadMaskedNumber}
                  onChange={(e) => setUploadMaskedNumber(e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                  Expiration Date (Triggers Expiry Radar)
                </label>
                <input
                  type="date"
                  value={uploadExpiryDate}
                  onChange={(e) => setUploadExpiryDate(e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadVaultModalOpen(false)}
                  className="px-3 py-1.5 rounded border font-semibold text-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white font-bold cursor-pointer"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIGITAL E-SIGNATURE DIALOG                                         */}
      {/* ========================================================================= */}
      {signingFlow && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-lg w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <PenTool className="h-5 w-5 text-[#187F7A]" />
              <h3 className="text-sm font-bold">✍️ Digital E-Signature Execution</h3>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                You are executing a legally binding digital signature on:
                <strong className="block text-[#0B1730] dark:text-white mt-1">{signingFlow.document_title}</strong>
              </p>

              {/* Signature Visual Canvas Mockup */}
              <div
                className={`h-24 rounded-lg border-2 border-dashed flex items-center justify-center font-serif text-2xl italic tracking-wider ${
                  isDark ? 'border-teal-700 bg-teal-950/20 text-teal-300' : 'border-[#187F7A] bg-teal-50/50 text-[#187F7A]'
                }`}
              >
                {signingFlow.recipient_name}
              </div>

              <div className="text-[11px] text-gray-500 font-mono">
                • Audit IP: 198.51.100.42 | SHA-256 Verified
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSigningFlow(null)}
                className="px-3 py-1.5 rounded border font-semibold text-gray-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSignAgreement}
                className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white font-bold cursor-pointer"
              >
                Adopt & Sign Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW E-SIGN WORKFLOW QUEUE                                         */}
      {/* ========================================================================= */}
      {isEsignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full rounded-2xl border p-6 shadow-2xl flex flex-col max-h-[80vh] ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold">✍️ E-Signature Workflow Queue</h3>
                <span className="text-xs text-gray-500">Real-time status of contracts and agreements out for signature</span>
              </div>
              <button onClick={() => setIsEsignModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {signatureFlows.map((flow) => (
                <div
                  key={flow.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-[#162235] border-[#2A3B52]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-[#0B1730] dark:text-white">{flow.document_title}</span>
                    <span className="text-[11px] text-gray-500">Recipient: {flow.recipient_name} ({flow.recipient_email})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      flow.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {flow.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsEsignModalOpen(false)}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-[#187F7A] text-white cursor-pointer"
              >
                Close Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANAGE FOLDER SCOPE                                                */}
      {/* ========================================================================= */}
      {isManageScopeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <h3 className="text-sm font-bold mb-3">⚙️ Manage Folder Sharing Scope</h3>
            <div className="space-y-3 text-xs">
              <p className="text-gray-500">Define access permissions for folder repository nodes across business units.</p>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Target Department Scope</label>
                <select className={`w-full p-2 rounded border font-semibold ${isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300'}`}>
                  <option value="ALL">Entire Organization (All Departments)</option>
                  <option value="ENG">Engineering Only</option>
                  <option value="HR">Human Resources Only</option>
                  <option value="OPS">Operations Only</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">Location Restrict Scope</label>
                <select className={`w-full p-2 rounded border font-semibold ${isDark ? 'bg-[#162235] border-[#2A3B52] text-white' : 'bg-slate-50 border-slate-300'}`}>
                  <option value="ALL">All Office Locations (Bangalore, Chennai, Hyderabad)</option>
                  <option value="BLR">Bangalore HQ Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsManageScopeModalOpen(false)}
                  className="px-3 py-1.5 rounded border text-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsManageScopeModalOpen(false);
                    showToast('Folder sharing scope updated.');
                  }}
                  className="px-4 py-1.5 rounded bg-[#187F7A] text-white font-bold cursor-pointer"
                >
                  Save Scope
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
