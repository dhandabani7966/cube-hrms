import React, { useState, useEffect, useMemo } from 'react';
import {
  LifeBuoy,
  Search,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Send,
  Lock,
  Sparkles,
  User,
  Briefcase,
  Settings,
  Paperclip,
  FileText,
  RefreshCw,
  Check,
  X,
  Star,
  Flame,
  ArrowRight,
  Info,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Table,
  Columns,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useTheme } from '../../lib/theme';

// ─── 3 max-to-min horizontal lines funnel filter icon (CubeAI standard) ───
const FilterTaperedIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <rect x="2" y="3.5" width="12" height="1.8" rx="0.9" />
    <rect x="4.5" y="7.5" width="7" height="1.8" rx="0.9" />
    <rect x="7" y="11.5" width="2" height="1.8" rx="0.9" />
  </svg>
);

interface EmployeeMeta {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  work_email: string;
  mobile_phone?: string;
  photo?: string;
  department?: string;
  designation?: string;
  location?: string;
  joining_date?: string;
  reporting_manager_name?: string;
}

interface CaseCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  parent_category_id: string | null;
  subcategories: string[];
  default_assignee_id: string | null;
  default_assignee_name?: string;
  default_sla_hours: number;
  restrict_priority_field: boolean;
  is_active: boolean;
  is_confidential: boolean;
}

interface CaseMessage {
  id: string;
  case_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  sender_avatar?: string | null;
  message_body: string;
  is_internal_note: boolean;
  is_system_activity: boolean;
  attachment_urls: string[];
  created_at: string;
}

interface CaseItem {
  id: string;
  ticket_number: string;
  requester_id: string;
  category_id: string;
  sub_category?: string | null;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_EMPLOYEE' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  assigned_agent_id: string | null;
  assigned_team?: string | null;
  sla_due_at: string;
  first_responded_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  resolution_summary?: string | null;
  satisfaction_rating?: number | null;
  satisfaction_feedback?: string | null;
  created_at: string;
  updated_at: string;
  requester?: EmployeeMeta | null;
  assigned_agent?: EmployeeMeta | null;
  category?: CaseCategory | null;
  message_count?: number;
  last_message?: CaseMessage | null;
  sla_remaining_hours?: number;
  sla_status?: string;
  messages?: CaseMessage[];
  delegation?: {
    is_delegated: boolean;
    delegatee_id: string;
    delegatee_name: string;
    reason: string;
  } | null;
  leave_context?: {
    balances: Array<{ type: string; total: number; used: number; remaining: number; accrual_rate?: string }>;
    attendance_summary: {
      pay_period: string;
      present_days: number;
      wfh_days: number;
      leave_days: number;
      missed_punches: number;
      regularization_status: string;
    };
  } | null;
  payroll_context?: {
    monthly_gross: number;
    net_payable: number;
    tds_withheld: number;
    loss_of_pay_days: number;
    loss_of_pay_deductions: number;
    lop_log_url: string;
    form_16_status: string;
  } | null;
  ai_recommendations?: Array<{
    id: string;
    title: string;
    category: string;
    read_time: string;
    relevance_score: string;
    excerpt: string;
    canned_reply: string;
  }>;
}

interface SlaPolicy {
  id: string;
  category_id: string;
  category_name?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  response_time_hours: number;
  resolution_time_hours: number;
  escalation_manager_id: string;
  escalation_manager_name?: string;
  business_hours_only: boolean;
}

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  read_time: string;
  excerpt: string;
  key_terms: string[];
}

