import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Download,
  X,
  Folder,
  FolderOpen,
  Bell,
  FileCheck,
  Send,
  Users,
  Lock,
} from 'lucide-react';

interface PolicyItem {
  id: string;
  title: string;
  version: string;
  effective_from: string;
  is_mandatory: boolean;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
}

interface VaultDoc {
  id: string;
  title: string;
  category: string;
  file_type: string;
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'REJECTED';
  expiry_date: string | null;
}

const INITIAL_POLICIES: PolicyItem[] = [
  {
    id: 'pol-1',
    title: 'Information Security & Data Protection Policy',
    version: '3.0',
    effective_from: '2026-01-01',
    is_mandatory: true,
    is_acknowledged: true,
    acknowledged_at: '2026-02-05T12:00:00.000Z',
  },
  {
    id: 'pol-2',
    title: 'Prevention of Sexual Harassment (POSH) Policy',
    version: '2.1',
    effective_from: '2026-01-01',
    is_mandatory: true,
    is_acknowledged: false,
    acknowledged_at: null,
  },
  {
    id: 'pol-3',
    title: 'Code of Business Conduct & Ethics',
    version: '1.4',
    effective_from: '2026-01-01',
    is_mandatory: true,
    is_acknowledged: false,
    acknowledged_at: null,
  },
];

const INITIAL_VAULT_DOCS: VaultDoc[] = [
  { id: 'v-1', title: 'PAN Card Copy', category: 'Identity Proof', file_type: 'PDF', status: 'VERIFIED', expiry_date: null },
  { id: 'v-2', title: 'Passport Front & Back', category: 'Identity Proof', file_type: 'PDF', status: 'VERIFIED', expiry_date: '2026-12-31' },
  { id: 'v-3', title: 'B.Tech Degree Certificate', category: 'Education', file_type: 'PDF', status: 'VERIFIED', expiry_date: null },
  { id: 'v-4', title: 'Work Permit Visa Stamp', category: 'Compliance', file_type: 'PDF', status: 'VERIFIED', expiry_date: '2026-11-30' },
];

const CONSENT_AUDIT_LOG = [
  { id: 'aud-1', name: 'Marcus Vance', dept: 'Engineering', status: 'Opt-In Accepted', timestamp: '2026-02-05 12:00 UTC', ip: '192.168.1.10' },
  { id: 'aud-2', name: 'Alex Morgan', dept: 'Operations', status: 'Opt-In Accepted', timestamp: '2026-02-06 09:15 UTC', ip: '192.168.1.22' },
  { id: 'aud-3', name: 'Jordan Taylor', dept: 'Product Management', status: 'Pending Action', timestamp: 'SLA Breach in 4 Days', ip: 'Reminded x2' },
  { id: 'aud-4', name: 'Elena Rostova', dept: 'Quality Assurance', status: 'Opt-In Accepted', timestamp: '2026-02-07 14:40 UTC', ip: '192.168.1.45' },
];

