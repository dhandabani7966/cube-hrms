import { useState } from 'react';
import { User, Shield, Bell, Calendar, Send, CheckCircle2 } from 'lucide-react';

export function EssView() {
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isUpdateSubmitted, setIsUpdateSubmitted] = useState(false);
  const [isDelegationSubmitted, setIsDelegationSubmitted] = useState(false);

  // Update Request form state
  const [fieldToUpdate, setFieldToUpdate] = useState('current_address');
  const [proposedValue, setProposedValue] = useState('');

  // Delegation form state
  const [delegatee, setDelegatee] = useState('Sarah Jenkins');
  const [startDate, setStartDate] = useState('2026-12-20');
  const [endDate, setEndDate] = useState('2026-12-30');

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedValue) return;
    setIsUpdateSubmitted(true);
    setTimeout(() => setIsUpdateSubmitted(false), 4000);
    setProposedValue('');
  };

  const handleDelegationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDelegationSubmitted(true);
    setTimeout(() => setIsDelegationSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D9E2F2] pb-6">
        <h1 className="text-2xl font-bold text-[#1B2D32]">Employee Self-Service (ESS)</h1>
        <p className="text-sm text-[#5E7174]">Personal information, privacy settings, approval delegations, and announcements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Profile & Privacy */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#187F7A] text-white font-bold text-lg">
                JD
              </div>
              <div>
                <h3 className="font-bold text-[#1B2D32]">John Doe</h3>
                <p className="text-xs text-[#5E7174]">EMP-10003 &bull; Principal Software Engineer</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#5E7174] pt-3 border-t border-[#D9E2F2]">
              <div><strong className="text-[#1B2D32]">Work Email:</strong> john.doe@cubeai.internal</div>
              <div><strong className="text-[#1B2D32]">Department:</strong> Engineering</div>
              <div><strong className="text-[#1B2D32]">Reporting Manager:</strong> Sarah Jenkins</div>
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#187F7A] flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> Peer Directory Privacy Controls
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs text-[#1B2D32] cursor-pointer">
                <span>Show Mobile Phone to Peers</span>
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded border-[#D9E2F2] text-[#187F7A] focus:ring-[#187F7A] h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-[#1B2D32] cursor-pointer">
                <span>Show Personal Email to Peers</span>
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={(e) => setShowEmail(e.target.checked)}
                  className="rounded border-[#D9E2F2] text-[#187F7A] focus:ring-[#187F7A] h-4 w-4"
                />
              </label>
            </div>
            <p className="text-[11px] text-[#5E7174]">
              Changes update immediately in directory search results across the company.
            </p>
          </div>
        </div>

        {/* Center & Right Column: Actions & Bulletins */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Change Request Form */}
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1B2D32] flex items-center gap-2">
              <User className="h-4 w-4 text-[#187F7A]" /> Request Profile Information Correction
            </h3>
            <p className="text-xs text-[#5E7174]">
              Submit updates for HR verification (e.g. residential address, emergency contact, phone number).
            </p>

            {isUpdateSubmitted && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Request submitted successfully. Awaiting HR review.
              </div>
            )}

            <form onSubmit={handleProfileUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#5E7174]">Field to Update</label>
                  <select
                    value={fieldToUpdate}
                    onChange={(e) => setFieldToUpdate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="current_address">Residential Current Address</option>
                    <option value="emergency_contact">Emergency Contact Person</option>
                    <option value="mobile_phone">Mobile Contact Number</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#5E7174]">Proposed New Value</label>
                  <input
                    type="text"
                    required
                    value={proposedValue}
                    onChange={(e) => setProposedValue(e.target.value)}
                    placeholder="Enter updated information..."
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66]"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Change Request
                </button>
              </div>
            </form>
          </div>

          {/* Approval Delegation Form */}
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1B2D32] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#187F7A]" /> Approval Authority Delegation
            </h3>
            <p className="text-xs text-[#5E7174]">
              Delegate your approval authority to a peer manager while you are away on scheduled leave.
            </p>

            {isDelegationSubmitted && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Authority delegation active for specified date range.
              </div>
            )}

            <form onSubmit={handleDelegationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-[#5E7174]">Delegatee Peer</label>
                  <select
                    value={delegatee}
                    onChange={(e) => setDelegatee(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins (Engineering Manager)</option>
                    <option value="Priya Natarajan">Priya Natarajan (HR Director)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#5E7174]">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#5E7174]">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#D9E2F2] px-3 py-2 text-xs focus:border-[#187F7A] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-[#173D45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#123137]"
                >
                  Activate Delegation
                </button>
              </div>
            </form>
          </div>

          {/* Company Announcements Bulletin */}
          <div className="rounded-xl border border-[#D9E2F2] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1B2D32] flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#187F7A]" /> Official Noticeboard & Announcements
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#D9E2F2] bg-[#F4F2EC]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B2D32] text-sm">CubeAI Annual All-Hands & Strategy Summit 2026</span>
                  <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-semibold">INFO</span>
                </div>
                <p className="text-xs text-[#5E7174]">
                  We are delighted to welcome all team members to our annual summit on Dec 18th in Bangalore HQ!
                </p>
                <div className="text-[10px] text-[#5E7174] pt-1">Published by HR Operations &bull; Nov 15, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
