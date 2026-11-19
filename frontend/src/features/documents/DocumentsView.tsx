import { useState } from 'react';
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
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../lib/theme';

// Filter funnel icon
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
      {/* Background soft circular glow */}
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

      {/* Bot Body (Blue overalls/chassis) */}
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

      {/* Big Eyes / Glasses */}
      <circle cx="111" cy="74" r="9" fill="#1E293B" />
      <circle cx="111" cy="74" r="7.5" fill="#3B82F6" />
      <circle cx="109" cy="72" r="2.5" fill="#FFFFFF" />

      <circle cx="129" cy="74" r="9" fill="#1E293B" />
      <circle cx="129" cy="74" r="7.5" fill="#3B82F6" />
      <circle cx="127" cy="72" r="2.5" fill="#FFFFFF" />

      {/* Cute glasses bridge */}
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

interface OrgFileItem {
  id: string;
  name: string;
  category: string;
  scopeType: 'Location' | 'Department';
  scopeValue: string;
  size: string;
  uploadedAt: string;
}

export function DocumentsView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Primary top tabs: 'organization' | 'employee' | 'hr-forms' | 'folders'
  const [activeTab, setActiveTab] = useState<'organization' | 'employee' | 'hr-forms' | 'folders'>('organization');

  // Left sidebar scope filter: 'Location' | 'Department'
  const [selectedScope, setSelectedScope] = useState<'Location' | 'Department'>('Location');

  // View mode: 'grid' | 'table' | 'folder'
  const [viewMode, setViewMode] = useState<'table' | 'folder'>('table');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Files data
  const [files, setFiles] = useState<OrgFileItem[]>([]);

  // Add / Upload Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('Company Policies');
  const [newScopeValue, setNewScopeValue] = useState('All');

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newItem: OrgFileItem = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      category: newFileCategory,
      scopeType: selectedScope,
      scopeValue: newScopeValue,
      size: '2.4 MB',
      uploadedAt: new Date().toLocaleDateString(),
    };

    setFiles([newItem, ...files]);
    setIsAddModalOpen(false);
    setNewFileName('');
    showToast(`File "${newItem.name}" added successfully.`);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    showToast('File removed successfully.');
  };

  // Filtered files for current view
  const currentFilteredFiles = files.filter((f) => {
    if (f.scopeType !== selectedScope) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
        <div className="fixed top-18 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold bg-[#187F7A] text-white animate-in fade-in slide-in-from-top-2">
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
          {/* Back Button + Title */}
          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 text-sm font-bold tracking-tight transition cursor-pointer ${
              isDark ? 'text-gray-200 hover:text-white' : 'text-[#0B1730] hover:text-[#187F7A]'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Files</span>
          </button>

          {/* Nav Tabs */}
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
            onClick={() => setIsAddModalOpen(true)}
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

      {/* Optional Search Bar Overlay */}
      {isSearchOpen && (
        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? 'bg-[#0E1624] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files by name..."
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
      {/* SUB-HEADER TOOLBAR (RIGHT-ALIGNED ACTION CONTROLS)                         */}
      {/* ========================================================================= */}
      <div className="px-6 py-2.5 flex items-center justify-end gap-2">
        {/* Toggle List/Grid & Folder View */}
        <div
          className={`flex items-center rounded-md border p-0.5 ${
            isDark ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={() => setViewMode('table')}
            title="List/Table View"
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'table'
                ? isDark
                  ? 'bg-blue-600/30 text-blue-400'
                  : 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('folder')}
            title="Folder View"
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'folder'
                ? isDark
                  ? 'bg-blue-600/30 text-blue-400'
                  : 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Folder className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Funnel Filter */}
        <button
          title="Filter"
          className={`p-1.5 rounded-md border transition cursor-pointer ${
            isDark ? 'bg-[#111827] border-gray-800 text-gray-400 hover:text-gray-200' : 'bg-white border-slate-200 text-gray-500 hover:text-gray-800'
          }`}
        >
          <FilterTaperedIcon className="h-3.5 w-3.5" />
        </button>

        {/* More Options */}
        <button
          title="More options"
          className={`p-1.5 rounded-md border transition cursor-pointer ${
            isDark ? 'bg-[#111827] border-gray-800 text-gray-400 hover:text-gray-200' : 'bg-white border-slate-200 text-gray-500 hover:text-gray-800'
          }`}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: LEFT SCOPE PILLS + CENTER CONTENT AREA                    */}
      {/* ========================================================================= */}
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

        {/* Center Content Workspace */}
        <div
          className={`flex-1 rounded-2xl border flex flex-col items-center justify-center p-8 transition-colors ${
            isDark ? 'bg-[#0E1624] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
          }`}
        >
          {currentFilteredFiles.length === 0 ? (
            /* EMPTY STATE WITH MASCOT (MATCHING REFERENCE IMAGE EXACTLY) */
            <div className="max-w-md w-full flex flex-col items-center text-center">
              {/* Mascot Illustration */}
              <div className="mb-4">
                <MascotBotIllustration className="w-56 h-40" />
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-[#0B1730] dark:text-white mb-2">
                No organization file added
              </h2>

              {/* Subtitle */}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Upload important common files such as policies or company handbooks that can be shared across the entire organization or for selected business entities, locations, departments, etc.
              </p>

              {/* Action Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm transition cursor-pointer"
              >
                Add Organization Files
              </button>
            </div>
          ) : (
            /* POPULATED FILES VIEW */
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {selectedScope}: {currentFilteredFiles.length} Files Added
                </span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
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
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Scope Target</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Added Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {currentFilteredFiles.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                        <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#0284C7]" />
                          <span>{f.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-500">{f.category}</td>
                        <td className="py-2.5 px-3 text-gray-500">{f.scopeValue}</td>
                        <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.size}</td>
                        <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">{f.uploadedAt}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteFile(f.id)}
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

      {/* ========================================================================= */}
      {/* MODAL: ADD / UPLOAD ORGANIZATION FILE                                     */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
              <h3 className="text-sm font-bold">Add Organization Files</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                  File Name / Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Employee Handbook 2026"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                >
                  <option value="Company Policies">Company Policies</option>
                  <option value="Employee Handbooks">Employee Handbooks</option>
                  <option value="Statutory Forms">Statutory Forms</option>
                  <option value="Benefits & Healthcare">Benefits & Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">
                  Target {selectedScope}
                </label>
                <select
                  value={newScopeValue}
                  onChange={(e) => setNewScopeValue(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold ${
                    isDark ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-[#0B1730]'
                  }`}
                >
                  <option value="All">All {selectedScope}s</option>
                  {selectedScope === 'Location' ? (
                    <>
                      <option value="Bangalore HQ">Bangalore HQ</option>
                      <option value="Chennai Campus">Chennai Campus</option>
                      <option value="Hyderabad Center">Hyderabad Center</option>
                    </>
                  ) : (
                    <>
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                    </>
                  )}
                </select>
              </div>

              <div
                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer ${
                  isDark ? 'border-gray-700 bg-gray-800/40' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <Upload className="h-5 w-5 text-[#0284C7] mb-1" />
                <span className="font-semibold text-[11px]">Click or drag files to upload</span>
                <span className="text-[10px] text-gray-400">PDF, DOCX, PNG up to 15MB</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border text-gray-500 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
