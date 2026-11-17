import { useState } from 'react';
import {
  UserX,
  DollarSign,
  X,
  CheckCircle2,
  Award,
  FileText,
  ArrowRightLeft,
  Calendar,
  Share2,
} from 'lucide-react';
import { getCurrentRole } from '../../lib/api';

interface ExitItem {
  id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  resignation_date: string;
  proposed_lwd: string;
  agreed_lwd: string;
  status: 'SUBMITTED' | 'NOTICE_PERIOD' | 'CLEARANCE_IN_PROGRESS' | 'CLEARANCE_COMPLETED' | 'FNF_SETTLED' | 'EXIT_COMPLETED';
  clearances: {
    it: boolean;
    admin: boolean;
    finance: boolean;
    hr: boolean;
  };
  fnf_net: number;
}

const INITIAL_EXITS: ExitItem[] = [
  {
    id: 'exit-1',
    employee_name: 'John Doe',
    employee_code: 'EMP-10003',
    department: 'Engineering',
    resignation_date: '2026-11-10',
    proposed_lwd: '2026-12-10',
    agreed_lwd: '2026-12-10',
    status: 'CLEARANCE_IN_PROGRESS',
    clearances: { it: true, admin: false, finance: false, hr: true },
    fnf_net: 100833.33,
  },
  {
    id: 'exit-2',
    employee_name: 'Rachel Adams',
    employee_code: 'EMP-10008',
    department: 'Product Design',
    resignation_date: '2026-11-05',
    proposed_lwd: '2026-12-05',
    agreed_lwd: '2026-12-05',
    status: 'NOTICE_PERIOD',
    clearances: { it: false, admin: false, finance: false, hr: false },
    fnf_net: 125000.0,
  },
  {
    id: 'exit-3',
    employee_name: 'Dev Patel',
    employee_code: 'EMP-10012',
    department: 'Marketing Ops',
    resignation_date: '2026-11-12',
    proposed_lwd: '2026-12-15',
    agreed_lwd: '2026-12-15',
    status: 'SUBMITTED',
    clearances: { it: false, admin: false, finance: false, hr: false },
    fnf_net: 82000.0,
  },
];