export function DocumentsView() {
  const [activeTab, setActiveTab] = useState<'policies' | 'vault' | 'radar' | 'audit'>('policies');
  const [policies, setPolicies] = useState<PolicyItem[]>(INITIAL_POLICIES);
  const [vaultDocs] = useState<VaultDoc[]>(INITIAL_VAULT_DOCS);
  const [acknowledgingPolicy, setAcknowledgingPolicy] = useState<PolicyItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [reminderSent, setReminderSent] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);

  const handleAcknowledge = () => {
    if (!acknowledgingPolicy) return;
    setPolicies(
      policies.map((p) =>
        p.id === acknowledgingPolicy.id
          ? { ...p, is_acknowledged: true, acknowledged_at: new Date().toISOString() }
          : p
      )
    );
    setAcknowledgingPolicy(null);
  };

  const expiringDocs = vaultDocs.filter((d) => d.expiry_date !== null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E2F2] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2D32]">Document Management & Compliance</h1>
          <p className="text-sm text-[#5E7174]">
            Policy consent tracking, secure employee vault, e-sign governance, and proactive document expiry radar.
          </p>
        </div>
        <div className="flex rounded-lg border border-[#D9E2F2] bg-white p-1 text-xs font-semibold shadow-sm">
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'policies' ? 'bg-[#173D45] text-white' : 'text-[#5E7174] hover:bg-slate-50'}`}
          >
            Policy Hub
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'vault' ? 'bg-[#173D45] text-white' : 'text-[#5E7174] hover:bg-slate-50'}`}
          >
            Employee Vault
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'radar' ? 'bg-[#173D45] text-white' : 'text-[#5E7174] hover:bg-slate-50'}`}
          >
            Expiry Radar
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'audit' ? 'bg-[#173D45] text-white' : 'text-[#5E7174] hover:bg-slate-50'}`}
          >
            Consent Audit Log
          </button>
        </div>
      </div>

      {/* Main Grid: Left Folder Directory + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Folder Directory & Tools */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-4 shadow-sm space-y-5">
            <div>
              <div className="text-xs font-bold text-[#5E7174] uppercase tracking-wider pb-2 border-b border-[#D9E2F2]">
                Folder Directory
              </div>
              <div className="mt-3 space-y-1 text-xs font-medium">
                <button
                  onClick={() => setSelectedFolder('root')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition ${
                    selectedFolder === 'root' ? 'bg-[#187F7A]/10 text-[#187F7A] font-bold' : 'text-[#1B2D32] hover:bg-slate-50'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 text-amber-600" />
                  <span>📁 All Files (Root)</span>
                </button>
                <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
                  <button
                    onClick={() => { setSelectedFolder('policies'); setActiveTab('policies'); }}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition ${
                      selectedFolder === 'policies' ? 'bg-[#187F7A]/10 text-[#187F7A] font-bold' : 'text-[#5E7174] hover:text-[#1B2D32]'
                    }`}
                  >
                    <Folder className="h-3.5 w-3.5 text-amber-500" />
                    <span>📂 Company Policies</span>
                  </button>
                  <div className="pl-4 space-y-0.5 text-[11px] text-[#5E7174]">
                    <div className="py-0.5 hover:text-[#187F7A] cursor-pointer">• Code of Conduct</div>
                    <div className="py-0.5 hover:text-[#187F7A] cursor-pointer">• Data Privacy</div>
                  </div>
                  <button
                    onClick={() => setSelectedFolder('handbooks')}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition ${
                      selectedFolder === 'handbooks' ? 'bg-[#187F7A]/10 text-[#187F7A] font-bold' : 'text-[#5E7174] hover:text-[#1B2D32]'
                    }`}
                  >
                    <Folder className="h-3.5 w-3.5 text-amber-500" />
                    <span>📂 Employee Handbooks</span>
                  </button>
                  <button
                    onClick={() => { setSelectedFolder('statutory'); setActiveTab('vault'); }}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition ${
                      selectedFolder === 'statutory' ? 'bg-[#187F7A]/10 text-[#187F7A] font-bold' : 'text-[#5E7174] hover:text-[#1B2D32]'
                    }`}
                  >
                    <Folder className="h-3.5 w-3.5 text-amber-500" />
                    <span>📂 Statutory Forms</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#5E7174] uppercase tracking-wider pb-2 border-b border-[#D9E2F2]">
                Tools & Workflows
              </div>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setShowConfigModal('expiry')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D9E2F2] bg-white text-xs font-semibold text-[#1B2D32] hover:bg-slate-50 transition"
                >
                  <Bell className="h-3.5 w-3.5 text-amber-600" />
                  <span>[🔔 Expiry Reminders Config]</span>
                </button>
                <button
                  onClick={() => setShowConfigModal('esign')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D9E2F2] bg-white text-xs font-semibold text-[#1B2D32] hover:bg-slate-50 transition"
                >
                  <FileCheck className="h-3.5 w-3.5 text-teal-600" />
                  <span>[📝 E-Sign Flow Settings]</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Compliance Monitor & Active Tab View */}
        <div className="lg:col-span-9 space-y-6">
          {/* Document Compliance Monitor & Enforcement Summary Card */}
          <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/70 via-slate-50 to-emerald-50/60 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#187F7A] text-white">
                  Active Enforcement Cycle 2026
                </span>
                <h2 className="text-base font-bold text-[#1B2D32] mt-1">
                  Document Compliance Monitor & Enforcement Summary
                </h2>
                <p className="text-xs text-[#5E7174]">
                  Target Document: <strong className="text-teal-900">Enterprise Data Governance & Protection Standard 2026</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReminderSent(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#146A66] transition"
                >
                  <Send className="h-3.5 w-3.5" /> [ Send Bulk Consent Reminders ]
                </button>
                <button
                  onClick={() => alert('Exporting Document Consent Audit Log CSV...')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9E2F2] bg-white px-3 py-1.5 text-xs font-semibold text-[#1B2D32] hover:bg-slate-50 transition"
                >
                  <Download className="h-3.5 w-3.5" /> [ Export Audit Log CSV ]
                </button>
              </div>
            </div>

            {reminderSent && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs flex items-center justify-between font-medium">
                <span>✓ Reminders dispatched via Email & Slack to 38 pending employees. Next escalation trigger in 48h.</span>
                <button onClick={() => setReminderSent(false)} className="text-emerald-700 hover:text-emerald-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-white border border-[#D9E2F2] shadow-sm">
                <div className="text-[11px] text-[#5E7174] flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-500" /> Target Employees
                </div>
                <div className="text-lg font-bold text-[#1B2D32] mt-1">450 Total Staff</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Consented
                </div>
                <div className="text-lg font-bold text-emerald-700 mt-1">412 (91.5%)</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-amber-200 shadow-sm">
                <div className="text-[11px] text-amber-700 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending Consent
                </div>
                <div className="text-lg font-bold text-amber-700 mt-1">38 (8.5%)</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-rose-200 shadow-sm">
                <div className="text-[11px] text-rose-700 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-rose-600" /> System Access Lock
                </div>
                <div className="text-xs font-bold text-rose-700 mt-1.5">Active on Due Date</div>
              </div>
            </div>
          </div>

          {/* TAB 1: Policy Hub */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {policies.map((p) => (
                  <div key={p.id} className="rounded-xl border border-[#D9E2F2] bg-white p-5 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-slate-100 text-slate-800 px-2 py-0.5 text-[10px] font-bold">
                          v{p.version}
                        </span>
                        {p.is_acknowledged ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" /> Acknowledged
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Clock className="h-4 w-4" /> Action Required
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#1B2D32]">{p.title}</h3>
                      <p className="text-xs text-[#5E7174]">
                        Mandatory organization policy. Effective from {new Date(p.effective_from).toLocaleDateString()}.
                      </p>
                    </div>
                    <div>
                      {p.is_acknowledged ? (
                        <div className="text-[11px] text-[#5E7174] bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                          Consented on {new Date(p.acknowledged_at!).toLocaleDateString()} with verified digital audit log.
                        </div>
                      ) : (
                        <button
                          onClick={() => setAcknowledgingPolicy(p)}
                          className="w-full rounded-lg bg-[#187F7A] py-2 text-xs font-semibold text-white hover:bg-[#146A66] transition shadow-sm"
                        >
                          Read & Acknowledge Policy
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Employee Vault */}
          {activeTab === 'vault' && (
            <div className="rounded-xl border border-[#D9E2F2] bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#D9E2F2] flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-xs uppercase tracking-wider text-[#5E7174]">
                  Employee Vault Documents ({vaultDocs.length})
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  AES-256 Encrypted Storage
                </span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                  <tr>
                    <th className="px-6 py-4">Document Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Verification Status</th>
                    <th className="px-6 py-4">Expiry Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E2F2]">
                  {vaultDocs.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#187F7A]" /> {d.title}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{d.category}</td>
                      <td className="px-6 py-4 text-xs font-mono text-[#5E7174]">{d.file_type}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">
                        {d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : 'Lifetime'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#187F7A] hover:underline">
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Expiry Radar */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <strong className="font-semibold">Statutory Renewal Radar:</strong> 2 documents have upcoming expiration dates requiring renewal notification before compliance breach.
                </div>
              </div>
              <div className="rounded-xl border border-[#D9E2F2] bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                    <tr>
                      <th className="px-6 py-4">Document</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4">Urgency Window</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2F2]">
                    {expiringDocs.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-[#1B2D32]">{d.title}</td>
                        <td className="px-6 py-4 text-xs text-[#5E7174]">{d.category}</td>
                        <td className="px-6 py-4 text-xs font-bold text-rose-700">
                          {new Date(d.expiry_date!).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-semibold">
                            Expires Soon (&lt;60 Days)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="rounded border border-[#D9E2F2] px-3 py-1 text-xs font-semibold text-[#187F7A] hover:bg-[#187F7A]/10 transition">
                            Trigger Renewal Alert
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Consent Audit Log */}
          {activeTab === 'audit' && (
            <div className="rounded-xl border border-[#D9E2F2] bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#D9E2F2] flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-xs uppercase tracking-wider text-[#5E7174]">
                  Employee Consent Audit Tracker
                </span>
                <span className="text-xs text-[#5E7174]">Live Immutable Cryptographic Records</span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#D9E2F2] bg-[#F4F2EC] text-xs font-semibold uppercase text-[#5E7174]">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Consent Status</th>
                    <th className="px-6 py-4">Signature Timestamp</th>
                    <th className="px-6 py-4 text-right">Audit Footprint / IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E2F2]">
                  {CONSENT_AUDIT_LOG.map((aud) => (
                    <tr key={aud.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-[#1B2D32]">{aud.name}</td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{aud.dept}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            aud.status === 'Opt-In Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {aud.status === 'Opt-In Accepted' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {aud.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5E7174]">{aud.timestamp}</td>
                      <td className="px-6 py-4 text-right text-xs font-mono text-[#5E7174]">{aud.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Acknowledge Policy Modal */}
      {acknowledgingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2]">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-4">
              <h3 className="text-lg font-bold text-[#1B2D32]">{acknowledgingPolicy.title}</h3>
              <button onClick={() => setAcknowledgingPolicy(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs text-[#5E7174] max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-lg">
              <p>
                By digitally acknowledging this document, you confirm that you have read, understood, and agree to strictly comply with all provisions, standards, and guidelines set forth in this policy.
              </p>
              <p>
                Violations of this policy may result in disciplinary action up to and including separation of employment, in accordance with applicable statutory employment laws.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 bg-[#F4F2EC] rounded-lg text-xs text-[#1B2D32]">
              <ShieldCheck className="h-4 w-4 text-[#187F7A]" /> Digital Signature logged with Client IP and Timestamp in immutable audit trail.
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-[#D9E2F2] pt-4">
              <button
                type="button"
                onClick={() => setAcknowledgingPolicy(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#5E7174] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcknowledge}
                className="rounded-lg bg-[#187F7A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#146A66]"
              >
                I Agree & Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Modal (Expiry Reminders Config or E-Sign Flow Settings) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D9E2F2] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E2F2] pb-3">
              <h3 className="text-base font-bold text-[#1B2D32]">
                {showConfigModal === 'expiry' ? 'Expiry Reminders Configuration' : 'E-Sign Flow Governance Settings'}
              </h3>
              <button onClick={() => setShowConfigModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-xs text-[#5E7174] space-y-3">
              {showConfigModal === 'expiry' ? (
                <>
                  <p>Configure automated escalation cadences for expiring statutory documents (Visas, Passports, Driver Licenses):</p>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label className="flex items-center gap-2 text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-[#187F7A]" /> 60-Day Prior Automated First Warning
                    </label>
                    <label className="flex items-center gap-2 text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-[#187F7A]" /> 30-Day Line Manager Escalation Trigger
                    </label>
                    <label className="flex items-center gap-2 text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-[#187F7A]" /> 7-Day HR Ops Compliance Lockout Notice
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <p>Enterprise Digital E-Signature Integration Profile:</p>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Provider:</span>
                      <span className="font-mono text-teal-800">CubeSign Digital API v2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Audit Certificate:</span>
                      <span className="text-emerald-700 font-semibold">Enabled (SHA-256)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Expiry Threshold:</span>
                      <span>14 Days Auto-Void</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConfigModal(null)}
                className="rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66]"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}