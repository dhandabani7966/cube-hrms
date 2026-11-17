import { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  Lock,
  X,
  Send,
  Star,
  Sparkles,
  BookOpen,
  Filter,
  Inbox,
  AlertTriangle,
  Archive,
  Search,
  ExternalLink,
} from 'lucide-react';
import { getCurrentRole } from '../../lib/api';

interface CaseItem {
  id: string;
  case_number: string;
  category: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  sla_due_hours: number;
  created_at: string;
  assignee: string;
  messages: Array<{
    id: string;
    sender: string;
    is_internal: boolean;
    text: string;
    time: string;
  }>;
}

const INITIAL_CASES: CaseItem[] = [
  {
    id: 'case-1',
    case_number: 'CASE-2026-0001',
    category: 'Benefits & Insurance',
    subject: 'Clarification regarding medical insurance coverage for dependents',
    description: 'Need to add newborn baby to the group health insurance policy.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    sla_due_hours: 18,
    assignee: 'Priya Natarajan (HR Specialist)',
    created_at: '2026-11-17T09:00:00.000Z',
    messages: [
      { id: 'm-1', sender: 'John Doe', is_internal: false, text: 'Hello, what documents are required for dependent addition?', time: '09:05 AM' },
      { id: 'm-2', sender: 'HR Specialist', is_internal: true, text: 'Internal Note: Policy insurer allows 30 days window from birth certificate issuance.', time: '09:20 AM' },
      { id: 'm-3', sender: 'HR Specialist', is_internal: false, text: 'Hi John, please provide the official birth certificate and hospital discharge summary.', time: '09:30 AM' },
    ],
  },
  {
    id: 'case-2',
    case_number: 'CASE-2026-0002',
    category: 'Payroll & Taxation',
    subject: 'Discrepancy in November Tax Deduction (TDS)',
    description: 'Form 16 calculation does not reflect HRA rent receipts submitted last month.',
    priority: 'HIGH',
    status: 'OPEN',
    sla_due_hours: 3,
    assignee: 'David Miller (Finance)',
    created_at: '2026-11-17T10:15:00.000Z',
    messages: [
      { id: 'm-4', sender: 'Sarah Jenkins', is_internal: false, text: 'Please review rent slips uploaded under Document Vault.', time: '10:15 AM' },
    ],
  },
  {
    id: 'case-3',
    case_number: 'CASE-2026-0003',
    category: 'Relocation & Visas',
    subject: 'Relocation allowance disbursement status and travel claim',
    description: 'Inter-state transfer allowance reimbursement pending approval.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    sla_due_hours: 0,
    assignee: 'Priya Natarajan (HR Specialist)',
    created_at: '2026-11-16T14:30:00.000Z',
    messages: [
      { id: 'm-5', sender: 'Alex Morgan', is_internal: false, text: 'Attached boarding passes and hotel invoice.', time: '14:35 PM' },
      { id: 'm-6', sender: 'HR Specialist', is_internal: false, text: 'Claim audited and added to upcoming payroll cycle.', time: '16:00 PM' },
    ],
  },
  {
    id: 'case-4',
    case_number: 'CASE-2026-0004',
    category: 'Asset Clearance',
    subject: 'Developer workstation monitor replacement and ergonomic chair request',
    description: 'Secondary 4K display flickering; ergonomics assessment approved by manager.',
    priority: 'LOW',
    status: 'OPEN',
    sla_due_hours: 48,
    assignee: 'Unassigned',
    created_at: '2026-11-17T11:00:00.000Z',
    messages: [
      { id: 'm-7', sender: 'Jordan Taylor', is_internal: false, text: 'Requesting replacement before upcoming product sprint.', time: '11:05 AM' },
    ],
  },
];

const KNOWLEDGE_ARTICLES = [
  {
    id: 'kb-1',
    title: 'Group Medical Insurance Policy 2026',
    category: 'Benefits & Insurance',
    readTime: '4 min read',
    snippet: 'Covers inpatient hospitalization up to $50,000. Dependent additions must be filed within 30 calendar days of birth or marriage with government birth/marriage certificates.',
  },
  {
    id: 'kb-2',
    title: 'Tax Slabs, Form 16 & HRA Proof Submission',
    category: 'Payroll & Taxation',
    readTime: '6 min read',
    snippet: 'Declarations open from Nov 1 to Jan 15. Rent receipts exceeding $1,000/mo require landlord PAN and registered rental agreement.',
  },
  {
    id: 'kb-3',
    title: 'Relocation Assistance & Per Diem Guidelines',
    category: 'Relocation & Visas',
    readTime: '3 min read',
    snippet: 'Tier-1 inter-city transfers qualify for up to 14 days corporate guest house accommodation and relocation baggage allowance.',
  },
  {
    id: 'kb-4',
    title: 'IT Asset & Hardware Replacement Lifecycle',
    category: 'Asset Clearance',
    readTime: '5 min read',
    snippet: 'Standard laptop refresh cycle is 24 months. Ergonomic accessories require tier-1 lead approval prior to procurement dispatch.',
  },
];