export function OffboardingView() {
  const [exits, setExits] = useState<ExitItem[]>(INITIAL_EXITS);
  const [selectedExit, setSelectedExit] = useState<ExitItem | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Approval Transfer Governance state
  const [transferApprovals, setTransferApprovals] = useState(true);
  const [transferTarget, setTransferTarget] = useState('Sarah Jenkins (Engineering Manager)');
  const [documentsPublished, setDocumentsPublished] = useState(false);

  // Exit Survey & Relieving Letter State
  const [isExitSurveyOpen, setIsExitSurveyOpen] = useState(false);
  const [isRelievingLetterOpen, setIsRelievingLetterOpen] = useState(false);
  const [exitSurveySubmitted, setExitSurveySubmitted] = useState(false);
  const [cultureRating, setCultureRating] = useState(4);
  const [managerRating, setManagerRating] = useState(5);
  const [exitFeedback, setExitFeedback] = useState('Great team culture, highly supportive engineering management.');

  // Resignation form state
  const [resignationReason, setResignationReason] = useState('Pursuing higher studies abroad');
  const [proposedDate, setProposedDate] = useState('2026-12-31');

  const role = getCurrentRole();
  const isHr = role === 'HR_ADMIN';

  const handleResignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExit: ExitItem = {
      id: `exit-${Date.now()}`,
      employee_name: 'John Doe (Self)',
      employee_code: 'EMP-10003',
      department: 'Engineering',
      resignation_date: new Date().toISOString().split('T')[0],
      proposed_lwd: proposedDate,
      agreed_lwd: proposedDate,
      status: 'SUBMITTED',
      clearances: { it: false, admin: false, finance: false, hr: false },
      fnf_net: 95400.0,
    };
    setExits([newExit, ...exits]);
    setIsSubmitOpen(false);
  };

  const handleToggleClearance = (dept: 'it' | 'admin' | 'finance' | 'hr') => {
    if (!selectedExit) return;
    const updatedClearances = { ...selectedExit.clearances, [dept]: !selectedExit.clearances[dept] };
    const allCleared = Object.values(updatedClearances).every(Boolean);

    const updated = {
      ...selectedExit,
      clearances: updatedClearances,
      status: allCleared ? ('CLEARANCE_COMPLETED' as const) : ('CLEARANCE_IN_PROGRESS' as const),
    };

    setSelectedExit(updated);
    setExits(exits.map((e) => (e.id === selectedExit.id ? updated : e)));
  };

  const handleSettleFnf = () => {
    if (!selectedExit) return;
    const updated = { ...selectedExit, status: 'FNF_SETTLED' as const };
    setSelectedExit(updated);
    setExits(exits.map((e) => (e.id === selectedExit.id ? updated : e)));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E2F2] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2D32]">Offboarding & Exit Management</h1>
          <p className="text-sm text-[#5E7174]">
            Resignation workflow, last working day computation, asset NOC matrix, and settlement governance.
          </p>
        </div>
        <button
          onClick={() => setIsSubmitOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 transition"
        >
          <UserX className="h-4 w-4" /> Submit Resignation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Separation Pipeline List */}
        <div className={`space-y-4 ${selectedExit ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
          <div className="overflow-hidden rounded-xl border border-[#D9E2F2] bg-white shadow-sm">
            <div className="bg-[#F4F2EC] px-4 py-3 border-b border-[#D9E2F2] flex items-center justify-between text-xs font-semibold text-[#5E7174] uppercase tracking-wider">
              <span>Separation Pipeline ({exits.length})</span>
              <span className="text-[11px] font-normal normal-case text-slate-500">Active Exits</span>
            </div>
            <div className="divide-y divide-[#D9E2F2]">
              {exits.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedExit(e)}
                  className={`p-4 cursor-pointer transition hover:bg-slate-50 ${
                    selectedExit?.id === e.id ? 'bg-rose-50/40 border-l-4 border-l-rose-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B2D32]">{e.employee_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        e.status === 'CLEARANCE_IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : e.status === 'CLEARANCE_COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : e.status === 'FNF_SETTLED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {e.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#5E7174]">
                    {e.department} &bull; Code: {e.employee_code}
                  </div>
                  <div className="mt-2 text-[11px] text-[#5E7174] flex justify-between">
                    <span>
                      Agreed LWD: <strong>{new Date(e.agreed_lwd).toLocaleDateString()}</strong>
                    </span>
                    <span className="font-semibold text-emerald-700">F&F: &#8377;{e.fnf_net.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Exit Details, Governance & Settlement */}
        {selectedExit && (
          <div className="lg:col-span-8 space-y-6">
            {/* Separation Case Header Bar */}
            <div className="rounded-xl border border-[#D9E2F2] bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-700 text-sm">SEPARATION CASE: EXIT-0491</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-[#1B2D32] text-sm">
                    {selectedExit.employee_name} ({selectedExit.employee_code})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-[#5E7174]">Flow: Resignation Flow</span>
                </div>
                <button onClick={() => setSelectedExit(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E7174]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Resignation: <strong className="text-slate-800">Nov 10, 2026</strong></span>
                </div>
                <div>• Notice Period: <strong className="text-slate-800">30 Calendar Days</strong></div>
                <div>• Agreed LWD: <strong className="text-slate-800">{new Date(selectedExit.agreed_lwd).toLocaleDateString()}</strong></div>
                <div>
                  • Stage:{' '}
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedExit.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Approval Transfer Governance */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-2">
                <ArrowRightLeft className="h-4 w-4 text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    Pending Approval Transfer Governance
                  </h4>
                  <p className="text-xs text-blue-900 mt-0.5">
                    Exiting employee has 3 pending subordinate approvals (2 Leave Requests, 1 Timesheet submission).
                  </p>
                </div>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                  <input
                    type="checkbox"
                    checked={transferApprovals}
                    onChange={(e) => setTransferApprovals(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Automatically transfer pending approvals on Inactive Status Change to:</span>
                </label>
                <select
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                  className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Sarah Jenkins (Engineering Manager)">Sarah Jenkins (Engineering Manager)</option>
                  <option value="David Miller (Department Head)">David Miller (Department Head)</option>
                  <option value="Priya Natarajan (HR Director)">Priya Natarajan (HR Director)</option>
                </select>
              </div>
            </div>

            {/* Multi-Departmental NOC Clearance Matrix */}
            <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#1B2D32]">Multi-Departmental NOC Clearance Matrix</h3>
                  <p className="text-xs text-[#5E7174]">All four departments must mark clearance before F&F payout.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#D9E2F2] bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1B2D32]">IT Department Clearance</h4>
                    <p className="text-[11px] text-[#5E7174]">MacBook, token, email deprovision</p>
                  </div>
                  <button
                    onClick={() => handleToggleClearance('it')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedExit.clearances.it ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {selectedExit.clearances.it ? 'Cleared' : 'Pending'}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2F2] bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1B2D32]">Admin & Facility Clearance</h4>
                    <p className="text-[11px] text-[#5E7174]">ID Card, locker key, parking pass</p>
                  </div>
                  <button
                    onClick={() => handleToggleClearance('admin')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedExit.clearances.admin ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {selectedExit.clearances.admin ? 'Cleared' : 'Pending'}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2F2] bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1B2D32]">Finance & Payroll Clearance</h4>
                    <p className="text-[11px] text-[#5E7174]">Travel advance, corporate card</p>
                  </div>
                  <button
                    onClick={() => handleToggleClearance('finance')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedExit.clearances.finance ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {selectedExit.clearances.finance ? 'Cleared' : 'Pending'}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2F2] bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1B2D32]">HR & Line Manager Clearance</h4>
                    <p className="text-[11px] text-[#5E7174]">Knowledge transfer, exit interview</p>
                  </div>
                  <button
                    onClick={() => handleToggleClearance('hr')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedExit.clearances.hr ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {selectedExit.clearances.hr ? 'Cleared' : 'Pending'}
                  </button>
                </div>
              </div>
            </div>

            {/* F&F Settlement Sheet Breakdown */}
            <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#1B2D32] flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" /> Full & Final (F&F) Settlement Sheet
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                  Status: {selectedExit.status}
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-[#D9E2F2]">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E7174]">Earned Salary (Days worked in final month):</span>
                  <span className="font-mono font-semibold text-[#1B2D32]">&#8377;85,000.00</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E7174]">Leave Encashment (10 days accrued leave):</span>
                  <span className="font-mono font-semibold text-[#1B2D32]">&#8377;28,333.33</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E7174]">Gratuity Amount:</span>
                  <span className="font-mono font-semibold text-[#1B2D32]">&#8377;0.00</span>
                </div>
                <div className="flex justify-between py-1.5 text-rose-700">
                  <span>Less: Notice Shortfall Recovery (0 days shortfall):</span>
                  <span className="font-mono font-semibold">-&#8377;0.00</span>
                </div>
                <div className="flex justify-between py-1.5 text-rose-700">
                  <span>Less: Estimated Tax Deduction (TDS):</span>
                  <span className="font-mono font-semibold">-&#8377;12,500.00</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold text-[#1B2D32] bg-[#F4F2EC] px-3 rounded-lg">
                  <span>Net Payable to Employee:</span>
                  <span className="font-mono text-emerald-700">&#8377;100,833.33</span>
                </div>
              </div>

              {selectedExit.status === 'CLEARANCE_COMPLETED' && isHr && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSettleFnf}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Authorize & Disburse Settlement
                  </button>
                </div>
              )}

              {selectedExit.status === 'FNF_SETTLED' && (
                <div className="pt-4 border-t border-[#D9E2F2] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Settlement Disbursed & Account Deprovisioned
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsExitSurveyOpen(true)}
                      className="rounded-lg border border-[#D9E2F2] px-3 py-1.5 text-xs font-semibold text-[#187F7A] hover:bg-slate-50 flex items-center gap-1"
                    >
                      Exit Interview Survey
                    </button>
                    <button
                      onClick={() => setIsRelievingLetterOpen(true)}
                      className="rounded-lg bg-[#187F7A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#146A66] flex items-center gap-1"
                    >
                      <Award className="h-3.5 w-3.5" /> View Relieving Letter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Exit Documents Generation Console */}
            <div className="rounded-xl border border-[#D9E2F2] bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1B2D32] flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#187F7A]" /> Exit Documents Generation
                </h4>
                <span className="text-xs text-[#5E7174]">Automated PDF Service & Seal</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#5E7174] font-medium">System Templates:</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800 border border-slate-200">
                  [ Experience Certificate ]
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800 border border-slate-200">
                  [ Relieving Letter ]
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800 border border-slate-200">
                  [ No-Dues Certificate ]
                </span>
              </div>
              {documentsPublished && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Exit package published to Employee Documents Center with digital signature stamps.
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDocumentsPublished(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#146A66] transition shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5" /> [ Generate & Publish to Employee Exit Documents Tab ]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exit Interview Survey Modal (RES-OFF-004) */}
      {isExitSurveyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1B2D32]">Confidential Exit Interview</h3>
                <p className="text-xs text-[#5E7174]">HR Exit Protocol (RES-OFF-004) &bull; HR-only visibility</p>
              </div>
              <button onClick={() => setIsExitSurveyOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            {exitSurveySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#1B2D32]">Exit Survey Submitted</h4>
                <p className="text-xs text-[#5E7174]">Thank you for your valuable feedback. It has been confidentially archived.</p>
                <button
                  onClick={() => setIsExitSurveyOpen(false)}
                  className="mt-4 rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setExitSurveySubmitted(true);
                }}
                className="mt-4 space-y-4 text-xs"
              >
                <div>
                  <label className="block font-medium text-[#5E7174]">How would you rate company work culture? (1 to 5)</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCultureRating(star)}
                        className={`px-3 py-1.5 rounded font-bold ${
                          cultureRating === star ? 'bg-[#187F7A] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {star} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#5E7174]">How would you rate manager support & mentorship?</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setManagerRating(star)}
                        className={`px-3 py-1.5 rounded font-bold ${
                          managerRating === star ? 'bg-[#187F7A] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {star} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#5E7174]">Key Takeaways & Suggestions for Leadership</label>
                  <textarea
                    rows={3}
                    value={exitFeedback}
                    onChange={(e) => setExitFeedback(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] p-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#D9E2F2]">
                  <button
                    type="button"
                    onClick={() => setIsExitSurveyOpen(false)}
                    className="rounded-lg px-4 py-2 font-medium text-[#5E7174] hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#187F7A] px-4 py-2 font-semibold text-white hover:bg-[#146A66]"
                  >
                    Submit Confidential Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Relieving & Experience Certificate Modal (RES-OFF-006) */}
      {isRelievingLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#187F7A]" />
                <h3 className="text-lg font-bold text-[#1B2D32]">Official Relieving & Service Certificate</h3>
              </div>
              <button onClick={() => setIsRelievingLetterOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 p-6 border border-[#D9E2F2] rounded-xl bg-slate-50 space-y-4 font-serif text-xs text-[#1B2D32] leading-relaxed">
              <div className="text-center space-y-1 border-b border-slate-200 pb-3 font-sans">
                <h4 className="font-bold text-sm tracking-wide text-[#173D45]">CUBEAI SOLUTIONS PRIVATE LIMITED</h4>
                <p className="text-[10px] text-[#5E7174]">Corporate Towers, Outer Ring Road, Bangalore 560103, Karnataka, India</p>
                <p className="text-[10px] font-mono text-slate-400">Ref: CUBEAI/REL/2026/0003</p>
              </div>

              <div className="flex justify-between font-sans text-[11px] text-[#5E7174]">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>TO WHOMSOEVER IT MAY CONCERN</span>
              </div>

              <p>
                This is to certify that <strong>{selectedExit?.employee_name}</strong> (Employee ID: <strong>{selectedExit?.employee_code}</strong>) was employed with CubeAI Solutions Private Limited from <strong>2024-02-01</strong> to <strong>{selectedExit?.agreed_lwd}</strong>.
              </p>

              <p>
                During their tenure in the <strong>{selectedExit?.department}</strong> department, their conduct and performance were exemplary. All company assets and departmental clearances have been settled in full.
              </p>

              <p>
                We appreciate their contributions to our organization and wish them the very best in all future professional endeavors.
              </p>

              <div className="pt-6 font-sans text-xs space-y-1">
                <div className="font-bold text-[#187F7A]">Digitally Signed & Certified</div>
                <div className="font-semibold text-[#1B2D32]">Priya Natarajan</div>
                <div className="text-[11px] text-[#5E7174]">Director of Human Resources &bull; CubeAI Solutions</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsRelievingLetterOpen(false)}
                className="rounded-lg border border-[#D9E2F2] px-4 py-2 text-xs font-semibold text-[#5E7174] hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Certificate PDF downloaded successfully.');
                  setIsRelievingLetterOpen(false);
                }}
                className="rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66]"
              >
                Print / Download Signed PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Resignation Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">Submit Voluntary Resignation</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleResignSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#5E7174]">Primary Reason for Leaving</label>
                <select
                  value={resignationReason}
                  onChange={(e) => setResignationReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                >
                  <option value="Pursuing higher studies abroad">Pursuing higher studies abroad</option>
                  <option value="Better career opportunity elsewhere">Better career opportunity elsewhere</option>
                  <option value="Personal / Family relocation">Personal / Family relocation</option>
                  <option value="Health or personal sabbatical">Health or personal sabbatical</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#5E7174]">Proposed Last Working Date (LWD)</label>
                <input
                  type="date"
                  required
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-[#5E7174]">
                  Statutory notice period per contract: 30 calendar days.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9E2F2]">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#5E7174] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Submit Resignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}