export function CasesView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Navigation View State: 'operations' | 'my-cases' | 'settings'
  const [activeTab, setActiveTab] = useState<'operations' | 'my-cases' | 'settings'>(() => {
    const path = window.location.pathname;
    if (path.includes('my-cases')) return 'my-cases';
    if (path.includes('settings')) return 'settings';
    return 'operations';
  });

  // Operations Layout Mode: 'split' (Split Workspace) | 'table' (Full Table View)
  const [opsLayoutMode, setOpsLayoutMode] = useState<'split' | 'table'>('split');
  const [isFullView, setIsFullView] = useState(false);

  // Data states
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [categories, setCategories] = useState<CaseCategory[]>([]);
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [knowledgeLastIndexed, setKnowledgeLastIndexed] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Operations View Filters & Selection
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'sla_due_at' | 'priority' | 'created_at'>('created_at');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<CaseItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);

  // Composer State
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [composerAttachments, setComposerAttachments] = useState<string[]>([]);
  const [sendingReply, setSendingReply] = useState(false);

  // Resolution Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionSummaryInput, setResolutionSummaryInput] = useState('');

  // Rating Modal State (for employee)
  const [ratingCaseId, setRatingCaseId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Raise Ticket Modal State
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [raiseCategory, setRaiseCategory] = useState('');
  const [raiseSubCategory, setRaiseSubCategory] = useState('');
  const [raiseSubject, setRaiseSubject] = useState('');
  const [raiseDescription, setRaiseDescription] = useState('');
  const [raisePriority, setRaisePriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [raiseAttachments, setRaiseAttachments] = useState<string[]>([]);
  const [liveSuggestedArticles, setLiveSuggestedArticles] = useState<any[]>([]);
  const [submittingCase, setSubmittingCase] = useState(false);

  // Settings Sub-Tab State
  const [settingsSubTab, setSettingsSubTab] = useState<'categories' | 'sla' | 'knowledge'>('categories');
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatSla, setNewCatSla] = useState(24);
  const [newCatRestrictPrio, setNewCatRestrictPrio] = useState(false);
  const [newCatSubcategories, setNewCatSubcategories] = useState('');
  const [escalationResult, setEscalationResult] = useState<string | null>(null);
  const [isReindexing, setIsReindexing] = useState(false);

  // Toolbar Menus
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);

  // Sync URL
  const switchTab = (tab: 'operations' | 'my-cases' | 'settings') => {
    setActiveTab(tab);
    window.history.pushState({}, '', `/cases/${tab}`);
  };

  // Load All Core Data
  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [casesRes, catsRes, slaRes, kbRes] = await Promise.all([
        apiFetch<CaseItem[]>('/cases'),
        apiFetch<CaseCategory[]>('/cases/categories'),
        apiFetch<SlaPolicy[]>('/cases/sla-policies'),
        apiFetch<any>('/cases/knowledge-status'),
      ]);

      setCases(casesRes || []);
      setCategories(catsRes || []);
      setSlaPolicies(slaRes || []);
      if (kbRes) {
        setKnowledgeDocs(kbRes.indexed_policies || []);
        setKnowledgeLastIndexed(kbRes.last_indexed_at || '');
      }

      // Default select first case if none selected
      if (!selectedCaseId && casesRes && casesRes.length > 0) {
        setSelectedCaseId(casesRes[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load helpdesk data:', err);
      setErrorMsg(err?.message || 'Could not connect to Help Desk service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch Full Case Detail when selected
  useEffect(() => {
    if (!selectedCaseId) {
      setSelectedCaseDetail(null);
      return;
    }
    let isCancelled = false;
    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const detail = await apiFetch<CaseItem>(`/cases/${selectedCaseId}`);
        if (!isCancelled) {
          setSelectedCaseDetail(detail);
        }
      } catch (err) {
        console.error('Failed to load case detail:', err);
      } finally {
        if (!isCancelled) setDetailLoading(false);
      }
    };
    fetchDetail();
    return () => {
      isCancelled = true;
    };
  }, [selectedCaseId]);

  // Live Article Suggestions when typing in Raise Modal
  useEffect(() => {
    if (!raiseSubject || raiseSubject.length < 3) {
      setLiveSuggestedArticles([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const recs = await apiFetch<any[]>(`/cases/recommendations?query=${encodeURIComponent(raiseSubject)}`);
        setLiveSuggestedArticles(recs || []);
      } catch (err) {
        console.warn('Failed to fetch recommendations:', err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [raiseSubject]);

  // Filtered Cases for Operations View
  const filteredOperationsCases = useMemo(() => {
    return cases.filter((c) => {
      // Queue Filter
      if (selectedQueue === 'unassigned' && c.assigned_agent_id) return false;
      if (selectedQueue === 'waiting_on_employee' && c.status !== 'WAITING_ON_EMPLOYEE') return false;
      if (selectedQueue === 'sla_approaching') {
        if (['RESOLVED', 'CLOSED'].includes(c.status)) return false;
        if ((c.sla_remaining_hours || 0) > 4 || (c.sla_remaining_hours || 0) < 0) return false;
      }
      if (selectedQueue === 'resolved' && !['RESOLVED', 'CLOSED'].includes(c.status)) return false;

      // Category Filter
      if (selectedCategoryFilter !== 'all' && c.category_id !== selectedCategoryFilter) return false;

      // Priority Filter
      if (selectedPriorityFilter !== 'all' && c.priority !== selectedPriorityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = c.ticket_number.toLowerCase().includes(q);
        const matchesSubj = c.subject.toLowerCase().includes(q);
        const matchesReq = c.requester
          ? `${c.requester.first_name} ${c.requester.last_name}`.toLowerCase().includes(q) ||
            c.requester.work_email?.toLowerCase().includes(q)
          : false;
        if (!matchesNum && !matchesSubj && !matchesReq) return false;
      }

      return true;
    });
  }, [cases, selectedQueue, selectedCategoryFilter, selectedPriorityFilter, searchQuery]);

  // Sorted Operations Cases
  const sortedOperationsCases = useMemo(() => {
    const list = [...filteredOperationsCases];
    if (sortBy === 'sla_due_at') {
      list.sort((a, b) => new Date(a.sla_due_at).getTime() - new Date(b.sla_due_at).getTime());
    } else if (sortBy === 'priority') {
      const weights: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return list;
  }, [filteredOperationsCases, sortBy]);

  // Employee's My Cases
  const myCasesList = useMemo(() => {
    return cases.filter((c) => c.requester_id === 'e-11111111-1111-1111-1111-111111111113');
  }, [cases]);

  // Queue Counts
  const queueCounts = useMemo(() => {
    const unassigned = cases.filter((c) => !c.assigned_agent_id).length;
    const waiting = cases.filter((c) => c.status === 'WAITING_ON_EMPLOYEE').length;
    const slaApproaching = cases.filter(
      (c) => !['RESOLVED', 'CLOSED'].includes(c.status) && (c.sla_remaining_hours || 0) <= 4 && (c.sla_remaining_hours || 0) >= 0,
    ).length;
    const resolved = cases.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
    return {
      all: cases.length,
      unassigned,
      waiting_on_employee: waiting,
      sla_approaching: slaApproaching,
      resolved,
    };
  }, [cases]);

  // Handle Send Reply (Agent or Employee)
  const handleSendMessage = async () => {
    if (!selectedCaseId || !replyText.trim()) return;
    setSendingReply(true);
    try {
      await apiFetch(`/cases/${selectedCaseId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          message_body: replyText.trim(),
          is_internal_note: isInternalNote,
          attachment_urls: composerAttachments,
        }),
      });

      setReplyText('');
      setComposerAttachments([]);
      const updated = await apiFetch<CaseItem>(`/cases/${selectedCaseId}`);
      setSelectedCaseDetail(updated);
      const casesRes = await apiFetch<CaseItem[]>('/cases');
      setCases(casesRes || []);
    } catch (err: any) {
      alert(`Failed to post message: ${err?.message || 'Network error'}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Handle Quick Property Update
  const handleUpdateCaseProperty = async (field: 'status' | 'priority' | 'assigned_agent_id' | 'category_id', value: any) => {
    if (!selectedCaseId) return;
    try {
      const updated = await apiFetch<CaseItem>(`/cases/${selectedCaseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value }),
      });
      setSelectedCaseDetail(updated);
      const casesRes = await apiFetch<CaseItem[]>('/cases');
      setCases(casesRes || []);
    } catch (err: any) {
      alert(`Failed to update ticket: ${err?.message || 'Error'}`);
    }
  };

  // Handle Resolve Case
  const handleConfirmResolve = async () => {
    if (!selectedCaseId) return;
    try {
      await apiFetch(`/cases/${selectedCaseId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          resolutionSummary: resolutionSummaryInput.trim() || 'Issue resolved and verified.',
          agentName: 'Priya Natarajan (HR Specialist)',
        }),
      });
      setIsResolveModalOpen(false);
      setResolutionSummaryInput('');
      const updated = await apiFetch<CaseItem>(`/cases/${selectedCaseId}`);
      setSelectedCaseDetail(updated);
      const casesRes = await apiFetch<CaseItem[]>('/cases');
      setCases(casesRes || []);
    } catch (err: any) {
      alert(`Failed to resolve case: ${err?.message || 'Error'}`);
    }
  };

  // Handle Rating Case
  const handleConfirmRating = async () => {
    if (!ratingCaseId) return;
    try {
      await apiFetch(`/cases/${ratingCaseId}/rate`, {
        method: 'POST',
        body: JSON.stringify({
          rating: ratingStars,
          feedback: ratingFeedback.trim(),
        }),
      });
      setRatingCaseId(null);
      setRatingFeedback('');
      loadData();
    } catch (err: any) {
      alert(`Failed to submit feedback: ${err?.message || 'Error'}`);
    }
  };

  // Handle Raise Ticket Submit
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raiseCategory || !raiseSubject.trim() || !raiseDescription.trim()) {
      alert('Please fill in Category, Subject, and Description.');
      return;
    }
    setSubmittingCase(true);
    try {
      const selectedCat = categories.find((c) => c.id === raiseCategory);
      const priorityToUse = selectedCat?.restrict_priority_field ? 'MEDIUM' : raisePriority;

      const created = await apiFetch<CaseItem>('/cases', {
        method: 'POST',
        body: JSON.stringify({
          category_id: raiseCategory,
          sub_category: raiseSubCategory || null,
          subject: raiseSubject.trim(),
          description: raiseDescription.trim(),
          priority: priorityToUse,
          attachment_urls: raiseAttachments,
        }),
      });

      setIsRaiseModalOpen(false);
      setRaiseCategory('');
      setRaiseSubCategory('');
      setRaiseSubject('');
      setRaiseDescription('');
      setRaiseAttachments([]);
      setLiveSuggestedArticles([]);

      await loadData();
      if (created) {
        setSelectedCaseId(created.id);
        setSelectedCaseDetail(created);
        setOpsLayoutMode('split');
      }
    } catch (err: any) {
      alert(`Failed to create ticket: ${err?.message || 'Network error'}`);
    } finally {
      setSubmittingCase(false);
    }
  };

  // Handle Add Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const subcats = newCatSubcategories
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await apiFetch('/cases/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCatName.trim(),
          code: newCatCode.trim() || newCatName.substring(0, 3).toUpperCase(),
          description: newCatDesc.trim(),
          default_sla_hours: newCatSla,
          restrict_priority_field: newCatRestrictPrio,
          subcategories: subcats,
          default_assignee_id: 'e-11111111-1111-1111-1111-111111111114',
        }),
      });

      setIsNewCategoryModalOpen(false);
      setNewCatName('');
      setNewCatCode('');
      setNewCatDesc('');
      setNewCatSubcategories('');
      const updatedCats = await apiFetch<CaseCategory[]>('/cases/categories');
      setCategories(updatedCats || []);
    } catch (err: any) {
      alert(`Failed to create category: ${err?.message || 'Error'}`);
    }
  };

  // Handle Run Escalation Check
  const handleRunEscalation = async () => {
    try {
      const res = await apiFetch<any>('/cases/escalation-check', { method: 'POST' });
      setEscalationResult(`Escalation check completed: ${res.escalated_count} overdue tickets transitioned to ESCALATED.`);
      await loadData();
    } catch (err: any) {
      alert(`Escalation run error: ${err?.message || 'Error'}`);
    }
  };

  // Handle Re-Index Knowledge Hive
  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      const res = await apiFetch<any>('/cases/knowledge-status/reindex', { method: 'POST' });
      setKnowledgeDocs(res.indexed_policies || []);
      setKnowledgeLastIndexed(res.last_indexed_at || '');
    } catch (err: any) {
      alert(`Re-index failed: ${err?.message || 'Error'}`);
    } finally {
      setIsReindexing(false);
    }
  };

  const currentRaiseCategoryObj = categories.find((c) => c.id === raiseCategory);

  return (
    <div className={`flex flex-col flex-1 w-full transition-colors duration-200 ${isDark ? 'text-gray-100' : 'text-[#0B1730]'}`}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NAVIGATION BAR (MATCHING HRMS PLATFORM EXACT THEME)         */}
      {/* ========================================================================= */}
      <div
        className={`px-6 py-1.5 border-b flex items-center justify-between gap-3 transition-colors ${
          isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
        }`}
      >
        {/* Left Side: Module Heading & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className={`text-xs font-bold tracking-tight uppercase ${isDark ? 'text-teal-400' : 'text-[#187F7A]'}`}>
              HR Help Desk & Query Management
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

          {/* Tri-Level Horizontal Tabs */}
          <div className="flex items-center gap-1 shrink-0 text-xs font-medium">
            <button
              onClick={() => switchTab('operations')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 cursor-pointer ${
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
              <span>Operations (Team/HR)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'operations'
                    ? isDark
                      ? 'bg-teal-900/60 text-teal-300'
                      : 'bg-teal-100 text-[#187F7A]'
                    : isDark
                    ? 'bg-slate-800 text-gray-400'
                    : 'bg-slate-100 text-gray-500'
                }`}
              >
                {cases.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('my-cases')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'my-cases'
                  ? isDark
                    ? 'border-teal-400 text-teal-300 font-bold'
                    : 'border-[#187F7A] text-[#187F7A] font-bold'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>My Cases (Self)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'my-cases'
                    ? isDark
                      ? 'bg-teal-900/60 text-teal-300'
                      : 'bg-teal-100 text-[#187F7A]'
                    : isDark
                    ? 'bg-slate-800 text-gray-400'
                    : 'bg-slate-100 text-gray-500'
                }`}
              >
                {myCasesList.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 cursor-pointer ${
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
              <span>Settings (Admin)</span>
            </button>
          </div>
        </div>

        {/* Right Side Tools: Search & New Ticket Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`relative flex items-center rounded-lg border transition ${
              isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-slate-50 border-[#D9E2F2]'
            }`}
          >
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-32 lg:w-44 pl-8 pr-7 py-1 text-xs bg-transparent focus:outline-none transition-all ${
                isDark ? 'text-gray-100 placeholder-gray-500' : 'text-[#1B2D32] placeholder-gray-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (categories.length > 0 && !raiseCategory) setRaiseCategory(categories[0].id);
              setIsRaiseModalOpen(true);
            }}
            className="h-7 px-2.5 rounded-lg bg-[#187F7A] hover:bg-[#146A66] flex items-center justify-center text-white transition shadow-sm cursor-pointer"
            title="Raise New Case"
            aria-label="Raise New Case"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error / Sync Notification */}
      {errorMsg && (
        <div className="mx-6 mt-3 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading && (
        <div className="mx-6 mt-2 flex items-center gap-2 text-xs text-[#187F7A] dark:text-teal-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Connecting to Help Desk & Cases services...</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB 1: OPERATIONS CONSOLE (CLEAN, PROPERLY ORDERED ENTERPRISE LAYOUT)   */}
      {/* ========================================================================= */}
      {activeTab === 'operations' && (
        <div className="flex flex-col flex-1 px-6 space-y-3 pt-3">
          {/* Subheader Clean Toolbar (Single Sleek Row) */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0B1730]'}`}>
                <Briefcase className="w-4 h-4 text-[#187F7A]" />
                <span>
                  {selectedQueue === 'all'
                    ? 'All Cases'
                    : selectedQueue === 'unassigned'
                    ? 'Unassigned Cases'
                    : selectedQueue === 'waiting_on_employee'
                    ? 'Waiting on Employee'
                    : selectedQueue === 'sla_approaching'
                    ? 'SLA Approaching (< 4h)'
                    : 'Resolved / Closed'}
                </span>
                <span className="text-xs font-normal text-gray-400">
                  ({sortedOperationsCases.length} {sortedOperationsCases.length === 1 ? 'case' : 'cases'})
                </span>
              </h2>
            </div>

            {/* Right Controls: Priority Filter, Mode Switcher, Full View, More */}
            <div className="flex items-center gap-2">
              {/* Priority Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400 hidden sm:flex items-center gap-1">
                  <FilterTaperedIcon className="w-3.5 h-3.5 text-gray-400" />
                  Priority:
                </span>
                <select
                  value={selectedPriorityFilter}
                  onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                  className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium cursor-pointer transition ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Layout Mode Toggle: Split Workspace vs Table */}
              <div
                className={`flex items-center rounded-lg border p-0.5 ${
                  isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                <button
                  onClick={() => setOpsLayoutMode('split')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition cursor-pointer ${
                    opsLayoutMode === 'split'
                      ? isDark
                        ? 'bg-teal-900/60 text-teal-300 font-semibold'
                        : 'bg-teal-50 text-[#187F7A] font-semibold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Split Workspace Mode"
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">Split</span>
                </button>
                <button
                  onClick={() => setOpsLayoutMode('table')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition cursor-pointer ${
                    opsLayoutMode === 'table'
                      ? isDark
                        ? 'bg-teal-900/60 text-teal-300 font-semibold'
                        : 'bg-teal-50 text-[#187F7A] font-semibold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Full Table View"
                >
                  <Table className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">Table</span>
                </button>
              </div>

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

              {/* Three Dots More Actions */}
              <div className="relative" data-dropdown="threeDots">
                <button
                  onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-gray-400 hover:text-white' : 'bg-white border-[#CBD5E1] text-[#5E7174] hover:text-[#0B1730]'
                  }`}
                  title="More Actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {isThreeDotsOpen && (
                  <div
                    className={`absolute right-0 mt-1 w-48 rounded-lg border shadow-xl py-1 z-30 text-xs ${
                      isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#CBD5E1]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        handleRunEscalation();
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#334155] cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Run SLA Escalation Scan</span>
                    </button>
                    <button
                      onClick={() => {
                        handleReindex();
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#334155] cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Re-index Knowledge Hive</span>
                    </button>
                    <button
                      onClick={() => {
                        loadData();
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#334155] cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                      <span>Refresh Tickets</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYOUT A: SPLIT WORKSPACE (3 CLEAN COLUMNS: QUEUES + TICKETS + WORKSPACE) */}
          {/* ========================================================================= */}
          {opsLayoutMode === 'split' && (
            <div className={`flex gap-4 ${isFullView ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-175px)] min-h-[640px]'}`}>
              {/* PANE 1: LEFT SIDEBAR (QUEUES & CATEGORIES) */}
              <div
                className={`w-44 shrink-0 rounded-xl border flex flex-col p-2.5 shadow-sm overflow-y-auto ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                {/* 1. Queues Section */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1.5">
                    Ticket Queues
                  </span>
                  {[
                    { id: 'all', label: 'All Cases', count: queueCounts.all },
                    { id: 'unassigned', label: 'Unassigned', count: queueCounts.unassigned },
                    { id: 'waiting_on_employee', label: 'Waiting on Employee', count: queueCounts.waiting_on_employee },
                    { id: 'sla_approaching', label: 'SLA Approaching', count: queueCounts.sla_approaching },
                    { id: 'resolved', label: 'Resolved / Closed', count: queueCounts.resolved },
                  ].map((q) => {
                    const isSelected = selectedQueue === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQueue(q.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-teal-950/80 text-teal-300 border border-teal-800'
                              : 'bg-teal-50 text-[#187F7A] border border-teal-200'
                            : isDark
                            ? 'text-gray-300 hover:bg-[#1E293B]'
                            : 'text-gray-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{q.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? isDark
                                ? 'bg-teal-900/60 text-teal-300'
                                : 'bg-teal-100 text-[#187F7A]'
                              : isDark
                              ? 'bg-slate-800 text-gray-400'
                              : 'bg-slate-100 text-gray-500'
                          }`}
                        >
                          {q.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Categories Section */}
                <div className="space-y-1 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1.5">
                    Categories
                  </span>
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-medium ${
                      selectedCategoryFilter === 'all'
                        ? isDark
                          ? 'bg-teal-950/80 text-teal-300 font-bold border border-teal-800'
                          : 'bg-teal-50 text-[#187F7A] font-bold border border-teal-200'
                        : isDark
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1E293B]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
                    }`}
                  >
                    All Categories ({cases.length})
                  </button>
                  {categories.map((cat) => {
                    const isCatSelected = selectedCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer truncate ${
                          isCatSelected
                            ? isDark
                              ? 'bg-teal-950/80 text-teal-300 font-bold border border-teal-800'
                              : 'bg-teal-50 text-[#187F7A] font-bold border border-teal-200'
                            : isDark
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1E293B]'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
                        }`}
                        title={cat.name}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PANE 2: MIDDLE TICKETS LIST (WIDTH 260PX) */}
              <div
                className={`w-64 shrink-0 rounded-xl border flex flex-col shadow-sm overflow-hidden ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                {/* Search & Sort inside List */}
                <div
                  className={`p-3 border-b flex items-center justify-between text-xs ${
                    isDark ? 'bg-[#1E293B]/40 border-[#1E293B]' : 'bg-slate-50 border-[#E2E8F0]'
                  }`}
                >
                  <span className="font-semibold text-[#5E7174] dark:text-gray-400">
                    {sortedOperationsCases.length} Tickets Found
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className={`text-xs bg-transparent border-none font-semibold cursor-pointer focus:outline-none ${
                        isDark ? 'text-gray-200' : 'text-[#0B1730]'
                      }`}
                    >
                      <option value="created_at">Newest First</option>
                      <option value="sla_due_at">SLA Target</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                </div>

                {/* Tickets Master Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {sortedOperationsCases.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">
                      No cases found matching your selected queue or filters.
                    </div>
                  ) : (
                    sortedOperationsCases.map((c) => {
                      const isSelected = selectedCaseId === c.id;
                      const reqName = c.requester ? `${c.requester.first_name} ${c.requester.last_name}` : 'Unknown';
                      const hoursLeft = c.sla_remaining_hours || 0;
                      const isBreached = hoursLeft < 0 || c.status === 'ESCALATED';
                      const isApproaching = hoursLeft <= 4 && hoursLeft >= 0 && !['RESOLVED', 'CLOSED'].includes(c.status);

                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCaseId(c.id)}
                          className={`p-3 cursor-pointer transition-all border-l-4 ${
                            isSelected
                              ? isDark
                                ? 'bg-teal-950/40 border-l-teal-400'
                                : 'bg-teal-50/80 border-l-[#187F7A]'
                              : isDark
                              ? 'border-l-transparent hover:bg-[#1E293B]/40'
                              : 'border-l-transparent hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#187F7A] dark:text-teal-400">
                              {c.ticket_number}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Priority Badge */}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  c.priority === 'URGENT'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                    : c.priority === 'HIGH'
                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                                    : c.priority === 'MEDIUM'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {c.priority}
                              </span>

                              {/* Status Pill */}
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                                  ['RESOLVED', 'CLOSED'].includes(c.status)
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : c.status === 'ESCALATED'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                                    : c.status === 'WAITING_ON_EMPLOYEE'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {c.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <h4
                            className={`text-xs font-semibold line-clamp-1 mb-1.5 ${
                              isDark ? 'text-gray-100' : 'text-[#0B1730]'
                            }`}
                          >
                            {c.subject}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-[#5E7174] dark:text-gray-400">
                            <span className="flex items-center gap-1.5 truncate">
                              {c.requester?.photo ? (
                                <img src={c.requester.photo} alt={reqName} className="w-4 h-4 rounded-full object-cover" />
                              ) : (
                                <User className="w-3.5 h-3.5" />
                              )}
                              <span className="truncate">{reqName}</span>
                            </span>

                            {['RESOLVED', 'CLOSED'].includes(c.status) ? (
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Done
                              </span>
                            ) : isBreached ? (
                              <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950 px-1 py-0.2 rounded flex items-center gap-1 animate-pulse">
                                <Flame className="w-2.5 h-2.5" /> Overdue
                              </span>
                            ) : isApproaching ? (
                              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1 py-0.2 rounded flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {hoursLeft}h left
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {hoursLeft}h
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* PANE 3: TRIAGE WORKSPACE (DIVIDED INTO CHAT & RESOLUTION 65% + INTELLIGENCE SIDEBAR 35%) */}
              <div
                className={`flex-1 min-w-0 rounded-xl border flex flex-col shadow-sm overflow-hidden ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                {!selectedCaseDetail ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                    <LifeBuoy className="w-12 h-12 stroke-[1.2] mb-3 text-gray-300 dark:text-gray-700" />
                    <h3 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Select a Case Ticket</h3>
                    <p className="text-xs max-w-sm">Choose a ticket from the left queue to open the triage workspace.</p>
                  </div>
                ) : detailLoading ? (
                  <div className="flex-1 flex items-center justify-center p-8 text-xs text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#187F7A]" /> Loading ticket data...
                  </div>
                ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Top Case Action Header Bar */}
                    <div
                      className={`p-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
                        isDark ? 'bg-[#1E293B]/60 border-[#1E293B]' : 'bg-slate-50/80 border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#187F7A] dark:text-teal-400">
                          {selectedCaseDetail.ticket_number}
                        </span>
                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                        <h2
                          className={`text-xs sm:text-sm font-bold truncate max-w-md ${
                            isDark ? 'text-gray-100' : 'text-[#0B1730]'
                          }`}
                        >
                          {selectedCaseDetail.subject}
                        </h2>
                      </div>

                      {/* Controls on Top Bar: Status / Priority / Assignee */}
                      <div className="flex items-center gap-2">
                        {/* Status Select */}
                        <select
                          value={selectedCaseDetail.status}
                          onChange={(e) => handleUpdateCaseProperty('status', e.target.value)}
                          className={`text-xs py-1 px-2 rounded-md border font-medium ${
                            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                          }`}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="WAITING_ON_EMPLOYEE">Waiting Employee</option>
                          <option value="ESCALATED">Escalated</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>

                        {/* Priority Select */}
                        <select
                          value={selectedCaseDetail.priority}
                          onChange={(e) => handleUpdateCaseProperty('priority', e.target.value)}
                          className={`text-xs py-1 px-2 rounded-md border font-medium ${
                            isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                          }`}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </select>

                        {/* SLA Countdown Chip */}
                        <span
                          className={`text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                            ['RESOLVED', 'CLOSED'].includes(selectedCaseDetail.status)
                              ? 'bg-emerald-100 text-emerald-800'
                              : (selectedCaseDetail.sla_remaining_hours || 0) < 0
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : (selectedCaseDetail.sla_remaining_hours || 0) <= 4
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-50 text-[#187F7A] border border-teal-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {selectedCaseDetail.sla_remaining_hours !== undefined
                              ? selectedCaseDetail.sla_remaining_hours > 0
                                ? `${selectedCaseDetail.sla_remaining_hours}h SLA`
                                : `Breached by ${Math.abs(selectedCaseDetail.sla_remaining_hours)}h`
                              : '24h'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Compact Requester & AI Info Bar */}
                    <div
                      className={`p-3 border-b grid grid-cols-1 md:grid-cols-2 gap-3 text-xs min-w-0 overflow-hidden shrink-0 ${
                        isDark ? 'bg-[#1E293B]/20 border-[#1E293B]' : 'bg-slate-50/50 border-[#E2E8F0]'
                      }`}
                    >
                      {/* 1. Requester 360 Profile Summary */}
                      {selectedCaseDetail.requester && (
                        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                          <img
                            src={selectedCaseDetail.requester.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs truncate">
                                {selectedCaseDetail.requester.first_name} {selectedCaseDetail.requester.last_name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                ({selectedCaseDetail.requester.employee_code})
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-gray-500 font-medium">
                                {selectedCaseDetail.requester.department}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400 truncate mt-0.5">
                              Role: {selectedCaseDetail.requester.designation} • Mgr: {selectedCaseDetail.requester.reporting_manager_name}
                            </div>
                            <span className="sr-only">Requester 360° Profile</span>
                          </div>
                        </div>
                      )}

                      {/* 2. Cube AI Recommendation Strip */}
                      {selectedCaseDetail.ai_recommendations && selectedCaseDetail.ai_recommendations.length > 0 && (
                        <div className="flex items-center justify-between gap-2 min-w-0 p-2 rounded-lg bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-[#187F7A] dark:text-teal-400 flex items-center gap-1 truncate">
                              <Sparkles className="w-3 h-3 shrink-0" />
                              <span>Cube AI Knowledge Recommendations</span>
                            </span>
                            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium truncate block">
                              {selectedCaseDetail.ai_recommendations[0].title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const rec = selectedCaseDetail.ai_recommendations![0];
                              setReplyText((prev) => (prev ? `${prev}\n\n${rec.canned_reply}` : rec.canned_reply));
                            }}
                            className="shrink-0 px-2 py-1 bg-[#187F7A] hover:bg-[#146A66] text-white rounded font-semibold text-[10px] shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowRight className="w-2.5 h-2.5" />
                            <span>Insert into Reply Composer</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Middle Section: Full-Width Conversation Timeline & Rich Composer */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Messages Stream */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {selectedCaseDetail.messages?.map((msg) => {
                          if (msg.is_system_activity) {
                            return (
                              <div key={msg.id} className="text-center my-1.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-medium border ${
                                    isDark ? 'bg-[#1E293B] text-gray-300 border-[#334155]' : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {msg.message_body}
                                </span>
                              </div>
                            );
                          }

                          if (msg.is_internal_note) {
                            return (
                              <div
                                key={msg.id}
                                className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-1 text-amber-800 dark:text-amber-200">
                                  <span className="font-semibold flex items-center gap-1 text-[11px]">
                                    <Lock className="w-3 h-3 text-amber-600" />
                                    Internal Note (HR Only) — {msg.sender_name}
                                  </span>
                                  <span className="text-[10px] text-amber-600">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{msg.message_body}</p>
                              </div>
                            );
                          }

                          const isAgent = msg.sender_role === 'HR_ADMIN' || msg.sender_role === 'LINE_MANAGER';

                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-2 max-w-[85%] ${isAgent ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                            >
                              {msg.sender_avatar ? (
                                <img
                                  src={msg.sender_avatar}
                                  alt="avatar"
                                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-[#187F7A] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                                  {msg.sender_name[0]}
                                </div>
                              )}

                              <div
                                className={`p-3 rounded-xl text-xs space-y-1 ${
                                  isAgent
                                    ? 'bg-[#187F7A] text-white rounded-tr-none'
                                    : isDark
                                    ? 'bg-[#1E293B] text-gray-100 rounded-tl-none border border-[#334155]'
                                    : 'bg-slate-100 text-[#0B1730] rounded-tl-none border border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-0.5">
                                  <span className="font-semibold">{msg.sender_name}</span>
                                  <span>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.message_body}</p>

                                {msg.attachment_urls && msg.attachment_urls.length > 0 && (
                                  <div className="pt-1.5 space-y-1">
                                    {msg.attachment_urls.map((url, i) => (
                                      <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                          isAgent
                                            ? 'bg-[#12635F] text-white'
                                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border'
                                        }`}
                                      >
                                        <Paperclip className="w-2.5 h-2.5" />
                                        <span>Attachment {i + 1}</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Docked Rich Composer */}
                      <div
                        className={`p-3 border-t shrink-0 ${
                          isDark ? 'bg-[#1E293B]/40 border-[#1E293B]' : 'bg-slate-50/70 border-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {/* Toggle Public / Internal Note */}
                          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-md text-xs">
                            <button
                              type="button"
                              onClick={() => setIsInternalNote(false)}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-all ${
                                !isInternalNote
                                  ? 'bg-white dark:bg-slate-900 text-[#187F7A] dark:text-teal-400 font-bold shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Public Reply</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsInternalNote(true)}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-all ${
                                isInternalNote
                                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Internal Note</span>
                            </button>
                          </div>

                          {/* Canned Responses Dropdown */}
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                setReplyText((prev) => (prev ? `${prev}\n\n${e.target.value}` : e.target.value));
                              }
                            }}
                            className={`text-xs py-1 px-2 rounded-md border max-w-[150px] truncate ${
                              isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-[#CBD5E1] text-gray-700'
                            }`}
                          >
                            <option value="">Insert Canned Response...</option>
                            <option value="Hi, could you please upload the official supporting documentation to help us complete this verification?">
                              Request supporting documents
                            </option>
                            <option value="We have audited your request and forwarded it to the finance payroll processing desk for this month's run.">
                              Forwarded to payroll desk
                            </option>
                            <option value="Your query has been resolved according to corporate policy. Please reply if you need any further assistance.">
                              Standard resolution closing
                            </option>
                          </select>
                        </div>

                        <textarea
                          rows={3}
                          placeholder={
                            isInternalNote
                              ? 'Type an internal note visible ONLY to HR agents and admins...'
                              : 'Type your message to the employee...'
                          }
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-lg border focus:outline-none transition-all ${
                            isInternalNote
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 placeholder-amber-700/60 focus:ring-1 focus:ring-amber-500'
                              : isDark
                              ? 'bg-[#0B131F] border-[#334155] text-white placeholder-gray-500 focus:ring-1 focus:ring-[#187F7A]'
                              : 'bg-white border-[#CBD5E1] text-[#0B1730] placeholder-gray-400 focus:ring-1 focus:ring-[#187F7A]'
                          }`}
                        />

                        <div className="flex items-center justify-between mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const file = prompt('Enter attachment URL or mock document name:');
                              if (file) setComposerAttachments([...composerAttachments, file]);
                            }}
                            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>Attach File {composerAttachments.length > 0 && `(${composerAttachments.length})`}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {selectedCaseDetail.status !== 'RESOLVED' && (
                              <button
                                type="button"
                                onClick={() => setIsResolveModalOpen(true)}
                                className="px-3 py-1.5 rounded-lg border border-[#187F7A] text-[#187F7A] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-semibold transition-all cursor-pointer"
                              >
                                Resolve Case
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={!replyText.trim() || sendingReply}
                              onClick={handleSendMessage}
                              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all cursor-pointer ${
                                isInternalNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#187F7A] hover:bg-[#146A66]'
                              } disabled:opacity-50`}
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{sendingReply ? 'Sending...' : isInternalNote ? 'Save Note' : 'Send Reply'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT B: FULL TABLE VIEW (MATCHING EMPLOYEES DIRECTORY TABLE)             */}
          {/* ========================================================================= */}
          {opsLayoutMode === 'table' && (
            <div
              className={`rounded-xl border shadow-sm overflow-hidden ${
                isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
              }`}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`border-b font-semibold ${
                    isDark ? 'bg-[#1E293B]/60 border-[#1E293B] text-gray-300' : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1730]'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedTicketIds.length === sortedOperationsCases.length && sortedOperationsCases.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedTicketIds(sortedOperationsCases.map((c) => c.id));
                          else setSelectedTicketIds([]);
                        }}
                      />
                    </th>
                    <th className="py-2.5 px-4">Ticket #</th>
                    <th className="py-2.5 px-4">Requester</th>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">SLA Target</th>
                    <th className="py-2.5 px-4">Assigned Agent</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#1E293B]' : 'divide-slate-100'}`}>
                  {sortedOperationsCases.map((c) => {
                    const reqName = c.requester ? `${c.requester.first_name} ${c.requester.last_name}` : 'Unknown';
                    const isChecked = selectedTicketIds.includes(c.id);
                    const hoursLeft = c.sla_remaining_hours || 0;
                    const isBreached = hoursLeft < 0 || c.status === 'ESCALATED';

                    return (
                      <tr
                        key={c.id}
                        className={`transition cursor-pointer ${
                          isDark ? 'hover:bg-[#1E293B]/40' : 'hover:bg-slate-50'
                        } ${isChecked ? (isDark ? 'bg-teal-950/20' : 'bg-teal-50/40') : ''}`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedTicketIds([...selectedTicketIds, c.id]);
                              else setSelectedTicketIds(selectedTicketIds.filter((id) => id !== c.id));
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#187F7A] dark:text-teal-400">
                          {c.ticket_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {c.requester?.photo ? (
                              <img src={c.requester.photo} alt={reqName} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="font-semibold">{reqName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium max-w-xs truncate">{c.subject}</td>
                        <td className="py-3 px-4 text-gray-500">{c.category?.name || 'General'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              c.priority === 'URGENT'
                                ? 'bg-red-100 text-red-800'
                                : c.priority === 'HIGH'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              ['RESOLVED', 'CLOSED'].includes(c.status)
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'WAITING_ON_EMPLOYEE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isBreached ? (
                            <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                              <Flame className="w-3 h-3" /> Overdue
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {hoursLeft}h
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {c.assigned_agent ? `${c.assigned_agent.first_name} ${c.assigned_agent.last_name}` : 'Unassigned'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedCaseId(c.id);
                              setOpsLayoutMode('split');
                            }}
                            className="px-2.5 py-1 bg-[#187F7A] text-white rounded font-semibold text-[11px] hover:bg-[#146A66]"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Bottom Pagination matching EmployeesView */}
              <div
                className={`p-3 border-t flex items-center justify-between text-xs text-gray-500 ${
                  isDark ? 'bg-[#1E293B]/40 border-[#1E293B]' : 'bg-slate-50 border-[#E2E8F0]'
                }`}
              >
                <span>Total Record Count : {sortedOperationsCases.length}</span>
                <div className="flex items-center gap-3">
                  <span>50 per page</span>
                  <span>&lt; 1 - {sortedOperationsCases.length} &gt;</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: EMPLOYEE SELF-SERVICE VIEW (`/cases/my-cases`)                   */}
      {/* ========================================================================= */}
      {activeTab === 'my-cases' && (
        <div className="flex flex-col flex-1 px-6 space-y-4 pt-3">
          {/* Welcome Banner matching Cube AI Theme */}
          <div className="bg-gradient-to-r from-[#187F7A] to-[#0F4E4A] rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold">My Support Queries & Cases</h2>
              <p className="text-xs text-teal-100 max-w-xl mt-1 leading-relaxed">
                Submit queries directly to HR Operations, track resolution progress in real time, and converse with specialists.
              </p>
            </div>
            <button
              onClick={() => {
                if (categories.length > 0 && !raiseCategory) setRaiseCategory(categories[0].id);
                setIsRaiseModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#187F7A] rounded-lg text-xs font-bold shadow hover:bg-slate-50 transition-all self-start md:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit a Query</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCasesList.length === 0 ? (
              <div
                className={`col-span-full rounded-xl p-12 text-center text-gray-400 border ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                <LifeBuoy className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">No Cases Raised Yet</h4>
                <p className="text-xs mt-1">Have a payroll, leave, or benefits question? Click "Submit a Query" above.</p>
              </div>
            ) : (
              myCasesList.map((c) => {
                const isResolved = ['RESOLVED', 'CLOSED'].includes(c.status);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
                      isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-[#187F7A] dark:text-teal-400">
                          {c.ticket_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'WAITING_ON_EMPLOYEE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold mb-1.5 line-clamp-2">{c.subject}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-gray-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Category:</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{c.category?.name || 'General'}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            switchTab('operations');
                            setOpsLayoutMode('split');
                          }}
                          className="text-xs font-semibold text-[#187F7A] dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Thread ({c.message_count || 1})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {isResolved && !c.satisfaction_rating && (
                          <button
                            onClick={() => {
                              setRatingCaseId(c.id);
                              setRatingStars(5);
                            }}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-semibold hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>Rate Service</span>
                          </button>
                        )}

                        {c.satisfaction_rating && (
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                            <Star className="w-3 h-3 fill-amber-500" /> {c.satisfaction_rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: SETTINGS (ADMIN & POLICIES)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="flex flex-col flex-1 px-6 space-y-4 pt-3">
          {/* Subheader Toolbar */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setSettingsSubTab('categories')}
              className={`pb-2 transition-all cursor-pointer ${
                settingsSubTab === 'categories'
                  ? 'border-b-2 border-[#187F7A] text-[#187F7A] dark:text-teal-400 font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Tab 1: Categories & Routing ({categories.length})
            </button>

            <button
              onClick={() => setSettingsSubTab('sla')}
              className={`pb-2 transition-all cursor-pointer ${
                settingsSubTab === 'sla'
                  ? 'border-b-2 border-[#187F7A] text-[#187F7A] dark:text-teal-400 font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Tab 2: SLA & Escalation Policies ({slaPolicies.length})
            </button>

            <button
              onClick={() => setSettingsSubTab('knowledge')}
              className={`pb-2 transition-all cursor-pointer ${
                settingsSubTab === 'knowledge'
                  ? 'border-b-2 border-[#187F7A] text-[#187F7A] dark:text-teal-400 font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Tab 3: Knowledge Base Connections ({knowledgeDocs.length})
            </button>
          </div>

          {/* Sub-Tab 1: Categories */}
          {settingsSubTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Category Taxonomy & Auto-Assignment</h3>
                  <p className="text-xs text-gray-500">Define default SLAs and priority restriction flags.</p>
                </div>
                <button
                  onClick={() => setIsNewCategoryModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div
                className={`rounded-xl border shadow-sm overflow-hidden ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b font-semibold ${
                      isDark ? 'bg-[#1E293B]/60 border-[#1E293B] text-gray-300' : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    <tr>
                      <th className="py-2.5 px-4">Code / Category</th>
                      <th className="py-2.5 px-4">Sub-Categories</th>
                      <th className="py-2.5 px-4">Default Agent</th>
                      <th className="py-2.5 px-4">Default SLA</th>
                      <th className="py-2.5 px-4">Priority Lock</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#1E293B]' : 'divide-slate-100'}`}>
                    {categories.map((cat) => (
                      <tr key={cat.id} className={isDark ? 'hover:bg-[#1E293B]/40' : 'hover:bg-slate-50'}>
                        <td className="py-3 px-4">
                          <span className="font-bold block">{cat.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">{cat.code}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cat.subcategories?.slice(0, 3).map((sub, i) => (
                              <span
                                key={i}
                                className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isDark ? 'bg-[#1E293B] text-gray-300' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{cat.default_assignee_name || 'HR Ops'}</td>
                        <td className="py-3 px-4 font-mono font-semibold">{cat.default_sla_hours} hrs</td>
                        <td className="py-3 px-4">
                          {cat.restrict_priority_field ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                              Restricted (Medium)
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">User Chooses</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: SLA Policies */}
          {settingsSubTab === 'sla' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">SLA Matrix & Automated Escalations</h3>
                  <p className="text-xs text-gray-500">Configure response and resolution thresholds per priority.</p>
                </div>
                <button
                  onClick={handleRunEscalation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Run Escalation Check Now</span>
                </button>
              </div>

              {escalationResult && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                  <span>{escalationResult}</span>
                  <button onClick={() => setEscalationResult(null)} className="text-amber-600 font-bold hover:underline">
                    Dismiss
                  </button>
                </div>
              )}

              <div
                className={`rounded-xl border shadow-sm overflow-hidden ${
                  isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b font-semibold ${
                      isDark ? 'bg-[#1E293B]/60 border-[#1E293B] text-gray-300' : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    <tr>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Priority</th>
                      <th className="py-2.5 px-4">First Response</th>
                      <th className="py-2.5 px-4">Resolution Target</th>
                      <th className="py-2.5 px-4">Escalation Manager</th>
                      <th className="py-2.5 px-4">Operating Hours</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#1E293B]' : 'divide-slate-100'}`}>
                    {slaPolicies.map((p) => (
                      <tr key={p.id} className={isDark ? 'hover:bg-[#1E293B]/40' : 'hover:bg-slate-50'}>
                        <td className="py-3 px-4 font-semibold">{p.category_name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              p.priority === 'URGENT'
                                ? 'bg-red-100 text-red-800'
                                : p.priority === 'HIGH'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {p.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{p.response_time_hours} hrs</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#187F7A] dark:text-teal-400">
                          {p.resolution_time_hours} hrs
                        </td>
                        <td className="py-3 px-4 font-medium">{p.escalation_manager_name || 'David Miller'}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {p.business_hours_only ? 'Business Hours (9-18)' : '24x7 Continuous'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Knowledge Base */}
          {settingsSubTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Knowledge Hive & Policy Intelligence</h3>
                  <p className="text-xs text-gray-500">Connected policies for instant semantic suggestions.</p>
                  {knowledgeLastIndexed && (
                    <span className="text-[11px] text-[#187F7A] dark:text-teal-400 font-medium block mt-0.5">
                      Last synchronized: {new Date(knowledgeLastIndexed).toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleReindex}
                  disabled={isReindexing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
                  <span>{isReindexing ? 'Re-Indexing Hive...' : 'Re-Index Knowledge Hive'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`rounded-xl border p-4 shadow-sm text-xs space-y-2 ${
                      isDark ? 'bg-[#0B131F] border-[#1E293B]' : 'bg-white border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#187F7A] dark:text-teal-400">{doc.title}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{doc.read_time}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{doc.excerpt}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.key_terms?.map((term, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-[#1E293B] text-gray-300' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{term}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: RAISE CASE, RESOLVE CASE, RATE CASE, ADD CATEGORY                  */}
      {/* ========================================================================= */}

      {/* MODAL 1: RAISE A CASE */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-[#187F7A]" />
                  Raise New HR Support Case
                </h3>
                <p className="text-xs text-gray-500">Submit your query directly to the designated department.</p>
              </div>
              <button
                onClick={() => setIsRaiseModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Category Dropdown */}
                <div>
                  <label className="font-semibold block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={raiseCategory}
                    onChange={(e) => {
                      setRaiseCategory(e.target.value);
                      setRaiseSubCategory('');
                    }}
                    required
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Dropdown */}
                <div>
                  <label className="font-semibold block mb-1">Sub-Category (Optional)</label>
                  <select
                    value={raiseSubCategory}
                    onChange={(e) => setRaiseSubCategory(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                    }`}
                  >
                    <option value="">Select sub-category...</option>
                    {currentRaiseCategoryObj?.subcategories?.map((sc, i) => (
                      <option key={i} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Field */}
              {!currentRaiseCategoryObj?.restrict_priority_field ? (
                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setRaisePriority(p)}
                        className={`py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                          raisePriority === p
                            ? 'bg-[#187F7A] text-white border-[#187F7A]'
                            : isDark
                            ? 'border-[#334155] text-gray-400 hover:bg-[#1E293B]'
                            : 'border-[#CBD5E1] text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    Priority is governed by category SLA policy: <strong>MEDIUM (24h resolution)</strong>.
                  </span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="font-semibold block mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dependent addition to medical insurance policy"
                  value={raiseSubject}
                  onChange={(e) => setRaiseSubject(e.target.value)}
                  required
                  className={`w-full p-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#187F7A] ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              {/* LIVE SUGGESTED ARTICLES PANEL */}
              {liveSuggestedArticles.length > 0 && (
                <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-[#187F7A] dark:text-teal-300 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cube AI Instant Suggestion: Does this solve your query?
                  </span>
                  {liveSuggestedArticles.slice(0, 1).map((article) => (
                    <div
                      key={article.id}
                      className={`p-2.5 rounded border ${
                        isDark ? 'bg-[#0B131F] border-teal-900' : 'bg-white border-teal-100'
                      }`}
                    >
                      <span className="font-bold block mb-1 text-xs">{article.title}</span>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          alert('Great! Glad the policy helped answer your question.');
                          setIsRaiseModalOpen(false);
                        }}
                        className="px-2.5 py-1 bg-[#187F7A] hover:bg-[#146A66] text-white rounded text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        Yes, this answered my question!
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="font-semibold block mb-1">
                  Query Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide complete context, affected dates, or relevant transaction details..."
                  value={raiseDescription}
                  onChange={(e) => setRaiseDescription(e.target.value)}
                  required
                  className={`w-full p-2.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#187F7A] ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="font-semibold block mb-1">Upload Attachments (Optional)</label>
                <div
                  onClick={() => {
                    const sample = prompt('Enter document name / mock file URL:');
                    if (sample) setRaiseAttachments([...raiseAttachments, sample]);
                  }}
                  className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-[#187F7A] transition-all ${
                    isDark ? 'border-[#334155] text-gray-400' : 'border-slate-300 text-gray-500'
                  }`}
                >
                  <Paperclip className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                  <span className="text-[11px]">Click to add PDF, PNG, JPG attachments</span>
                </div>
                {raiseAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {raiseAttachments.map((f, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 ${
                          isDark ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-slate-100 border-slate-200 text-gray-700'
                        }`}
                      >
                        <FileText className="w-2.5 h-2.5" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRaiseModalOpen(false)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                    isDark ? 'border-[#334155] text-gray-400 hover:bg-[#1E293B]' : 'border-[#CBD5E1] text-gray-600 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCase}
                  className="px-5 py-2 rounded-lg bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submittingCase ? 'Submitting...' : 'Submit Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOLVE CASE SUMMARY */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-xl border max-w-md w-full p-5 shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#187F7A]" />
                Resolve Case Ticket
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Record the final resolution summary for audit and requester notification.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Resolution Summary</label>
              <textarea
                rows={3}
                placeholder="e.g. Verified employee submitted birth certificates and submitted endorsement to health insurance underwriter."
                value={resolutionSummaryInput}
                onChange={(e) => setResolutionSummaryInput(e.target.value)}
                className={`w-full p-2 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-[#187F7A] ${
                  isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold border text-gray-500 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold cursor-pointer"
              >
                Confirm & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RATE SERVICE (EMPLOYEE) */}
      {ratingCaseId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-xl border max-w-sm w-full p-5 shadow-2xl space-y-4 text-center ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <h3 className="text-sm font-bold">Rate HR Service Satisfaction</h3>
            <p className="text-xs text-gray-500">How satisfied were you with the turnaround time and answers provided?</p>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRatingStars(num)}
                  className="p-1 hover:scale-110 transition-all cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      num <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Optional feedback..."
              value={ratingFeedback}
              onChange={(e) => setRatingFeedback(e.target.value)}
              className={`w-full p-2 text-xs rounded border text-center ${
                isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
              }`}
            />

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRatingCaseId(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold border text-gray-500 hover:bg-slate-50 cursor-pointer"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleConfirmRating}
                className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold cursor-pointer"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD CATEGORY (SETTINGS) */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-xl border max-w-md w-full p-5 shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0B131F] border-[#1E293B] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
            }`}
          >
            <h3 className="text-sm font-bold">Add New Case Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Travel & Expensing"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Code</label>
                <input
                  type="text"
                  placeholder="e.g. TRV"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sub-Categories (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Per Diem, Flight Booking, Hotel Vouchers"
                  value={newCatSubcategories}
                  onChange={(e) => setNewCatSubcategories(e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Default SLA Target (Hours)</label>
                <input
                  type="number"
                  value={newCatSla}
                  onChange={(e) => setNewCatSla(Number(e.target.value))}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lockPrio"
                  checked={newCatRestrictPrio}
                  onChange={(e) => setNewCatRestrictPrio(e.target.checked)}
                />
                <label htmlFor="lockPrio">Lock priority on ESS submission (default to MEDIUM)</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded border text-gray-500 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#187F7A] hover:bg-[#146A66] text-white font-semibold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