export function CasesView() {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);
  const [isKbOpen, setIsKbOpen] = useState(false);
  const [activeQueue, setActiveQueue] = useState<string>('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // New Case Form
  const [newCat, setNewCat] = useState('Benefits & Insurance');
  const [newSubj, setNewSubj] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrio, setNewPrio] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Message Form
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // CSAT Rating State (RES-CASE-005)
  const [csatRating, setCsatRating] = useState(5);
  const [csatFeedback, setCsatFeedback] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const role = getCurrentRole();
  const isHr = role === 'HR_ADMIN';

  // Filter logic
  const filteredCases = cases.filter((c) => {
    if (activeCategoryFilter && !c.category.toLowerCase().includes(activeCategoryFilter.toLowerCase())) {
      return false;
    }
    if (activeQueue === 'UNASSIGNED') return c.assignee === 'Unassigned' || c.status === 'OPEN';
    if (activeQueue === 'MY_ASSIGNED') return c.assignee.includes('Priya') || c.assignee.includes('HR');
    if (activeQueue === 'SLA_APPROACHING') return c.sla_due_hours > 0 && c.sla_due_hours <= 12;
    if (activeQueue === 'CLOSED') return c.status === 'RESOLVED' || c.status === 'CLOSED';
    return true;
  });

  const handleRaiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubj || !newDesc) return;

    const newCase: CaseItem = {
      id: `case-${Date.now()}`,
      case_number: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCat,
      subject: newSubj,
      description: newDesc,
      priority: newPrio,
      status: 'OPEN',
      sla_due_hours: newPrio === 'CRITICAL' ? 2 : newPrio === 'HIGH' ? 4 : 24,
      assignee: 'Unassigned',
      created_at: new Date().toISOString(),
      messages: [{ id: `m-${Date.now()}`, sender: 'Employee', is_internal: false, text: newDesc, time: 'Just now' }],
    };

    setCases([newCase, ...cases]);
    setIsRaiseOpen(false);
    setNewSubj('');
    setNewDesc('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedCase) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: isHr ? 'HR Specialist' : 'Employee',
      is_internal: isInternalNote,
      text: replyText,
      time: 'Just now',
    };

    const updated = {
      ...selectedCase,
      status: selectedCase.status === 'OPEN' ? ('IN_PROGRESS' as const) : selectedCase.status,
      messages: [...selectedCase.messages, newMsg],
    };

    setSelectedCase(updated);
    setCases(cases.map((c) => (c.id === selectedCase.id ? updated : c)));
    setReplyText('');
    setIsInternalNote(false);
  };

  const handleResolveCase = () => {
    if (!selectedCase) return;
    const updated = { ...selectedCase, status: 'RESOLVED' as const };
    setSelectedCase(updated);
    setCases(cases.map((c) => (c.id === selectedCase.id ? updated : c)));
  };

  const handleInsertAIAnswer = () => {
    if (!selectedCase) return;
    if (selectedCase.category.includes('Benefits') || selectedCase.subject.toLowerCase().includes('insurance')) {
      setReplyText(
        'According to the Group Medical Insurance Policy 2026 (Section 4.2), newborn addition requires submitting the official municipal birth certificate and hospital discharge summary within 30 days of birth.'
      );
    } else if (selectedCase.category.includes('Payroll')) {
      setReplyText(
        'Per the Tax Slabs and HRA Proof Submission policy, please confirm that your uploaded rent receipt includes your landlord’s verified PAN and signature so our payroll team can approve the deduction.'
      );
    } else {
      setReplyText(
        'Based on our corporate HR Knowledge Hive guidelines, your request has been reviewed. Please attach the supporting compliance documents for expedited clearance.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E2F2] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2D32]">HR Help Desk & Cases</h1>
          <p className="text-sm text-[#5E7174]">
            Internal ticketing, SLA timers, threaded messaging, policy-linked resolutions, and confidential case resolution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsKbOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D9E2F2] bg-white px-3.5 py-2 text-sm font-semibold text-[#1B2D32] shadow-sm hover:bg-slate-50 transition"
          >
            <BookOpen className="h-4 w-4 text-[#187F7A]" /> 📖 Open Knowledge Hive
          </button>
          <button
            onClick={() => setIsRaiseOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#146A66] transition"
          >
            <Plus className="h-4 w-4" /> Raise Support Ticket
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queues & Category Filters (Support Tickets) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-4 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#5E7174] uppercase tracking-wider pb-2 border-b border-[#D9E2F2]">
                <span>Queues & Filters</span>
                <Filter className="h-3.5 w-3.5 text-[#5E7174]" />
              </div>
              <div className="mt-3 space-y-1">
                {[
                  { id: 'ALL', label: 'All Tickets', count: 24, icon: Inbox },
                  { id: 'UNASSIGNED', label: 'Unassigned', count: 4, icon: AlertTriangle },
                  { id: 'MY_ASSIGNED', label: 'My Assigned Tickets', count: 8, icon: CheckCircle2 },
                  { id: 'SLA_APPROACHING', label: 'SLA Approaching', count: 3, icon: Clock },
                  { id: 'CLOSED', label: 'Closed Archive', count: 112, icon: Archive },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeQueue === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveQueue(item.id);
                        setActiveCategoryFilter(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-[#187F7A]/10 text-[#187F7A] font-bold'
                          : 'text-[#1B2D32] hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          isActive ? 'bg-[#187F7A] text-white font-bold' : 'bg-slate-100 text-[#5E7174]'
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#5E7174] uppercase tracking-wider pb-2 border-b border-[#D9E2F2]">
                Category Distribution
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  { name: 'Payroll Discrepancy', count: 9 },
                  { name: 'Medical Insurance', count: 7 },
                  { name: 'Relocation & Visas', count: 5 },
                  { name: 'Asset Clearance', count: 3 },
                ].map((cat) => {
                  const isSelected = activeCategoryFilter === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setActiveCategoryFilter(isSelected ? null : cat.name)
                      }
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                        isSelected
                          ? 'bg-amber-100/70 text-amber-900 font-bold'
                          : 'text-[#5E7174] hover:bg-slate-50 hover:text-[#1B2D32]'
                      }`}
                    >
                      <span>• {cat.name}</span>
                      <span className="font-semibold text-slate-500">({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#D9E2F2]">
              <button
                onClick={() => setIsKbOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition"
              >
                <BookOpen className="h-3.5 w-3.5" /> [ 📖 Open Knowledge Hive ]
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Tickets Queue List */}
        <div className={selectedCase ? 'lg:col-span-4' : 'lg:col-span-9'}>
          <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
            <div className="bg-[#F4F2EC] px-4 py-3 border-b border-[#D9E2F2] flex items-center justify-between text-xs font-semibold text-[#5E7174] uppercase tracking-wider">
              <span>Tickets Queue ({filteredCases.length})</span>
              {activeCategoryFilter && (
                <span className="text-[11px] font-normal normal-case text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Filter: {activeCategoryFilter}
                </span>
              )}
            </div>
            <div className="divide-y divide-[#D9E2F2]">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 cursor-pointer transition hover:bg-slate-50 ${
                    selectedCase?.id === c.id ? 'bg-[#187F7A]/5 border-l-4 border-l-[#187F7A]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#187F7A]">{c.case_number}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : c.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {c.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 font-semibold text-sm text-[#1B2D32] line-clamp-1">{c.subject}</div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#5E7174]">
                    <span>{c.category}</span>
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Clock className="h-3 w-3" /> SLA: {c.sla_due_hours}h left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Case Detail, CubeAI Hub & Conversation Thread */}
        {selectedCase && (
          <div className="lg:col-span-5 rounded-xl border border-[#D9E2F2] bg-white shadow-sm flex flex-col h-[750px]">
            {/* Header */}
            <div className="p-4 border-b border-[#D9E2F2] flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#187F7A] text-sm">{selectedCase.case_number}</span>
                  <span className="text-xs text-[#5E7174]">&bull; {selectedCase.category}</span>
                </div>
                <h3 className="font-bold text-[#1B2D32] text-sm mt-0.5 line-clamp-1">{selectedCase.subject}</h3>
                <div className="flex items-center gap-3 text-[11px] text-[#5E7174] mt-1">
                  <span>Priority: <strong className="text-slate-800">{selectedCase.priority}</strong></span>
                  <span>• SLA Target: <strong>24h</strong></span>
                  <span>• Assignee: <strong className="text-slate-800">{selectedCase.assignee}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedCase.status !== 'RESOLVED' && isHr && (
                  <button
                    onClick={handleResolveCase}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                  </button>
                )}
                {selectedCase.status === 'RESOLVED' && (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    RESOLVED
                  </span>
                )}
                <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 🤖 CubeAI Recommendation Hub */}
            <div className="p-3 bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border-b border-teal-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span>🤖 CubeAI Recommendation Hub</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-200/60 text-teal-900">
                  Auto-Matched KB
                </span>
              </div>
              <div className="mt-2 text-xs text-teal-950 space-y-1">
                <div className="font-semibold text-[11px] text-teal-800 flex items-center gap-1">
                  📄 {selectedCase.category.includes('Benefits')
                    ? 'Group Medical Insurance Policy 2026.pdf (Section 4.2)'
                    : selectedCase.category.includes('Payroll')
                    ? 'Tax Slabs and HRA Proof Submission 2026.pdf'
                    : 'Global Corporate Workplace Policy 2026.pdf'}
                </div>
                <p className="text-[11px] text-slate-700 italic bg-white/70 p-2 rounded border border-teal-100">
                  {selectedCase.category.includes('Benefits')
                    ? '"Newborn children may be enrolled under the corporate policy within 30 days of birth by submitting the official municipal birth certificate and hospital discharge summary."'
                    : selectedCase.category.includes('Payroll')
                    ? '"Rent receipts exceeding $1,000/mo require landlord PAN and verified rental agreement for TDS exemption."'
                    : '"Requests are routed according to SLA matrix; required forms must be verified before approval."'}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleInsertAIAnswer}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-white hover:bg-teal-100 border border-teal-300 rounded px-2.5 py-1 shadow-sm transition"
                  >
                    <Sparkles className="h-3 w-3 text-teal-600" /> [ Insert Answer into Reply Box ]
                  </button>
                </div>
              </div>
            </div>

            {/* CSAT Survey Prompt for Resolved Tickets */}
            {selectedCase.status === 'RESOLVED' && (
              <div className="bg-emerald-50/80 border-b border-emerald-200 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    Case Resolution & CSAT Rating Survey
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">Status: RESOLVED</span>
                </div>
                {csatSubmitted ? (
                  <p className="text-emerald-800 font-medium">
                    ✓ Thank you! Your CSAT rating of {csatRating}/5 stars has been recorded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[#5E7174]">
                      How satisfied are you with the resolution time and support provided for this case?
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCsatRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              star <= csatRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-slate-700">{csatRating} / 5 Stars</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={csatFeedback}
                        onChange={(e) => setCsatFeedback(e.target.value)}
                        placeholder="Optional feedback comment for HR operations..."
                        className="flex-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCsatSubmitted(true)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Submit CSAT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedCase.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl max-w-xl text-xs space-y-1 ${
                    m.is_internal
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 ml-auto'
                      : m.sender === 'Employee'
                      ? 'bg-slate-100 text-[#1B2D32]'
                      : 'bg-blue-50 text-blue-950 border border-blue-100 ml-auto'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1">
                      {m.is_internal && <Lock className="h-3 w-3 text-amber-600" />}
                      {m.sender} {m.is_internal && '(Private HR Note)'}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#D9E2F2] bg-white space-y-3">
              {isHr && (
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-amber-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-[#D9E2F2] text-amber-600 focus:ring-amber-500"
                    />
                    <span>Post as Private HR Note (Hidden from employee)</span>
                  </label>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isInternalNote ? 'Write private internal note for HR team...' : 'Reply to employee...'}
                  className="flex-1 rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66]"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Knowledge Hive Drawer / Modal */}
      {isKbOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#187F7A]" />
                <h3 className="text-lg font-bold text-[#1B2D32]">HR Knowledge Hive</h3>
              </div>
              <button onClick={() => setIsKbOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 my-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search HR policies, compliance requirements, benefits FAQs..."
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {KNOWLEDGE_ARTICLES.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl border border-[#D9E2F2] hover:border-[#187F7A] transition bg-white space-y-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B2D32] text-sm flex items-center gap-1.5">
                      {art.title} <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800">
                      {art.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E7174] leading-relaxed">{art.snippet}</p>
                  <div className="text-[11px] font-semibold text-slate-400 pt-1">{art.readTime}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-[#D9E2F2]">
              <button
                onClick={() => setIsKbOpen(false)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {isRaiseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">Raise Support Ticket</h3>
              <button onClick={() => setIsRaiseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRaiseSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#5E7174]">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="Benefits & Insurance">Benefits & Insurance</option>
                    <option value="Payroll & Taxation">Payroll & Taxation</option>
                    <option value="IT Hardware & Access">IT Hardware & Access</option>
                    <option value="Grievance & POSH">Grievance & POSH (Confidential)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#5E7174]">Priority</label>
                  <select
                    value={newPrio}
                    onChange={(e) => setNewPrio(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="LOW">Low (72h SLA)</option>
                    <option value="MEDIUM">Medium (24h SLA)</option>
                    <option value="HIGH">High (4h SLA)</option>
                    <option value="CRITICAL">Critical (2h SLA)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#5E7174]">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubj}
                  onChange={(e) => setNewSubj(e.target.value)}
                  placeholder="Summary of the issue..."
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#5E7174]">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your query or request in detail..."
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2F2]">
                <button
                  type="button"
                  onClick={() => setIsRaiseOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#5E7174] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#146A66]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}