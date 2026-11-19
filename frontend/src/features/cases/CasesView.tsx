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
  BookOpen,
  User,
  Briefcase,
  Settings,
  ChevronDown,
  ChevronRight,
  Paperclip,
  FileText,
  RefreshCw,
  TrendingUp,
  Check,
  X,
  Star,
  ExternalLink,
  Calendar,
  Flame,
  ArrowRight,
  Layers,
  Copy,
  Info,
} from 'lucide-react';
import { apiFetch, getCurrentRole } from '../../lib/api';
import type { Role } from '../../lib/api';

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
  // Navigation View State: 'operations' | 'my-cases' | 'settings'
  const [activeTab, setActiveTab] = useState<'operations' | 'my-cases' | 'settings'>(() => {
    const path = window.location.pathname;
    if (path.includes('my-cases')) return 'my-cases';
    if (path.includes('settings')) return 'settings';
    return 'operations';
  });

  const [currentRole] = useState<Role>(getCurrentRole());

  // Data states
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [categories, setCategories] = useState<CaseCategory[]>([]);
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [knowledgeLastIndexed, setKnowledgeLastIndexed] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Operations View Filters
  const [selectedQueue, setSelectedQueue] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'sla_due_at' | 'priority' | 'created_at'>('created_at');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<CaseItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Composer State
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [composerAttachments, setComposerAttachments] = useState<string[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [isAiBoxOpen, setIsAiBoxOpen] = useState(true);

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

      // Default select first case in Operations if none selected
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
    // Current employee is John Doe (EMP-10003, 'e-11111111-1111-1111-1111-111111111113') by default
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

  // Category counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of cases) {
      map[c.category_id] = (map[c.category_id] || 0) + 1;
    }
    return map;
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
      // Reload detail
      const updated = await apiFetch<CaseItem>(`/cases/${selectedCaseId}`);
      setSelectedCaseDetail(updated);
      // Reload list
      const casesRes = await apiFetch<CaseItem[]>('/cases');
      setCases(casesRes || []);
    } catch (err: any) {
      alert(`Failed to post message: ${err?.message || 'Network error'}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Handle Quick Property Update (Status / Priority / Assignee)
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

  // Handle Rating Case (Employee)
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
      }
    } catch (err: any) {
      alert(`Failed to create ticket: ${err?.message || 'Network error'}`);
    } finally {
      setSubmittingCase(false);
    }
  };

  // Handle Add Category (Settings)
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

  // Handle Run Escalation Check Now
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

  // Selected Category Object in Raise Modal
  const currentRaiseCategoryObj = categories.find((c) => c.id === raiseCategory);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & TRI-LEVEL VIEW SWITCHER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                HR Help Desk & Query Management
                <span className="text-xs px-2 py-0.5 font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Cube AI Solutions
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tri-Level Case Operating Engine: Employee ESS, Agent Triage Workspace & Policy Intelligence
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  Active Role: <strong>{currentRole}</strong>
                </span>
                {loading && (
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => switchTab('my-cases')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'my-cases'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Cases (Self)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                {myCasesList.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('operations')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'operations'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Operations (Team/HR)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {cases.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings (Admin)</span>
            </button>
          </div>

          {/* Primary Action Button: Raise New Case */}
          <button
            onClick={() => {
              if (categories.length > 0 && !raiseCategory) {
                setRaiseCategory(categories[0].id);
              }
              setIsRaiseModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Case</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SCREEN 1: OPERATIONS CONSOLE (SPLIT-PANE WORKSPACE) */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-230px)] min-h-[640px]">
          {/* LEFT SIDEBAR: QUEUES & CATEGORY FILTERS (3 Cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Ticket Queues
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {cases.length} Total
                </span>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Cases', count: queueCounts.all, icon: Layers, color: 'text-slate-600' },
                  { id: 'unassigned', label: 'Unassigned', count: queueCounts.unassigned, icon: User, color: 'text-orange-500' },
                  { id: 'waiting_on_employee', label: 'Waiting on Employee', count: queueCounts.waiting_on_employee, icon: Clock, color: 'text-blue-500' },
                  { id: 'sla_approaching', label: 'SLA Approaching (< 4h)', count: queueCounts.sla_approaching, icon: AlertTriangle, color: 'text-amber-500' },
                  { id: 'resolved', label: 'Resolved / Closed', count: queueCounts.resolved, icon: CheckCircle2, color: 'text-emerald-500' },
                ].map((q) => {
                  const Icon = q.icon;
                  const isActive = selectedQueue === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQueue(q.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold border border-emerald-200 dark:border-emerald-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${q.color}`} />
                        <span>{q.label}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        isActive ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {q.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Category Filter Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Categories
                </span>
                {selectedCategoryFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = selectedCategoryFilter === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(isActive ? 'all' : cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-semibold border border-blue-200 dark:border-blue-800'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Priority Filters */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Priority Filter
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => {
                  const isActive = selectedPriorityFilter === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setSelectedPriorityFilter(p)}
                      className={`px-2 py-1 rounded text-[11px] font-medium border text-center transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p === 'all' ? 'All' : p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MIDDLE PANE: TICKET MASTER LIST (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
            {/* Search & Sort Bar */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ticket #, subject, requester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">{sortedOperationsCases.length} Cases Displayed</span>
                <div className="flex items-center gap-1">
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="text-xs bg-transparent border-none text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="created_at">Newest First</option>
                    <option value="sla_due_at">SLA Target Due</option>
                    <option value="priority">Priority Severity</option>
                  </select>
                  <button
                    onClick={() => loadData()}
                    title="Refresh tickets"
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all ml-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* List of Ticket Cards */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {sortedOperationsCases.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No cases found matching your selected queue or filter.
                </div>
              ) : (
                sortedOperationsCases.map((c) => {
                  const isSelected = selectedCaseId === c.id;
                  const reqName = c.requester ? `${c.requester.first_name} ${c.requester.last_name}` : 'Unknown';

                  // Dynamic SLA chip styling
                  const hoursLeft = c.sla_remaining_hours || 0;
                  const isBreached = hoursLeft < 0 || c.status === 'ESCALATED';
                  const isApproaching = hoursLeft <= 4 && hoursLeft >= 0 && !['RESOLVED', 'CLOSED'].includes(c.status);

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-l-emerald-600'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {c.ticket_number}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {/* Priority Badge */}
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
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
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              c.status === 'RESOLVED' || c.status === 'CLOSED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : c.status === 'ESCALATED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                                : c.status === 'WAITING_ON_EMPLOYEE'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Subject */}
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 leading-relaxed">
                        {c.subject}
                      </h4>

                      {/* Requester & SLA footer */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1.5 truncate">
                          {c.requester?.photo ? (
                            <img src={c.requester.photo} alt={reqName} className="w-4 h-4 rounded-full object-cover" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                          <span className="truncate">{reqName}</span>
                        </span>

                        {/* SLA Countdown Chip */}
                        {['RESOLVED', 'CLOSED'].includes(c.status) ? (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Resolved
                          </span>
                        ) : isBreached ? (
                          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                            <Flame className="w-3 h-3" /> Overdue
                          </span>
                        ) : isApproaching ? (
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {hoursLeft}h left
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {hoursLeft}h target
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANE: TICKET DETAIL & ACTION WORKSPACE (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
            {!selectedCaseDetail ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <LifeBuoy className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300 dark:text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select a Case Ticket</h3>
                <p className="text-xs max-w-xs">
                  Choose a case from the master list to triage, review requester metadata, view internal notes, or compose a reply.
                </p>
              </div>
            ) : detailLoading ? (
              <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mr-2 text-emerald-600" /> Loading ticket details...
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 1. Header Card with Quick Selectors */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedCaseDetail.ticket_number}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedCaseDetail.ticket_number)}
                        title="Copy ticket number"
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    {/* SLA Timer Badge */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">SLA Due:</span>
                      <span
                        className={`font-semibold ${
                          (selectedCaseDetail.sla_remaining_hours || 0) < 0
                            ? 'text-red-600'
                            : (selectedCaseDetail.sla_remaining_hours || 0) <= 4
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {selectedCaseDetail.sla_remaining_hours !== undefined
                          ? selectedCaseDetail.sla_remaining_hours > 0
                            ? `${selectedCaseDetail.sla_remaining_hours}h remaining`
                            : `Breached by ${Math.abs(selectedCaseDetail.sla_remaining_hours)}h`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {selectedCaseDetail.subject}
                  </h2>

                  {/* Dropdowns Bar: Status / Priority / Assignee / Category */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {/* Status Dropdown */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Status
                      </label>
                      <select
                        value={selectedCaseDetail.status}
                        onChange={(e) => handleUpdateCaseProperty('status', e.target.value)}
                        className="w-full text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_ON_EMPLOYEE">Waiting Employee</option>
                        <option value="ESCALATED">Escalated</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>

                    {/* Priority Dropdown */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Priority
                      </label>
                      <select
                        value={selectedCaseDetail.priority}
                        onChange={(e) => handleUpdateCaseProperty('priority', e.target.value)}
                        className="w-full text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Category
                      </label>
                      <select
                        value={selectedCaseDetail.category_id}
                        onChange={(e) => handleUpdateCaseProperty('category_id', e.target.value)}
                        className="w-full text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium truncate"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Assignee Dropdown */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Agent
                      </label>
                      <select
                        value={selectedCaseDetail.assigned_agent_id || ''}
                        onChange={(e) => handleUpdateCaseProperty('assigned_agent_id', e.target.value || null)}
                        className="w-full text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium truncate"
                      >
                        <option value="">Unassigned</option>
                        <option value="e-11111111-1111-1111-1111-111111111114">Priya Natarajan (HR)</option>
                        <option value="e-11111111-1111-1111-1111-111111111111">David Miller (Exec)</option>
                        <option value="e-11111111-1111-1111-1111-111111111112">Sarah Jenkins (Eng)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Middle Scrollable Area: Requester Profile + Inter-Module Widgets + Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Requester Mini-Card */}
                  {selectedCaseDetail.requester && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700/80 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                          Requester 360° Profile
                        </span>
                        <a
                          href="/employees"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>View Directory</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-start gap-3">
                        <img
                          src={
                            selectedCaseDetail.requester.photo ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                          }
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-slate-300"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-3 text-[11px] flex-1">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Name</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                              {selectedCaseDetail.requester.first_name} {selectedCaseDetail.requester.last_name}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Employee ID</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              {selectedCaseDetail.requester.employee_code}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Department</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {selectedCaseDetail.requester.department}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Designation</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {selectedCaseDetail.requester.designation}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Location</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {selectedCaseDetail.requester.location}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Reporting Lead</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {selectedCaseDetail.requester.reporting_manager_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Active Delegation Alert if Applicable */}
                      {selectedCaseDetail.delegation && (
                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong>ESS Delegation Active:</strong> Assigned agent has delegated cases to{' '}
                            <strong>{selectedCaseDetail.delegation.delegatee_name}</strong> ({selectedCaseDetail.delegation.reason}).
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inter-Module Context Action: Leave & Attendance */}
                  {selectedCaseDetail.leave_context && (
                    <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-900 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          Leave & Attendance Context Widget
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold">Pay Period: Nov 2026</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {selectedCaseDetail.leave_context.balances.map((b) => (
                          <div key={b.type} className="bg-white dark:bg-slate-800 p-2 rounded border border-blue-100 dark:border-blue-950">
                            <span className="text-[10px] text-slate-500 block truncate">{b.type}</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {b.remaining} / {b.total} days
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-blue-900 dark:text-blue-200 flex items-center justify-between">
                        <span>
                          Present: <strong>{selectedCaseDetail.leave_context.attendance_summary.present_days}d</strong> | WFH:{' '}
                          <strong>{selectedCaseDetail.leave_context.attendance_summary.wfh_days}d</strong> | Missed Punches:{' '}
                          <strong>{selectedCaseDetail.leave_context.attendance_summary.missed_punches}</strong>
                        </span>
                        <a href="/attendance" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                          Open Attendance Log →
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Inter-Module Context Action: Payroll LOP Log */}
                  {selectedCaseDetail.payroll_context && (
                    <div className="bg-purple-50/70 dark:bg-purple-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-900 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                          Payroll & Loss of Pay (LOP) Verification
                        </span>
                        <span className="text-[10px] text-purple-600 font-semibold">November Run</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-purple-900 dark:text-purple-200">
                        <span>
                          Monthly Gross: <strong>${selectedCaseDetail.payroll_context.monthly_gross.toLocaleString()}</strong> |
                          Recorded LOP: <strong>{selectedCaseDetail.payroll_context.loss_of_pay_days} days</strong> ($
                          {selectedCaseDetail.payroll_context.loss_of_pay_deductions})
                        </span>
                        <a
                          href={selectedCaseDetail.payroll_context.lop_log_url}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-semibold transition-all"
                        >
                          Link to Payroll LOP Log
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 3. Cube AI Knowledge Hive Policy Recommendations Box */}
                  {selectedCaseDetail.ai_recommendations && selectedCaseDetail.ai_recommendations.length > 0 && (
                    <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg overflow-hidden text-xs">
                      <button
                        onClick={() => setIsAiBoxOpen(!isAiBoxOpen)}
                        className="w-full px-3 py-2 flex items-center justify-between text-emerald-800 dark:text-emerald-200 font-bold hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cube AI Knowledge Recommendations ({selectedCaseDetail.ai_recommendations.length})</span>
                        </span>
                        {isAiBoxOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {isAiBoxOpen && (
                        <div className="p-3 pt-0 space-y-2 border-t border-emerald-100 dark:border-emerald-900/60">
                          {selectedCaseDetail.ai_recommendations.map((rec) => (
                            <div
                              key={rec.id}
                              className="bg-white dark:bg-slate-800 rounded p-2.5 border border-emerald-100 dark:border-emerald-900"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-100 text-[11px]">
                                  {rec.title}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-semibold">{rec.relevance_score} match</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                                {rec.excerpt}
                              </p>
                              <button
                                onClick={() => {
                                  setReplyText((prev) => (prev ? `${prev}\n\n${rec.canned_reply}` : rec.canned_reply));
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                <ArrowRight className="w-3 h-3" />
                                <span>Insert into Reply Composer</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Conversation & Audit Log Chronological Stream */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                      — Ticket Activity & Messages Timeline —
                    </span>

                    {selectedCaseDetail.messages?.map((msg) => {
                      if (msg.is_system_activity) {
                        return (
                          <div key={msg.id} className="text-center my-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {msg.message_body}
                            </span>
                          </div>
                        );
                      }

                      if (msg.is_internal_note) {
                        return (
                          <div
                            key={msg.id}
                            className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg p-3 text-xs shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-1 text-amber-800 dark:text-amber-200">
                              <span className="font-semibold flex items-center gap-1 text-[11px]">
                                <Lock className="w-3 h-3 text-amber-600" />
                                Internal Note (HR Agents Only) — {msg.sender_name}
                              </span>
                              <span className="text-[10px] text-amber-600">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{msg.message_body}</p>
                          </div>
                        );
                      }

                      const isAgent = msg.sender_role === 'HR_ADMIN' || msg.sender_role === 'LINE_MANAGER';

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2.5 max-w-[85%] ${isAgent ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                          {msg.sender_avatar ? (
                            <img src={msg.sender_avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-600 text-xs font-bold">
                              {msg.sender_name[0]}
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              isAgent
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-0.5">
                              <span className="font-semibold">{msg.sender_name}</span>
                              <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message_body}</p>

                            {/* Attachments */}
                            {msg.attachment_urls && msg.attachment_urls.length > 0 && (
                              <div className="pt-1.5 space-y-1">
                                {msg.attachment_urls.map((url, i) => (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                      isAgent ? 'bg-blue-700 text-blue-100' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border'
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
                </div>

                {/* 3. Composer Box (Bottom) */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                  {/* Canned Responses + Note Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {/* Public vs Internal Note toggle */}
                    <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-md">
                      <button
                        type="button"
                        onClick={() => setIsInternalNote(false)}
                        className={`px-2 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-all ${
                          !isInternalNote
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Public Reply</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsInternalNote(true)}
                        className={`px-2 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-all ${
                          isInternalNote
                            ? 'bg-amber-500 text-white font-semibold shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Internal Note</span>
                      </button>
                    </div>

                    {/* Canned responses dropdown */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setReplyText((prev) => (prev ? `${prev}\n\n${e.target.value}` : e.target.value));
                        }
                      }}
                      className="text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
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

                  {/* Textarea */}
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
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />

                  {/* Action buttons bar */}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const file = prompt('Enter attachment URL or mock document name:');
                        if (file) setComposerAttachments([...composerAttachments, file]);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attach File {composerAttachments.length > 0 && `(${composerAttachments.length})`}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {selectedCaseDetail.status !== 'RESOLVED' && (
                        <button
                          type="button"
                          onClick={() => setIsResolveModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold transition-all"
                        >
                          Resolve Case
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!replyText.trim() || sendingReply}
                        onClick={handleSendMessage}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all ${
                          isInternalNote
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        } disabled:opacity-50`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingReply ? 'Sending...' : isInternalNote ? 'Save Note' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 2: EMPLOYEE SELF-SERVICE VIEW (`/cases/my-cases`) */}
      {activeTab === 'my-cases' && (
        <div className="space-y-6">
          {/* Welcome Card & Summary Stats */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">My Support Queries & Cases</h2>
              <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed">
                Submit queries directly to HR Operations, track resolution progress in real time, and converse with assigned specialists without leaving your self-service dashboard.
              </p>
            </div>
            <button
              onClick={() => {
                if (categories.length > 0 && !raiseCategory) setRaiseCategory(categories[0].id);
                setIsRaiseModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 rounded-lg text-xs font-bold shadow hover:bg-emerald-50 transition-all self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Submit a Query</span>
            </button>
          </div>

          {/* Ticket Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCasesList.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-slate-900 rounded-xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
                <LifeBuoy className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Cases Raised Yet</h4>
                <p className="text-xs mt-1">Have a payroll, leave, or benefits question? Click "Submit a Query" above.</p>
              </div>
            ) : (
              myCasesList.map((c) => {
                const isResolved = ['RESOLVED', 'CLOSED'].includes(c.status);
                return (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {c.ticket_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : c.status === 'WAITING_ON_EMPLOYEE'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-2">
                        {c.subject}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Category:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{c.category?.name || 'General'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Assigned Agent:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {c.assigned_agent ? `${c.assigned_agent.first_name} ${c.assigned_agent.last_name}` : 'HR Ops Pool'}
                        </span>
                      </div>

                      {/* View & Rate Action */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            switchTab('operations');
                          }}
                          className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
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
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-semibold hover:bg-amber-100 transition-all flex items-center gap-1"
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

      {/* SCREEN 3: SETTINGS & CONFIGURATION (`/cases/settings`) */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Settings Sub-Navigation */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setSettingsSubTab('categories')}
              className={`pb-2 transition-all ${
                settingsSubTab === 'categories'
                  ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tab 1: Categories & Routing ({categories.length})
            </button>

            <button
              onClick={() => setSettingsSubTab('sla')}
              className={`pb-2 transition-all ${
                settingsSubTab === 'sla'
                  ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tab 2: SLA & Escalation Policies ({slaPolicies.length})
            </button>

            <button
              onClick={() => setSettingsSubTab('knowledge')}
              className={`pb-2 transition-all ${
                settingsSubTab === 'knowledge'
                  ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tab 3: Knowledge Base Connections ({knowledgeDocs.length})
            </button>
          </div>

          {/* TAB 1: CATEGORIES & ROUTING */}
          {settingsSubTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Category Taxonomy & Auto-Assignment</h3>
                  <p className="text-xs text-slate-500">
                    Define default SLAs, fallback agents, and enforce priority restriction flags for employee self-service.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewCategoryModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Code / Category</th>
                      <th className="py-2.5 px-4">Sub-Categories</th>
                      <th className="py-2.5 px-4">Default Agent</th>
                      <th className="py-2.5 px-4">Default SLA</th>
                      <th className="py-2.5 px-4">Priority Lock</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{cat.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{cat.code}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cat.subcategories?.slice(0, 3).map((sub, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                              >
                                {sub}
                              </span>
                            ))}
                            {(cat.subcategories?.length || 0) > 3 && (
                              <span className="text-[10px] text-slate-400">+{cat.subcategories.length - 3} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {cat.default_assignee_name || 'HR Ops'}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {cat.default_sla_hours} hrs
                        </td>
                        <td className="py-3 px-4">
                          {cat.restrict_priority_field ? (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded text-[10px] font-bold">
                              Restricted (Medium)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">User Chooses</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-bold">
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

          {/* TAB 2: SLA & ESCALATION POLICIES */}
          {settingsSubTab === 'sla' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">SLA Matrix & Automated Escalations</h3>
                  <p className="text-xs text-slate-500">
                    Matrix thresholds per category and priority with hourly escalation triggers.
                  </p>
                </div>
                <button
                  onClick={handleRunEscalation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm"
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

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Priority</th>
                      <th className="py-2.5 px-4">First Response Target</th>
                      <th className="py-2.5 px-4">Resolution Target</th>
                      <th className="py-2.5 px-4">Escalation Manager</th>
                      <th className="py-2.5 px-4">Operating Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {slaPolicies.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{p.category_name}</td>
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
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {p.resolution_time_hours} hrs
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {p.escalation_manager_name || 'David Miller'}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {p.business_hours_only ? 'Business Hours (9-18)' : '24x7 Continuous'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE BASE CONNECTIONS */}
          {settingsSubTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Knowledge Hive & Policy Intelligence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct integration with company policy documents for real-time Cube AI suggestions.
                  </p>
                </div>
                <button
                  onClick={handleReindex}
                  disabled={isReindexing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
                  <span>{isReindexing ? 'Re-Indexing Hive...' : 'Re-Index Knowledge Hive'}</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Knowledge Hive: Healthy & Synced</h4>
                    <p className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                      {knowledgeDocs.length} policy documents indexed with keyword semantic extraction. Last indexed at{' '}
                      {new Date(knowledgeLastIndexed || Date.now()).toLocaleTimeString()}.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-full text-xs">100% Ready</span>
              </div>

              {/* Document List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{doc.read_time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{doc.excerpt}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.key_terms?.map((term, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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

      {/* MODAL 1: RAISE A CASE */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-emerald-600" />
                  Raise New HR Support Case
                </h3>
                <p className="text-xs text-slate-500">Submit your query directly to the designated department.</p>
              </div>
              <button
                onClick={() => setIsRaiseModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Category Dropdown */}
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={raiseCategory}
                    onChange={(e) => {
                      setRaiseCategory(e.target.value);
                      setRaiseSubCategory('');
                    }}
                    required
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
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
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Sub-Category (Optional)
                  </label>
                  <select
                    value={raiseSubCategory}
                    onChange={(e) => setRaiseSubCategory(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
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

              {/* Priority Field: Only editable if restrict_priority_field == false */}
              {!currentRaiseCategoryObj?.restrict_priority_field ? (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setRaisePriority(p)}
                        className={`py-1.5 rounded text-xs font-semibold border transition-all ${
                          raisePriority === p
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Priority is governed by category SLA policy: <strong>MEDIUM (24h resolution)</strong>.
                  </span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dependent addition to medical insurance policy"
                  value={raiseSubject}
                  onChange={(e) => setRaiseSubject(e.target.value)}
                  required
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* LIVE SUGGESTED ARTICLES PANEL */}
              {liveSuggestedArticles.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Cube AI Instant Suggestion: Does this solve your query?
                  </span>
                  {liveSuggestedArticles.slice(0, 1).map((article) => (
                    <div key={article.id} className="bg-white dark:bg-slate-800 p-2.5 rounded border border-emerald-100">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">{article.title}</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          alert('Great! Glad the policy helped answer your question.');
                          setIsRaiseModalOpen(false);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-all"
                      >
                        Yes, this answered my question!
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Query Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide complete context, affected dates, or relevant transaction details..."
                  value={raiseDescription}
                  onChange={(e) => setRaiseDescription(e.target.value)}
                  required
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Upload Attachments (Optional)
                </label>
                <div
                  onClick={() => {
                    const sample = prompt('Enter document name / mock file URL:');
                    if (sample) setRaiseAttachments([...raiseAttachments, sample]);
                  }}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center cursor-pointer hover:border-emerald-500 transition-all text-slate-500"
                >
                  <Paperclip className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                  <span className="text-[11px]">Click to add PDF, PNG, JPG attachments</span>
                </div>
                {raiseAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {raiseAttachments.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-700 dark:text-slate-300 border flex items-center gap-1"
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
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCase}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolve Case Ticket
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record the final resolution summary for audit and requester notification.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Resolution Summary
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Verified employee submitted birth certificates and submitted endorsement to health insurance underwriter."
                value={resolutionSummaryInput}
                onChange={(e) => setResolutionSummaryInput(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-5 shadow-2xl space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Rate HR Service Satisfaction</h3>
            <p className="text-xs text-slate-500">How satisfied were you with the turnaround time and answers provided?</p>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRatingStars(num)}
                  className="p-1 hover:scale-110 transition-all"
                >
                  <Star
                    className={`w-6 h-6 ${
                      num <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
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
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center"
            />

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRatingCaseId(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold border text-slate-600 hover:bg-slate-50"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleConfirmRating}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add New Case Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Travel & Expensing"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Code</label>
                <input
                  type="text"
                  placeholder="e.g. TRV"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sub-Categories (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Per Diem, Flight Booking, Hotel Vouchers"
                  value={newCatSubcategories}
                  onChange={(e) => setNewCatSubcategories(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Default SLA Target (Hours)</label>
                <input
                  type="number"
                  value={newCatSla}
                  onChange={(e) => setNewCatSla(Number(e.target.value))}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lockPrio"
                  checked={newCatRestrictPrio}
                  onChange={(e) => setNewCatRestrictPrio(e.target.checked)}
                />
                <label htmlFor="lockPrio" className="text-slate-700 dark:text-slate-300">
                  Lock priority on ESS submission (default to MEDIUM)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded border text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
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
