import { useState, useRef, useEffect } from 'react';
import {
  UserPlus, CheckCircle2, Clock, UserCheck, X, FileText, ExternalLink,
  ChevronDown, ArrowUpDown, Settings, Bell, GitBranch, Plus,
  Search, ChevronRight, Download, Trash2, Check, Eye,
  SlidersHorizontal, Upload, Sparkles
} from 'lucide-react';

import { useTheme } from '../../lib/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  official_email: string;
  mobile_phone: string;
  proposed_joining_date: string;
  department: string;
  designation: string;
  source_of_hire: string;
  pan_card: string;
  aadhaar: string;
  status: string;
  tasksCompleted: number;
  tasksTotal: number;
  alias?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  experience?: string;
  role?: string;
  panFile?: string;
}

interface EducationRow {
  id: string;
  school: string;
  degree: string;
  focus: string;
  graduation: string;
  title: string;
}

interface ExperienceRow {
  id: string;
  designation: string;
  industry: string;
  working: string;
  location: string;
  currentlyWorking: boolean;
}

interface EmailTemplate {
  key: string;
  title: string;
  subject: string;
  body: string;
  enabled: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c-1',
    first_name: 'Vikram',
    last_name: 'Rao',
    email: 'vikram.rao@example.com',
    official_email: 'vikram.rao@cubeai.internal',
    mobile_phone: '+91 97890 12345',
    proposed_joining_date: '2026-12-01',
    department: 'Engineering',
    designation: 'Principal Software Engineer',
    source_of_hire: 'LinkedIn',
    pan_card: 'ABCDE1234F',
    aadhaar: '987654321098',
    status: 'READY_FOR_DAY_ONE',
    tasksCompleted: 5,
    tasksTotal: 5,
    gender: 'Male',
    experience: '8 years',
  },
  {
    id: 'c-2',
    first_name: 'Sarah',
    last_name: 'Sanders',
    email: 'sarah.sanders@cubeai.internal',
    official_email: 'sarah.sanders@cubeai.internal',
    mobile_phone: '+1 555-001-0001',
    proposed_joining_date: '2026-12-10',
    department: 'Marketing',
    designation: 'Marketing Manager',
    source_of_hire: 'Job Portal',
    pan_card: 'BCDEF2345G',
    aadhaar: '876543210987',
    status: 'VERIFICATION_PENDING',
    tasksCompleted: 2,
    tasksTotal: 5,
    gender: 'Female',
    experience: '5 years',
  },
  {
    id: 'c-3',
    first_name: 'Rose',
    last_name: 'Stacy',
    email: 'rose.stacy@cubeai.internal',
    official_email: '',
    mobile_phone: '+1 555-002-0002',
    proposed_joining_date: '2026-12-20',
    department: 'Sales',
    designation: 'Sales Executive',
    source_of_hire: 'Job Portal',
    pan_card: 'CDEFG3456H',
    aadhaar: '765432109876',
    status: 'INVITED',
    tasksCompleted: 0,
    tasksTotal: 5,
    gender: 'Female',
    experience: '3 years',
  },
  {
    id: 'c-4',
    first_name: 'Mathew',
    last_name: 'Morales',
    email: 'mathew.morales@cubeai.internal',
    official_email: '',
    mobile_phone: '+1 555-003-0003',
    proposed_joining_date: '2027-01-10',
    department: 'Finance',
    designation: 'Finance Analyst',
    source_of_hire: 'Campus',
    pan_card: 'DEFGH4567J',
    aadhaar: '654321098765',
    status: 'INVITED',
    tasksCompleted: 0,
    tasksTotal: 5,
    gender: 'Male',
    experience: '1 year',
  },
  {
    id: 'c-5',
    first_name: 'Kevin',
    last_name: 'Parker',
    email: 'kevin.parker@cubeai.internal',
    official_email: '',
    mobile_phone: '+1 555-004-0004',
    proposed_joining_date: '2027-01-15',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    source_of_hire: 'LinkedIn',
    pan_card: 'EFGHI5678K',
    aadhaar: '543210987654',
    status: 'INVITED',
    tasksCompleted: 0,
    tasksTotal: 5,
    gender: 'Male',
    experience: '4 years',
  },
  {
    id: 'c-6',
    first_name: 'David',
    last_name: 'Rickman',
    email: 'david.rickman@cubeai.internal',
    official_email: '',
    mobile_phone: '+1 555-005-0005',
    proposed_joining_date: '2027-01-20',
    department: 'Product',
    designation: 'Product Manager',
    source_of_hire: 'Job Portal',
    pan_card: 'FGHIJ6789L',
    aadhaar: '432109876543',
    status: 'INVITED',
    tasksCompleted: 0,
    tasksTotal: 5,
    gender: 'Male',
    experience: '6 years',
  },
  {
    id: 'c-7',
    first_name: 'Ananya',
    last_name: 'Iyer',
    email: 'ananya.iyer@example.com',
    official_email: 'ananya.iyer@cubeai.internal',
    mobile_phone: '+91 97890 54321',
    proposed_joining_date: '2026-12-15',
    department: 'Human Resources',
    designation: 'HR Director',
    source_of_hire: 'Referral',
    pan_card: 'GHIJK7890M',
    aadhaar: '321098765432',
    status: 'VERIFICATION_PENDING',
    tasksCompleted: 3,
    tasksTotal: 5,
    gender: 'Female',
    experience: '10 years',
  },
  {
    id: 'c-8',
    first_name: 'Karan',
    last_name: 'Mehta',
    email: 'karan.mehta@example.com',
    official_email: '',
    mobile_phone: '+91 91234 56789',
    proposed_joining_date: '2027-01-05',
    department: 'Engineering',
    designation: 'Engineering Manager',
    source_of_hire: 'LinkedIn',
    pan_card: 'HIJKL8901N',
    aadhaar: '210987654321',
    status: 'INVITED',
    tasksCompleted: 0,
    tasksTotal: 5,
    gender: 'Male',
    experience: '7 years',
  },
];

const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    key: 'welcomeCandidate',
    title: 'Welcome email to candidate',
    subject: 'Welcome to CubeAI Solutions — Let’s kick off your onboarding!',
    body: 'Dear {{candidate_name}},\n\nWe are thrilled to welcome you to CubeAI Solutions! Please log in to your Candidate Portal using the link below to review your offer and complete pre-joining formalities.\n\nPortal: {{portal_url}}\nProposed Joining Date: {{joining_date}}\n\nWarm regards,\nCubeAI People Team',
    enabled: true,
  },
  {
    key: 'welcomeEmployee',
    title: 'Welcome email to employee',
    subject: 'Welcome to Day One at CubeAI Solutions!',
    body: 'Dear {{candidate_name}},\n\nHappy Day One! Your official employee account has been created. Check your inbox for your credentials and IT setup checklist.\n\nOfficial Email: {{official_email}}\nEmployee ID: {{employee_id}}\n\nBest,\nHR Operations',
    enabled: true,
  },
  {
    key: 'reinstatedCandidate',
    title: 'Candidate onboarding reinitiated email',
    subject: 'Onboarding Reinitiated for {{candidate_name}}',
    body: 'Dear {{candidate_name}},\n\nYour candidate onboarding flow has been reinitiated by HR. Please submit any pending documents or updated ID proofs.\n\nRegards,\nPeople Team',
    enabled: true,
  },
  {
    key: 'reinstatedEmployee',
    title: 'Employee onboarding reinitiated email',
    subject: 'Employee Onboarding Checklist Updated',
    body: 'Dear {{candidate_name}},\n\nYour induction tasks have been updated. Please complete the revised compliance declarations.',
    enabled: true,
  },
  {
    key: 'completionCandidate',
    title: 'Candidate onboarding completion email',
    subject: 'Congratulations! Pre-onboarding Completed',
    body: 'Dear {{candidate_name}},\n\nAll your pre-hire documents and statutory checks are verified! You are Ready For Day One.',
    enabled: true,
  },
  {
    key: 'completionEmployee',
    title: 'Employee onboarding completion email',
    subject: 'Day-One Induction Finalized',
    body: 'Dear {{candidate_name}},\n\nYour employment profile is active in our DBMS.',
    enabled: true,
  },
  {
    key: 'reopenedCandidate',
    title: 'Candidate onboarding reopened email',
    subject: 'Action Required: Onboarding Reopened for Corrections',
    body: 'Dear {{candidate_name}},\n\nPlease review your document submissions; some require re-upload.',
    enabled: false,
  },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#187F7A]' : 'bg-gray-400 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnboardingView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [mainTab, setMainTab] = useState<'operations' | 'configuration' | 'extendService' | 'permissions' | 'automation'>('operations');

  // Unified single-active-dropdown state (auto-closes other dropdowns)
  const [activeDropdown, setActiveDropdown] = useState<'candidateView' | 'dataFilter' | 'pageSize' | 'notifications' | null>(null);

  // Close open dropdown when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Candidate View Filter
  const [candidateView, setCandidateView] = useState<'ALL' | 'INVITED' | 'VERIFICATION_PENDING' | 'READY_FOR_DAY_ONE' | 'CONVERTED_TO_EMPLOYEE'>('ALL');

  // Scope filter (Reportees)
  const [dataFilter, setDataFilter] = useState<string>('Reportees + My Data');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting
  const [sortField, setSortField] = useState<keyof Candidate>('proposed_joining_date');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Drawers
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
  const [convertingCandidate, setConvertingCandidate] = useState<Candidate | null>(null);
  const [offerCandidate, setOfferCandidate] = useState<Candidate | null>(null);
  const [portalCandidate, setPortalCandidate] = useState<Candidate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scroll ref for horizontal table navigation
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Status Filter for legacy pipeline
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Add Candidate Form State
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDept, setFormDept] = useState('Engineering');
  const [formDesig, setFormDesig] = useState('Senior Software Engineer');
  const [formDate, setFormDate] = useState('2026-12-15');
  const [formAlias, setFormAlias] = useState('');
  const [formPan, setFormPan] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formDob, setFormDob] = useState('');
  const [formNationality, setFormNationality] = useState('Indian');
  const [formExperience, setFormExperience] = useState('3 years');
  const [formSourceOfHire, setFormSourceOfHire] = useState('LinkedIn');
  const [formRole, setFormRole] = useState('Full Stack Engineer');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [panFileName, setPanFileName] = useState('');

  // Address state
  const [permAddr1, setPermAddr1] = useState('');
  const [permAddr2, setPermAddr2] = useState('');
  const [permCity, setPermCity] = useState('');
  const [permState, setPermState] = useState('');
  const [permPostal, setPermPostal] = useState('');
  const [permCountry, setPermCountry] = useState('India');

  const [currAddr1, setCurrAddr1] = useState('');
  const [currAddr2, setCurrAddr2] = useState('');
  const [currCity, setCurrCity] = useState('');
  const [currState, setCurrState] = useState('');
  const [currPostal, setCurrPostal] = useState('');
  const [currCountry, setCurrCountry] = useState('India');

  // Education & Experience
  const [eduRows, setEduRows] = useState<EducationRow[]>([
    { id: 'e-1', school: 'IIT Bombay', degree: 'B.Tech', focus: 'Computer Science', graduation: '2022', title: 'Graduate' },
  ]);
  const [expRows, setExpRows] = useState<ExperienceRow[]>([
    { id: 'x-1', designation: 'Software Engineer', industry: 'IT / SaaS', working: '2 years', location: 'Bangalore', currentlyWorking: false },
  ]);

  // Convert Form
  const [officialEmail, setOfficialEmail] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

  // Configuration State
  const [candidateOnboardingEnabled, setCandidateOnboardingEnabled] = useState(true);
  const [employeeOnboardingEnabled, setEmployeeOnboardingEnabled] = useState(true);
  const [offerLetterEnabled, setOfferLetterEnabled] = useState(false);
  const [appointmentLetterEnabled, setAppointmentLetterEnabled] = useState(false);
  const [configSideTab, setConfigSideTab] = useState<'preferences' | 'candidateOnboarding' | 'employeeOnboarding'>('preferences');

  // Preferences form
  const [prefIdPrefix, setPrefIdPrefix] = useState('EMP-');
  const [prefProbationDays, setPrefProbationDays] = useState(90);
  const [prefOfferExpiryDays, setPrefOfferExpiryDays] = useState(14);

  // Automation State
  const [autoSideTab, setAutoSideTab] = useState<'notifications' | 'workflows' | 'actions' | 'templates' | 'logs'>('notifications');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(INITIAL_TEMPLATES);
  const [reminderCandidate, setReminderCandidate] = useState(true);

  // RBAC Permissions State
  const [rbacPermissions, setRbacPermissions] = useState<Array<{
    role: string;
    view: boolean;
    add: boolean;
    verify: boolean;
    convert: boolean;
    config: boolean;
  }>>(() => {
    const saved = localStorage.getItem('cubeai_onboarding_rbac');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved RBAC permissions', err);
      }
    }
    return [
      { role: 'Super Admin', view: true, add: true, verify: true, convert: true, config: true },
      { role: 'HR Admin', view: true, add: true, verify: true, convert: true, config: true },
      { role: 'Hiring Manager', view: true, add: true, verify: false, convert: false, config: false },
      { role: 'Team Lead', view: true, add: false, verify: false, convert: false, config: false },
      { role: 'Employee', view: false, add: false, verify: false, convert: false, config: false },
    ];
  });

  const toggleRbacPermission = (role: string, perm: 'view' | 'add' | 'verify' | 'convert' | 'config') => {
    setRbacPermissions(prev =>
      prev.map(r => r.role === role ? { ...r, [perm]: !r[perm] } : r)
    );
  };

  const handleSaveRbacPermissions = () => {
    localStorage.setItem('cubeai_onboarding_rbac', JSON.stringify(rbacPermissions));
    showToast('Role-based access control permissions saved successfully!');
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyPermanentAddress = () => {
    setCurrAddr1(permAddr1);
    setCurrAddr2(permAddr2);
    setCurrCity(permCity);
    setCurrState(permState);
    setCurrPostal(permPostal);
    setCurrCountry(permCountry);
    showToast('Permanent address copied to current address!');
  };

  const handleScrollTable = (direction: 'left' | 'right') => {
    if (tableContainerRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      tableContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSort = (field: keyof Candidate) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // ─── Filtering & Pagination ────────────────────────────────────────────────

  const filteredCandidates = candidates.filter((c) => {
    if (candidateView !== 'ALL' && c.status !== candidateView) return false;

    if (dataFilter === 'My Data') {
      if (c.source_of_hire !== 'LinkedIn' && c.department !== 'Engineering') return false;
    } else if (dataFilter === "Direct Reportees' Data") {
      if (c.department !== 'Engineering' && c.department !== 'Product') return false;
    } else if (dataFilter === "Reportees' Data") {
      if (c.department === 'Finance') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.designation.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const valA = (a[sortField] || '').toString().toLowerCase();
    const valB = (b[sortField] || '').toString().toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalRecords = sortedCandidates.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedCandidates = sortedCandidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const legacyFiltered = candidates.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const isAllSelected = paginatedCandidates.length > 0 && paginatedCandidates.every(c => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set(selectedIds);
      paginatedCandidates.forEach(c => next.add(c.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const resetForm = () => {
    setFormFirstName(''); setFormLastName(''); setFormEmail('');
    setFormPhone(''); setFormAlias(''); setFormPan('');
    setFormGender('Male'); setFormDob(''); setFormNationality('Indian');
    setFormExperience('3 years'); setFormSourceOfHire('LinkedIn');
    setFormRole('Full Stack Engineer'); setFormVideoUrl('');
    setPanFileName('');
    setPermAddr1(''); setPermAddr2(''); setPermCity(''); setPermState(''); setPermPostal('');
    setCurrAddr1(''); setCurrAddr2(''); setCurrCity(''); setCurrState(''); setCurrPostal('');
    setEduRows([{ id: 'e-1', school: 'IIT Bombay', degree: 'B.Tech', focus: 'Computer Science', graduation: '2022', title: 'Graduate' }]);
    setExpRows([{ id: 'x-1', designation: 'Software Engineer', industry: 'IT / SaaS', working: '2 years', location: 'Bangalore', currentlyWorking: false }]);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formEmail) return;
    const newCandidate: Candidate = {
      id: `c-${Date.now()}`,
      first_name: formFirstName,
      last_name: formLastName,
      email: formEmail,
      official_email: '',
      mobile_phone: formPhone || '+91 98400 00000',
      proposed_joining_date: formDate,
      department: formDept,
      designation: formDesig,
      source_of_hire: formSourceOfHire,
      pan_card: '**********',
      aadhaar: '**********',
      status: 'INVITED',
      tasksCompleted: 0,
      tasksTotal: 5,
    };
    setCandidates([newCandidate, ...candidates]);
    setIsInviteOpen(false);
    resetForm();
    showToast('Candidate invitation sent successfully!');
  };

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formEmail) return;
    const newCandidate: Candidate = {
      id: `c-${Date.now()}`,
      first_name: formFirstName,
      last_name: formLastName,
      email: formEmail,
      official_email: '',
      mobile_phone: formPhone || '+1 555-010-0000',
      proposed_joining_date: formDate,
      department: formDept,
      designation: formDesig,
      source_of_hire: formSourceOfHire,
      pan_card: formPan ? formPan.slice(0, 4) + '******' : 'ABCDE1234F',
      aadhaar: '**********',
      status: 'INVITED',
      tasksCompleted: 0,
      tasksTotal: 5,
      alias: formAlias,
      gender: formGender,
      dob: formDob,
      nationality: formNationality,
      experience: formExperience,
      role: formRole,
      panFile: panFileName,
    };
    setCandidates([newCandidate, ...candidates]);
    setIsAddCandidateOpen(false);
    resetForm();
    showToast('Candidate record created successfully!');
  };

  const handleStartConvert = (c: Candidate) => {
    setConvertingCandidate(c);
    setOfficialEmail(`${c.first_name.toLowerCase()}.${c.last_name.toLowerCase()}@cubeai.internal`);
    setEmployeeCode(`EMP-${Math.floor(10010 + Math.random() * 89990)}`);
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingCandidate) return;
    setCandidates(candidates.map(c =>
      c.id === convertingCandidate.id
        ? { ...c, status: 'CONVERTED_TO_EMPLOYEE', tasksCompleted: 5, official_email: officialEmail }
        : c
    ));
    setConvertingCandidate(null);
    showToast('Candidate converted to employee successfully!');
  };

  const handleBulkStatusChange = (newStatus: string) => {
    setCandidates(candidates.map(c => selectedIds.has(c.id) ? { ...c, status: newStatus } : c));
    showToast(`Updated status to ${newStatus} for ${selectedIds.size} candidates.`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} candidates?`)) {
      setCandidates(candidates.filter(c => !selectedIds.has(c.id)));
      showToast(`Deleted ${selectedIds.size} candidates.`);
      setSelectedIds(new Set());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY_FOR_DAY_ONE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 className="h-3 w-3" /> Ready For Day One</span>;
      case 'VERIFICATION_PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="h-3 w-3" /> Verification Pending</span>;
      case 'INVITED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><Clock className="h-3 w-3" /> Invited</span>;
      case 'CONVERTED_TO_EMPLOYEE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"><UserCheck className="h-3 w-3" /> Converted to Employee</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getLifecycleStatusBadge = (status: string) => {
    switch (status) {
      case 'READY_FOR_DAY_ONE':
        return <span className={`inline-flex items-center gap-1 text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Ready For Day One</span>;
      case 'VERIFICATION_PENDING':
        return <span className={`inline-flex items-center gap-1 text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}><Clock className="h-3 w-3 text-amber-500" /> Verification Pending</span>;
      case 'INVITED':
        return <span className={`inline-flex items-center gap-1 text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}><Clock className="h-3 w-3 text-blue-500" /> Invited</span>;
      case 'CONVERTED_TO_EMPLOYEE':
        return <span className={`inline-flex items-center gap-1 text-xs font-medium ${isDark ? 'text-purple-400' : 'text-purple-700'}`}><UserCheck className="h-3 w-3 text-purple-500" /> Converted</span>;
      default:
        return <span className="text-xs text-gray-400">{status}</span>;
    }
  };

  return (
    <div className={`min-h-screen -mx-6 -mt-6 font-sans relative transition-colors duration-200 ${
      isDark ? 'bg-[#1a1a1a] text-gray-100' : 'bg-[#F8FAFF] text-[#0B1730]'
    }`}>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2 bg-[#187F7A] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm border border-emerald-400 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* ── Top Tab Bar ── */}
      <div className={`border-b flex items-center gap-0 px-4 select-none transition-colors ${
        isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-[#D9E2F2]'
      }`}>
        <button
          onClick={() => setMainTab('operations')}
          className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition border-b-2 cursor-pointer ${
            mainTab === 'operations'
              ? isDark ? 'border-blue-500 text-blue-400 font-semibold' : 'border-[#187F7A] text-[#187F7A] font-bold'
              : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
          }`}
        >
          <h1 className="text-sm font-semibold tracking-wide">Onboarding</h1>
        </button>
        <button
          onClick={() => setMainTab('configuration')}
          className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition border-b-2 cursor-pointer ${
            mainTab === 'configuration'
              ? isDark ? 'border-blue-500 text-blue-400 font-semibold' : 'border-[#187F7A] text-[#187F7A] font-bold'
              : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
          }`}
        >
          Configuration
        </button>
        <button
          onClick={() => setMainTab('extendService')}
          className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition border-b-2 cursor-pointer ${
            mainTab === 'extendService'
              ? isDark ? 'border-blue-500 text-blue-400 font-semibold' : 'border-[#187F7A] text-[#187F7A] font-bold'
              : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
          }`}
        >
          Extend Service
        </button>
        <button
          onClick={() => setMainTab('permissions')}
          className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition border-b-2 cursor-pointer ${
            mainTab === 'permissions'
              ? isDark ? 'border-blue-500 text-blue-400 font-semibold' : 'border-[#187F7A] text-[#187F7A] font-bold'
              : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
          }`}
        >
          Permissions
        </button>
        <button
          onClick={() => setMainTab('automation')}
          className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition border-b-2 cursor-pointer ${
            mainTab === 'automation'
              ? isDark ? 'border-blue-500 text-blue-400 font-semibold' : 'border-[#187F7A] text-[#187F7A] font-bold'
              : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-[#5E7174] hover:text-[#0B1730]'
          }`}
        >
          Automation
        </button>

        {/* Top-Right Action Shortcuts */}
        <div className="ml-auto flex items-center gap-2 py-2">
          {showSearchInput && (
            <div className="relative animate-in fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={`rounded px-3 py-1 text-xs focus:outline-none w-44 ${
                  isDark
                    ? 'bg-[#222] border border-[#444] text-gray-200 focus:border-blue-500'
                    : 'bg-white border border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            title="Search candidates"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#252525]' : 'text-gray-600 hover:text-[#0B1730] hover:bg-slate-100'
            }`}
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="relative" data-dropdown="notifications">
            <button
              onClick={() => setActiveDropdown(curr => curr === 'notifications' ? null : 'notifications')}
              title="Notifications"
              className={`p-1.5 rounded transition cursor-pointer relative ${
                isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#252525]' : 'text-gray-600 hover:text-[#0B1730] hover:bg-slate-100'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#187F7A]" />
            </button>
            {activeDropdown === 'notifications' && (
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-lg shadow-2xl p-3 z-50 text-xs space-y-2 border ${
                isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 font-semibold ${isDark ? 'border-[#333] text-gray-200' : 'border-[#E2E8F0] text-[#0B1730]'}`}>
                  <span>Onboarding Notifications</span>
                  <button onClick={() => setActiveDropdown(null)}><X className="h-3.5 w-3.5 text-gray-400" /></button>
                </div>
                <div className={`p-2 rounded ${isDark ? 'bg-[#2a2a2a]' : 'bg-slate-50'}`}>
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>Sarah Sanders submitted PAN card</div>
                  <div className="text-gray-400 text-[10px]">10 minutes ago</div>
                </div>
                <div className={`p-2 rounded ${isDark ? 'bg-[#2a2a2a]' : 'bg-slate-50'}`}>
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>Rose Stacy accepted offer letter</div>
                  <div className="text-gray-400 text-[10px]">1 hour ago</div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setMainTab('configuration')}
            title="Onboarding Settings"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#252525]' : 'text-gray-600 hover:text-[#0B1730] hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 1: OPERATIONS (Candidate List View)
      ═══════════════════════════════════════════════════════════════════ */}
      {mainTab === 'operations' && (
        <div className="flex flex-col h-full">

          {/* Sub-toolbar */}
          <div className={`border-b flex items-center gap-3 px-4 py-2.5 flex-wrap transition-colors relative z-40 ${
            isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#D9E2F2]'
          }`}>

            {/* Candidate View Dropdown */}
            <div className="relative" data-dropdown="candidateView">
              <button
                onClick={() => setActiveDropdown(curr => curr === 'candidateView' ? null : 'candidateView')}
                className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition ${
                  isDark
                    ? 'bg-[#2a2a2a] border-[#444] text-gray-200 hover:border-gray-500'
                    : 'bg-white border-[#D9E2F2] text-[#1B2D32] hover:bg-slate-50'
                }`}
              >
                <span>
                  {candidateView === 'ALL' && 'Candidate View — All'}
                  {candidateView === 'INVITED' && 'Candidate View — Invited'}
                  {candidateView === 'VERIFICATION_PENDING' && 'Candidate View — Pending'}
                  {candidateView === 'READY_FOR_DAY_ONE' && 'Candidate View — Day One'}
                  {candidateView === 'CONVERTED_TO_EMPLOYEE' && 'Candidate View — Converted'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {activeDropdown === 'candidateView' && (
                <div className={`absolute left-0 top-full mt-1.5 z-50 border rounded-lg shadow-2xl w-60 py-1 transition-all animate-in fade-in zoom-in-95 ${
                  isDark ? 'bg-[#252525] border-[#444]' : 'bg-white border-[#D9E2F2]'
                }`}>
                  {[
                    { id: 'ALL', label: 'All Candidates' },
                    { id: 'INVITED', label: 'Invited Candidates' },
                    { id: 'VERIFICATION_PENDING', label: 'Pending Verification' },
                    { id: 'READY_FOR_DAY_ONE', label: 'Ready For Day One' },
                    { id: 'CONVERTED_TO_EMPLOYEE', label: 'Converted to Employee' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setCandidateView(opt.id as typeof candidateView);
                        setActiveDropdown(null);
                        setCurrentPage(1);
                        showToast(`Filtered by ${opt.label}`);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs transition cursor-pointer ${
                        candidateView === opt.id
                          ? isDark ? 'text-blue-400 font-semibold bg-[#2e2e2e]' : 'text-[#187F7A] font-bold bg-[#187F7A]/10'
                          : isDark ? 'text-gray-200 hover:bg-[#333]' : 'text-[#1B2D32] hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit View Button */}
            <button
              onClick={() => setIsEditViewOpen(true)}
              className="text-xs font-semibold text-[#187F7A] hover:underline cursor-pointer"
            >
              Edit
            </button>

            {/* View All Data Link */}
            <button
              onClick={() => {
                setCandidateView('ALL');
                setDataFilter('Reportees + My Data');
                setSearchQuery('');
                setCurrentPage(1);
                showToast('Displaying all candidate records');
              }}
              className="text-xs font-semibold text-[#187F7A] hover:underline cursor-pointer"
            >
              View All Data
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bulk Action Bar (when candidates are selected) */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 bg-[#187F7A]/15 px-3 py-1 rounded-md border border-[#187F7A]/30 text-xs animate-in fade-in">
                <span className="font-semibold text-[#187F7A]">{selectedIds.size} selected</span>
                <div className="h-3 w-px bg-gray-400" />
                <button
                  onClick={() => handleBulkStatusChange('READY_FOR_DAY_ONE')}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Check className="h-3 w-3" /> Mark Ready
                </button>
                <button
                  onClick={() => handleBulkStatusChange('VERIFICATION_PENDING')}
                  className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Clock className="h-3 w-3" /> Mark Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-gray-500 hover:text-gray-700 ml-1 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Scope Filter Dropdown */}
            <div className="relative" data-dropdown="dataFilter">
              <button
                onClick={() => setActiveDropdown(curr => curr === 'dataFilter' ? null : 'dataFilter')}
                className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-medium min-w-[190px] justify-between cursor-pointer transition ${
                  isDark
                    ? 'bg-[#2a2a2a] border-[#444] text-gray-200 hover:border-gray-500'
                    : 'bg-white border-[#D9E2F2] text-[#1B2D32] hover:bg-slate-50'
                }`}
              >
                <span>{dataFilter}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {activeDropdown === 'dataFilter' && (
                <div className={`absolute right-0 top-full mt-1.5 z-50 border rounded-lg shadow-2xl w-60 py-1 transition-all animate-in fade-in zoom-in-95 ${
                  isDark ? 'bg-[#252525] border-[#444]' : 'bg-white border-[#D9E2F2]'
                }`}>
                  {['Reportees + My Data', "Reportees' Data", "Direct Reportees' Data", 'My Data'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDataFilter(opt);
                        setActiveDropdown(null);
                        setCurrentPage(1);
                        showToast(`View updated: ${opt}`);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs transition cursor-pointer ${
                        dataFilter === opt
                          ? isDark ? 'text-blue-400 font-semibold bg-[#2e2e2e]' : 'text-[#187F7A] font-bold bg-[#187F7A]/10'
                          : isDark ? 'text-gray-200 hover:bg-[#333]' : 'text-[#1B2D32] hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Candidate Button */}
            <button
              onClick={() => { resetForm(); setIsAddCandidateOpen(true); }}
              className="flex items-center gap-1.5 bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Candidate</span>
            </button>

            {/* Invite Candidate Button (E2E Test Required) */}
            <button
              onClick={() => { resetForm(); setIsInviteOpen(true); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs border ${
                isDark
                  ? 'bg-[#252525] hover:bg-[#333] text-gray-200 border-[#444]'
                  : 'bg-white hover:bg-slate-50 text-[#187F7A] border-[#D9E2F2]'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite Candidate
            </button>

            {/* Horizontal Scroll Quick Buttons */}
            <div className={`flex items-center gap-1 ml-1 p-0.5 rounded border ${
              isDark ? 'bg-[#252525] border-[#333]' : 'bg-slate-100 border-[#D9E2F2]'
            }`}>
              <button
                onClick={() => handleScrollTable('left')}
                title="Scroll Left"
                className="p-1 hover:text-[#187F7A] rounded text-gray-400 cursor-pointer text-xs"
              >
                &larr;
              </button>
              <button
                onClick={() => handleScrollTable('right')}
                title="Scroll Right"
                className="p-1 hover:text-[#187F7A] rounded text-gray-400 cursor-pointer text-xs"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* ── Candidate Data Grid: Completely Non-Overlapping Responsive Layout ── */}
          <div
            ref={tableContainerRef}
            className={`flex-1 overflow-x-auto overflow-y-auto scroll-smooth border-b transition-colors ${
              isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#D9E2F2]'
            }`}
            style={{ maxHeight: 'calc(100vh - 290px)' }}
          >
            {/* Total explicit width: 40+32+144+144+224+192+192+160+144+176+192+96 = 1744px */}
            <div className="w-max min-w-[1744px]">

              {/* Header Row */}
              <div className={`border-b flex items-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none ${
                isDark ? 'border-[#333] text-gray-400' : 'border-[#D9E2F2] text-[#5E7174]'
              }`}>
                {/* 1. Checkbox - Frozen / Sticky left-0 */}
                <div className={`px-3 py-3 w-10 shrink-0 flex items-center justify-center sticky top-0 left-0 z-30 transition-colors ${
                  isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                }`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-[#187F7A] cursor-pointer"
                    title="Select all on this page"
                  />
                </div>

                {/* 2. # Index - Frozen / Sticky left-[40px] */}
                <div className={`px-2 py-3 w-8 shrink-0 text-gray-400 text-center sticky top-0 left-[40px] z-30 transition-colors ${
                  isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                }`}>#</div>

                {/* 3. First name - Frozen / Sticky left-[72px] */}
                <div
                  onClick={() => handleSort('first_name')}
                  className={`px-3 py-3 w-36 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 left-[72px] z-30 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>First name</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>

                {/* 4. Last name - Frozen / Sticky left-[216px] */}
                <div
                  onClick={() => handleSort('last_name')}
                  className={`px-3 py-3 w-36 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 left-[216px] z-30 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Last name</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>

                {/* 5. Email ID - Frozen / Sticky left-[360px] with divider & shadow to mark freeze boundary */}
                <div
                  onClick={() => handleSort('email')}
                  className={`px-3 py-3 w-56 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 left-[360px] z-30 border-r transition-colors ${
                    isDark
                      ? 'bg-[#222] border-[#333] shadow-[4px_0_8px_-2px_rgba(0,0,0,0.5)]'
                      : 'bg-[#F4F6FB] border-[#D9E2F2] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  <span>Email ID</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>

                {/* Remaining columns scroll horizontally under / past the frozen columns */}
                <div
                  onClick={() => handleSort('official_email')}
                  className={`px-3 py-3 w-48 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Official Email</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div
                  onClick={() => handleSort('status')}
                  className={`px-3 py-3 w-48 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Onboarding Status</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div
                  onClick={() => handleSort('department')}
                  className={`px-3 py-3 w-40 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Department</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div
                  onClick={() => handleSort('source_of_hire')}
                  className={`px-3 py-3 w-36 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Source of Hire</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div
                  onClick={() => handleSort('pan_card')}
                  className={`px-3 py-3 w-44 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>PAN card number</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div
                  onClick={() => handleSort('aadhaar')}
                  className={`px-3 py-3 w-48 shrink-0 flex items-center gap-1 hover:text-[#187F7A] cursor-pointer truncate sticky top-0 z-20 transition-colors ${
                    isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                  }`}
                >
                  <span>Aadhaar card number</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" />
                </div>
                <div className={`px-3 py-3 w-24 shrink-0 text-right sticky top-0 z-20 transition-colors ${
                  isDark ? 'bg-[#222]' : 'bg-[#F4F6FB]'
                }`}>
                  Actions
                </div>
              </div>

              {/* Data Rows */}
              {paginatedCandidates.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-sm">
                  No candidates match the selected filters or search query.
                </div>
              ) : (
                paginatedCandidates.map((c, idx) => {
                  const isSelected = selectedIds.has(c.id);
                  const isEven = idx % 2 === 0;
                  const rowCellBg = isSelected
                    ? isDark ? 'bg-[#223344]' : 'bg-[#EBF7F6]'
                    : isEven
                    ? isDark ? 'bg-[#1e1e1e]' : 'bg-white'
                    : isDark ? 'bg-[#1a1a1a]' : 'bg-[#F9FAFC]';
                  const rowHoverBg = isDark ? 'group-hover:bg-[#252525]' : 'group-hover:bg-[#F0F4F8]';

                  return (
                    <div
                      key={c.id}
                      onClick={() => setDetailCandidate(c)}
                      className={`flex items-center border-b transition cursor-pointer group text-xs ${rowCellBg} ${rowHoverBg} ${
                        isDark ? 'border-[#2a2a2a]' : 'border-[#EDF2F7]'
                      }`}
                    >
                      {/* 1. Checkbox - Frozen / Sticky left-0 */}
                      <div
                        className={`px-3 py-3 w-10 shrink-0 flex items-center justify-center sticky left-0 z-10 transition-colors ${rowCellBg} ${rowHoverBg}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(c.id)}
                          onChange={() => toggleSelectOne(c.id)}
                          className="w-3.5 h-3.5 accent-[#187F7A] cursor-pointer"
                        />
                      </div>

                      {/* 2. # Index - Frozen / Sticky left-[40px] */}
                      <div className={`px-2 py-3 w-8 shrink-0 text-gray-400 text-center sticky left-[40px] z-10 transition-colors ${rowCellBg} ${rowHoverBg}`}>
                        {(currentPage - 1) * pageSize + idx + 1}
                      </div>

                      {/* 3. First Name - Frozen / Sticky left-[72px] */}
                      <div className={`px-3 py-3 w-36 shrink-0 font-semibold truncate group-hover:text-[#187F7A] transition sticky left-[72px] z-10 ${rowCellBg} ${rowHoverBg} ${
                        isDark ? 'text-gray-100' : 'text-[#1B2D32]'
                      }`}>
                        {c.first_name}
                      </div>

                      {/* 4. Last Name - Frozen / Sticky left-[216px] */}
                      <div className={`px-3 py-3 w-36 shrink-0 truncate sticky left-[216px] z-10 transition-colors ${rowCellBg} ${rowHoverBg} ${
                        isDark ? 'text-gray-100' : 'text-[#1B2D32]'
                      }`}>
                        {c.last_name}
                      </div>

                      {/* 5. Email ID - Frozen / Sticky left-[360px] with divider & shadow to mark freeze boundary */}
                      <div className={`px-3 py-3 w-56 shrink-0 text-[#187F7A] hover:underline truncate sticky left-[360px] z-10 border-r transition-colors ${rowCellBg} ${rowHoverBg} ${
                        isDark
                          ? 'border-[#333] shadow-[4px_0_8px_-2px_rgba(0,0,0,0.5)]'
                          : 'border-[#D9E2F2] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.08)]'
                      }`}>
                        {c.email}
                      </div>

                      {/* 6+. Scrollable Columns that slide under / past frozen columns */}
                      <div className="px-3 py-3 w-48 shrink-0 text-gray-500 truncate">{c.official_email || '—'}</div>
                      <div className="px-3 py-3 w-48 shrink-0 truncate">{getLifecycleStatusBadge(c.status)}</div>
                      <div className={`px-3 py-3 w-40 shrink-0 truncate ${isDark ? 'text-gray-300' : 'text-[#1B2D32]'}`}>{c.department}</div>
                      <div className={`px-3 py-3 w-36 shrink-0 truncate ${isDark ? 'text-gray-300' : 'text-[#5E7174]'}`}>{c.source_of_hire}</div>
                      <div className="px-3 py-3 w-44 shrink-0 font-mono tracking-wider text-gray-400 truncate">
                        {c.pan_card ? '**********' : '—'}
                      </div>
                      <div className="px-3 py-3 w-48 shrink-0 font-mono tracking-wider text-gray-400 truncate">
                        {c.aadhaar ? '**********' : '—'}
                      </div>
                      <div className="px-3 py-3 w-24 shrink-0 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setDetailCandidate(c)}
                          title="View 360 Details"
                          className={`p-1 rounded cursor-pointer transition ${
                            isDark ? 'text-gray-400 hover:text-white hover:bg-[#333]' : 'text-gray-500 hover:text-[#187F7A] hover:bg-slate-100'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Bottom Pagination Bar ── */}
          <div className={`border-t flex items-center justify-between px-4 py-2.5 text-xs select-none transition-colors ${
            isDark ? 'bg-[#1e1e1e] border-[#333] text-gray-400' : 'bg-white border-[#D9E2F2] text-[#5E7174]'
          }`}>
            <div>
              Total Record Count :{' '}
              <span className="font-bold text-[#187F7A]">{totalRecords}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="relative" data-dropdown="pageSize">
                <button
                  onClick={() => setActiveDropdown(curr => curr === 'pageSize' ? null : 'pageSize')}
                  className={`flex items-center gap-1.5 border rounded px-2.5 py-1 cursor-pointer transition ${
                    isDark ? 'bg-[#252525] border-[#444] text-gray-200 hover:border-gray-400' : 'bg-white border-[#D9E2F2] text-[#1B2D32] hover:bg-slate-50'
                  }`}
                >
                  <span>{pageSize}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                {activeDropdown === 'pageSize' && (
                  <div className={`absolute bottom-full mb-1 left-0 border rounded shadow-xl w-16 py-1 z-30 ${
                    isDark ? 'bg-[#252525] border-[#444]' : 'bg-white border-[#D9E2F2]'
                  }`}>
                    {[5, 10, 20, 50].map(sz => (
                      <button
                        key={sz}
                        onClick={() => { setPageSize(sz); setCurrentPage(1); setActiveDropdown(null); }}
                        className={`block w-full text-center py-1 cursor-pointer transition ${
                          pageSize === sz ? 'text-[#187F7A] font-bold' : isDark ? 'text-gray-300 hover:bg-[#333]' : 'text-[#1B2D32] hover:bg-slate-50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Record Range */}
              <span>
                {totalRecords === 0 ? '0 - 0' : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)}`} of {totalRecords}
              </span>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                  className="p-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-[#252525]"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                </button>
                <span className="font-medium px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  title="Next Page"
                  className="p-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-[#252525]"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Legacy Pipeline Table (E2E Test Integration) ── */}
          <div className={`border-t px-4 pb-4 transition-colors ${
            isDark ? 'bg-[#111] border-[#2a2a2a]' : 'bg-[#FAFCFF] border-[#E2E8F0]'
          }`}>
            <div className="pt-3 pb-2 flex items-center justify-between">
              <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-500' : 'text-[#5E7174]'}`}>
                Onboarding Pipeline — All Candidates
              </p>
            </div>

            {/* Status Filter Buttons (TC-T1-ONB-02) */}
            <div className="flex flex-wrap gap-2 mb-3">
              {['ALL', 'INVITED', 'VERIFICATION_PENDING', 'READY_FOR_DAY_ONE', 'CONVERTED_TO_EMPLOYEE'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#187F7A] text-white shadow-xs'
                      : isDark
                      ? 'bg-[#2a2a2a] border border-[#444] text-gray-400 hover:bg-[#333]'
                      : 'bg-white border border-[#D9E2F2] text-[#5E7174] hover:bg-slate-50'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Pipeline Table (TC-T1-ONB-01, TC-T1-ONB-04, TC-T1-ONB-05) */}
            <div className={`overflow-hidden rounded-xl border ${
              isDark ? 'border-[#333] bg-[#1e1e1e]' : 'border-[#D9E2F2] bg-white shadow-xs'
            }`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b uppercase font-semibold ${
                  isDark ? 'border-[#333] bg-[#222] text-gray-400' : 'border-[#D9E2F2] bg-[#F4F2EC] text-[#5E7174]'
                }`}>
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Role &amp; Dept</th>
                    <th className="px-4 py-3">Joining Date</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#2a2a2a]' : 'divide-[#D9E2F2]'}`}>
                  {legacyFiltered.map(c => (
                    <tr key={c.id} className={`transition ${isDark ? 'hover:bg-[#242424]' : 'hover:bg-slate-50/70'}`}>
                      <td className="px-4 py-3">
                        <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{c.first_name} {c.last_name}</div>
                        <div className="text-gray-400">{c.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={isDark ? 'text-gray-300' : 'text-[#1B2D32]'}>{c.designation}</div>
                        <div className="text-gray-400">{c.department}</div>
                      </td>
                      <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-[#1B2D32]'}`}>
                        {new Date(c.proposed_joining_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-20 rounded-full overflow-hidden ${isDark ? 'bg-[#333]' : 'bg-slate-200'}`}>
                            <div className="h-full bg-[#187F7A]" style={{ width: `${(c.tasksCompleted / c.tasksTotal) * 100}%` }} />
                          </div>
                          <span className="text-gray-400">{c.tasksCompleted}/{c.tasksTotal}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setOfferCandidate(c)}
                            className={`rounded border px-2 py-1 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition ${
                              isDark ? 'border-[#444] text-gray-400 hover:bg-[#333]' : 'border-[#D9E2F2] text-[#5E7174] hover:bg-slate-100'
                            }`}
                          >
                            <FileText className="h-3 w-3" /> Offer
                          </button>
                          <button
                            onClick={() => setPortalCandidate(c)}
                            className={`rounded border px-2 py-1 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition ${
                              isDark ? 'border-[#444] text-blue-400 hover:bg-[#333]' : 'border-[#D9E2F2] text-[#187F7A] hover:bg-slate-100'
                            }`}
                          >
                            <ExternalLink className="h-3 w-3" /> Portal
                          </button>
                          {c.status === 'READY_FOR_DAY_ONE' && (
                            <button
                              onClick={() => handleStartConvert(c)}
                              className="inline-flex items-center gap-1 rounded bg-[#187F7A] px-3 py-1 text-xs font-semibold text-white hover:bg-[#146A66] cursor-pointer"
                            >
                              Convert to Employee →
                            </button>
                          )}
                          {c.status === 'CONVERTED_TO_EMPLOYEE' && (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active in DBMS</span>
                          )}
                          {(c.status === 'INVITED' || c.status === 'VERIFICATION_PENDING') && (
                            <button
                              onClick={() => {
                                setCandidates(candidates.map(item =>
                                  item.id === c.id
                                    ? { ...item, status: 'READY_FOR_DAY_ONE', tasksCompleted: 5 }
                                    : item
                                ));
                                showToast('Documents verified. Candidate is Ready For Day One.');
                              }}
                              className="rounded border border-[#187F7A]/30 px-2.5 py-1 text-xs font-medium text-[#187F7A] hover:bg-[#187F7A]/10 cursor-pointer"
                            >
                              Verify All Docs
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 2: CONFIGURATION
      ═══════════════════════════════════════════════════════════════════ */}
      {mainTab === 'configuration' && (
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <div className={`w-60 border-r flex flex-col transition-colors ${
            isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#D9E2F2]'
          }`}>
            {[
              { key: 'preferences', label: 'Preferences' },
              { key: 'candidateOnboarding', label: 'Candidate Onboarding' },
              { key: 'employeeOnboarding', label: 'Employee Onboarding' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setConfigSideTab(item.key as typeof configSideTab)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-medium text-left transition cursor-pointer ${
                  configSideTab === item.key
                    ? isDark ? 'bg-[#2d2d2d] text-gray-100 font-semibold border-l-2 border-blue-500' : 'bg-[#187F7A]/10 text-[#187F7A] font-bold border-l-2 border-[#187F7A]'
                    : isDark ? 'text-gray-400 hover:bg-[#252525] hover:text-gray-200' : 'text-[#5E7174] hover:bg-slate-50 hover:text-[#1B2D32]'
                }`}
              >
                <span>{item.label}</span>
                {item.key !== 'preferences' && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
              </button>
            ))}

            {/* Go to Operations */}
            <div className={`mt-auto p-4 border-t ${isDark ? 'border-[#333]' : 'border-[#D9E2F2]'}`}>
              <button
                onClick={() => setMainTab('operations')}
                className="flex items-center gap-2 text-xs font-semibold text-[#187F7A] hover:underline transition cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Go to Operations
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {configSideTab === 'preferences' && (
              <>
                <div>
                  <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Manage onboarding flows</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable or disable the onboarding flows based on your organizational requirements
                  </p>
                </div>

                {/* Onboarding flows toggles */}
                <div className={`border rounded-xl overflow-hidden ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <div className={`flex items-start gap-4 p-5 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-[#D9E2F2]'}`}>
                    <Toggle
                      checked={candidateOnboardingEnabled}
                      onChange={v => { setCandidateOnboardingEnabled(v); showToast(`Candidate onboarding flow ${v ? 'enabled' : 'disabled'}`); }}
                    />
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Candidate onboarding</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                        A pre-onboarding flow designed to collect essential details from candidates who have been offered a job in your organization. It facilitates the distribution of offer letters and their acceptance for a streamlined hiring process.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5">
                    <Toggle
                      checked={employeeOnboardingEnabled}
                      onChange={v => { setEmployeeOnboardingEnabled(v); showToast(`Employee onboarding flow ${v ? 'enabled' : 'disabled'}`); }}
                    />
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Employee onboarding</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                        An onboarding flow designed to provide your new hire with a comprehensive introduction to the company, its policies, and team members on their joining date. It also outlines their goals and the training required for a smooth transition into their role.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer and Appointment Letters */}
                <div>
                  <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Offer and Appointment Letters</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Create and send customized offer and appointment letters with independent tracking to monitor candidate acceptances and rejections.
                  </p>
                </div>

                <div className={`border rounded-xl overflow-hidden ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <div className={`flex items-start gap-4 p-5 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-[#D9E2F2]'}`}>
                    <Toggle
                      checked={offerLetterEnabled}
                      onChange={v => { setOfferLetterEnabled(v); showToast(`Offer letter workflow ${v ? 'enabled' : 'disabled'}`); }}
                    />
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Offer Letter</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                        Offer letters is a formal document that extends a job offer to a candidate. It outlines the offered role and terms of employment. Once accepted, it confirms the candidate's intent to join the organization.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5">
                    <Toggle
                      checked={appointmentLetterEnabled}
                      onChange={v => { setAppointmentLetterEnabled(v); showToast(`Appointment letter workflow ${v ? 'enabled' : 'disabled'}`); }}
                    />
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Appointment Letter</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                        Appointment letter is a formal contract that confirms employment and are sent to the candidate shortly before their official date of joining, after the completion of the onboarding process.
                      </div>
                    </div>
                  </div>
                </div>

                {/* General Preferences Form */}
                <div className={`border rounded-xl p-5 space-y-4 ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Automation &amp; Identity Preferences</h3>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-500 mb-1">Employee Code Prefix</label>
                      <input
                        type="text"
                        value={prefIdPrefix}
                        onChange={e => setPrefIdPrefix(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Default Probation (Days)</label>
                      <input
                        type="number"
                        value={prefProbationDays}
                        onChange={e => setPrefProbationDays(Number(e.target.value))}
                        className={`w-full rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Offer Validity Window (Days)</label>
                      <input
                        type="number"
                        value={prefOfferExpiryDays}
                        onChange={e => setPrefOfferExpiryDays(Number(e.target.value))}
                        className={`w-full rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Onboarding preferences saved successfully!')}
                    className="bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </>
            )}

            {configSideTab === 'candidateOnboarding' && (
              <div className="space-y-4">
                <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Candidate Onboarding Stages</h2>
                <p className="text-xs text-gray-500">Configure sequential verification stages that candidates must satisfy.</p>
                <div className="space-y-3">
                  {[
                    { title: 'Stage 1: Job Offer & Digital Signature', desc: 'Candidate receives e-offer letter and signs digitally via OTP.' },
                    { title: 'Stage 2: Statutory Identity Declarations', desc: 'Collects PAN, Aadhaar, Passport, and Emergency Contact details.' },
                    { title: 'Stage 3: Educational & Past Employment Verification', desc: 'Uploads graduation transcripts and previous payslips.' },
                    { title: 'Stage 4: Bank Account & Direct Deposit Setup', desc: 'Direct deposit information and cancelled cheque copy.' },
                  ].map(stg => (
                    <div key={stg.title} className={`p-4 border rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                    }`}>
                      <div>
                        <div className={`font-semibold text-xs ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{stg.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{stg.desc}</div>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-semibold">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {configSideTab === 'employeeOnboarding' && (
              <div className="space-y-4">
                <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Day-One Employee Induction Tasks</h2>
                <p className="text-xs text-gray-500">Automated onboarding checklist assigned upon official conversion.</p>
                <div className="space-y-3">
                  {[
                    { task: 'Issue Laptop & Access Badge', owner: 'IT / Facilities', duration: 'Day 1' },
                    { task: 'Corporate Email & Slack Provisioning', owner: 'SysAdmin', duration: 'Day 1' },
                    { task: 'Benefits & Health Insurance Enrollment', owner: 'HR Operations', duration: 'Day 3' },
                    { task: 'Manager 1-on-1 & OKR Setting', owner: 'Reporting Manager', duration: 'Week 1' },
                  ].map(item => (
                    <div key={item.task} className={`p-4 border rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                    }`}>
                      <div>
                        <div className={`font-semibold text-xs ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{item.task}</div>
                        <div className="text-[11px] text-gray-500">Owner: {item.owner} &bull; Timeline: {item.duration}</div>
                      </div>
                      <button className="text-xs text-[#187F7A] font-medium hover:underline">Edit Task</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 3: EXTEND SERVICE
      ═══════════════════════════════════════════════════════════════════ */}
      {mainTab === 'extendService' && (
        <div className="p-8 max-w-4xl space-y-6">
          <div>
            <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Extend Onboarding Service</h2>
            <p className="text-xs text-gray-500 mt-1">Configure custom form extensions, third-party ATS webhooks, and integrations.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`border rounded-xl p-5 space-y-3 ${
              isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
            }`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-[#187F7A]">
                <GitBranch className="h-4 w-4" />
                <span>Enterprise ATS Integration</span>
              </div>
              <p className="text-xs text-gray-500">Sync candidates automatically from connected Applicant Tracking Systems when candidates reach 'Offer Accepted' status.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Connected &bull; Auto-sync active</span>
                <button onClick={() => showToast('Triggered candidate ATS synchronization')} className="text-xs bg-[#187F7A]/10 hover:bg-[#187F7A]/20 px-3 py-1.5 rounded text-[#187F7A] font-semibold cursor-pointer">
                  Sync Now
                </button>
              </div>
            </div>

            <div className={`border rounded-xl p-5 space-y-3 ${
              isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
            }`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-[#187F7A]">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Custom Onboarding Form Fields</span>
              </div>
              <p className="text-xs text-gray-500">Add custom fields such as T-shirt size, Dietary Preferences, or Equipment requests.</p>
              <button onClick={() => showToast('Custom Field Engine opened')} className="text-xs bg-[#187F7A] hover:bg-[#146A66] px-3.5 py-1.5 rounded text-white font-semibold cursor-pointer">
                + Add Custom Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 4: PERMISSIONS
      ═══════════════════════════════════════════════════════════════════ */}
      {mainTab === 'permissions' && (
        <div className="p-8 max-w-5xl space-y-6">
          <div>
            <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Onboarding Role-Based Access Control (RBAC)</h2>
            <p className="text-xs text-gray-500 mt-1">Configure field visibility and action authorization per organization persona.</p>
          </div>

          <div className={`border rounded-xl overflow-hidden ${
            isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
          }`}>
            <table className="w-full text-xs text-left">
              <thead className={`uppercase font-semibold ${
                isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-[#F4F2EC] text-[#5E7174]'
              }`}>
                <tr>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">View Candidates</th>
                  <th className="px-4 py-3 text-center">Add / Invite</th>
                  <th className="px-4 py-3 text-center">Verify Docs</th>
                  <th className="px-4 py-3 text-center">Convert to Employee</th>
                  <th className="px-4 py-3 text-center">Edit Settings</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#333]' : 'divide-[#D9E2F2]'}`}>
                {rbacPermissions.map(r => (
                  <tr key={r.role} className={isDark ? 'hover:bg-[#252525]' : 'hover:bg-slate-50'}>
                    <td className={`px-4 py-3 font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{r.role}</td>
                    {(['view', 'add', 'verify', 'convert', 'config'] as const).map(p => (
                      <td key={p} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={r[p]}
                          onChange={() => toggleRbacPermission(r.role, p)}
                          className="w-3.5 h-3.5 accent-[#187F7A] cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSaveRbacPermissions} className="bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition shadow-xs">
            Save Permissions
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 5: AUTOMATION
      ═══════════════════════════════════════════════════════════════════ */}
      {mainTab === 'automation' && (
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <div className={`w-60 border-r flex flex-col transition-colors ${
            isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#D9E2F2]'
          }`}>
            {[
              { key: 'notifications', label: 'Notifications' },
              { key: 'workflows', label: 'Workflows' },
              { key: 'actions', label: 'Actions' },
              { key: 'templates', label: 'Templates' },
              { key: 'logs', label: 'Workflow & Custom Button Logs' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setAutoSideTab(item.key as typeof autoSideTab)}
                className={`flex items-center px-4 py-3 text-xs font-medium text-left transition cursor-pointer ${
                  autoSideTab === item.key
                    ? isDark ? 'bg-[#2d2d2d] text-gray-100 font-semibold border-l-2 border-blue-500' : 'bg-[#187F7A]/10 text-[#187F7A] font-bold border-l-2 border-[#187F7A]'
                    : isDark ? 'text-gray-400 hover:bg-[#252525] hover:text-gray-200' : 'text-[#5E7174] hover:bg-slate-50 hover:text-[#1B2D32]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Go to Operations */}
            <div className={`mt-auto p-4 border-t ${isDark ? 'border-[#333]' : 'border-[#D9E2F2]'}`}>
              <button
                onClick={() => setMainTab('operations')}
                className="flex items-center gap-2 text-xs font-semibold text-[#187F7A] hover:underline transition cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Go to Operations
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {autoSideTab === 'notifications' && (
              <>
                {/* Email Templates Section */}
                <div className={`border rounded-xl overflow-hidden ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <div className={`p-5 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-[#D9E2F2]'}`}>
                    <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Customize the email template</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure email notifications sent to candidates and employees</p>
                  </div>
                  {emailTemplates.map(tmpl => (
                    <div
                      key={tmpl.key}
                      className={`flex items-center justify-between px-5 py-4 border-b last:border-b-0 transition ${
                        isDark ? 'border-[#2a2a2a] hover:bg-[#252525]' : 'border-[#E2E8F0] hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Toggle
                          checked={tmpl.enabled}
                          onChange={v => {
                            setEmailTemplates(emailTemplates.map(t => t.key === tmpl.key ? { ...t, enabled: v } : t));
                            showToast(`${tmpl.title} ${v ? 'enabled' : 'disabled'}`);
                          }}
                        />
                        <div>
                          <span className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{tmpl.title}</span>
                          <p className="text-[11px] text-gray-500 truncate max-w-lg mt-0.5">{tmpl.subject}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingTemplate(tmpl)}
                        className={`text-xs border rounded-lg px-3 py-1.5 transition cursor-pointer font-medium ${
                          isDark ? 'border-[#444] text-gray-300 hover:bg-[#333]' : 'border-[#D9E2F2] text-[#187F7A] hover:bg-slate-50'
                        }`}
                      >
                        Edit Template
                      </button>
                    </div>
                  ))}
                </div>

                {/* Onboarding Reminder Section */}
                <div className={`border rounded-xl overflow-hidden ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <div className={`p-5 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-[#D9E2F2]'}`}>
                    <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Onboarding reminder</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure automatic email reminders</p>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Toggle
                        checked={reminderCandidate}
                        onChange={v => { setReminderCandidate(v); showToast(`Onboarding reminders ${v ? 'enabled' : 'disabled'}`); }}
                      />
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>Reminder to complete candidate onboarding</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {autoSideTab === 'workflows' && (
              <div className="space-y-4">
                <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Automated Workflow Rules</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Trigger Background Verification on Candidate Invite', trigger: 'Status = INVITED', action: 'Webhook to AuthBridge API' },
                    { name: 'Auto-Generate Employee Code on Final Approval', trigger: 'Status = READY_FOR_DAY_ONE', action: 'Sequential Sequence EMP-XXXXX' },
                    { name: 'Send Slack Announcement to #new-hires', trigger: 'Status = CONVERTED_TO_EMPLOYEE', action: 'Post to Slack Webhook' },
                  ].map(wf => (
                    <div key={wf.name} className={`p-4 border rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                    }`}>
                      <div>
                        <div className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{wf.name}</div>
                        <div className="text-[11px] text-gray-500 mt-1">Trigger: <span className="font-mono text-[#187F7A]">{wf.trigger}</span> &bull; Action: <span className="text-emerald-700 dark:text-emerald-400 font-medium">{wf.action}</span></div>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-semibold">Enabled</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {autoSideTab === 'logs' && (
              <div className="space-y-4">
                <h2 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Automation &amp; Custom Button Execution Logs</h2>
                <div className={`border rounded-xl overflow-hidden text-xs ${
                  isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-[#D9E2F2] shadow-xs'
                }`}>
                  <div className={`p-3 uppercase font-semibold grid grid-cols-4 ${
                    isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-[#F4F2EC] text-[#5E7174]'
                  }`}>
                    <span>Timestamp</span>
                    <span>Event Name</span>
                    <span>Recipient / Target</span>
                    <span>Delivery Status</span>
                  </div>
                  {[
                    { time: '17-Nov-2026 15:45', event: 'Welcome Email Sent', target: 'sarah.sanders@cubeai.internal', status: 'Delivered (200 OK)' },
                    { time: '17-Nov-2026 14:12', event: 'Verification Reinitiated', target: 'vikram.rao@example.com', status: 'Delivered (200 OK)' },
                    { time: '17-Nov-2026 11:30', event: 'Offer Letter Download', target: 'rose.stacy@cubeai.internal', status: 'Generated PDF' },
                  ].map(l => (
                    <div key={l.time} className={`p-3 border-t grid grid-cols-4 ${
                      isDark ? 'border-[#333] text-gray-300' : 'border-[#D9E2F2] text-[#1B2D32]'
                    }`}>
                      <span className="font-mono text-gray-500">{l.time}</span>
                      <span>{l.event}</span>
                      <span className="text-[#187F7A] font-medium">{l.target}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: EDIT TEMPLATE
      ═══════════════════════════════════════════════════════════════════ */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Edit Template: {editingTemplate.title}</h3>
              <button onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Subject Line</label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                    isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-500 font-semibold">Email Body</label>
                  <span className="text-[10px] text-gray-400">Click placeholders below to insert</span>
                </div>
                <textarea
                  rows={8}
                  value={editingTemplate.body}
                  onChange={e => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className={`w-full rounded-lg border p-3 text-xs focus:outline-none font-mono ${
                    isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                  }`}
                />
              </div>

              {/* Placeholders */}
              <div className="space-y-1">
                <span className="text-[11px] text-gray-500">Available Placeholders:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['{{candidate_name}}', '{{job_role}}', '{{joining_date}}', '{{department}}', '{{portal_url}}', '{{employee_id}}'].map(ph => (
                    <button
                      key={ph}
                      type="button"
                      onClick={() => setEditingTemplate({ ...editingTemplate, body: editingTemplate.body + ' ' + ph })}
                      className="bg-[#187F7A]/10 hover:bg-[#187F7A]/20 text-[#187F7A] px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer"
                    >
                      + {ph}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 dark:hover:bg-[#333] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailTemplates(emailTemplates.map(t => t.key === editingTemplate.key ? editingTemplate : t));
                    setEditingTemplate(null);
                    showToast('Email template saved successfully!');
                  }}
                  className="rounded-lg bg-[#187F7A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#146A66] cursor-pointer shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: EDIT CANDIDATE VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {isEditViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Edit Candidate View Columns</h3>
              <button onClick={() => setIsEditViewOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <p className="text-gray-500 mb-2">Select columns to display in the candidate data grid:</p>
              {[
                'First name', 'Last name', 'Email ID', 'Official Email',
                'Onboarding Status', 'Department', 'Source of Hire',
                'PAN card number', 'Aadhaar card number', 'Proposed Joining Date'
              ].map(col => (
                <label key={col} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                  isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-slate-50 hover:bg-slate-100'
                }`}>
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#187F7A]" />
                  <span className={isDark ? 'text-gray-200' : 'text-[#1B2D32]'}>{col}</span>
                </label>
              ))}
            </div>
            <div className={`flex justify-end gap-3 pt-4 border-t mt-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <button
                onClick={() => setIsEditViewOpen(false)}
                className="px-4 py-2 text-xs text-gray-500 hover:bg-slate-100 dark:hover:bg-[#333] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => { setIsEditViewOpen(false); showToast('Candidate view customized successfully!'); }}
                className="bg-[#187F7A] hover:bg-[#146A66] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
              >
                Apply View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DRAWER / MODAL: CANDIDATE 360 DETAIL VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-start justify-between border-b pb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#187F7A] flex items-center justify-center font-bold text-lg text-white shadow-xs">
                  {detailCandidate.first_name[0]}{detailCandidate.last_name[0]}
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>{detailCandidate.first_name} {detailCandidate.last_name}</h3>
                  <p className="text-xs text-gray-500">{detailCandidate.designation} &bull; {detailCandidate.department}</p>
                </div>
              </div>
              <button onClick={() => setDetailCandidate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Quick Status Bar */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-slate-50 border-[#E2E8F0]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Current Status:</span>
                  {getStatusBadge(detailCandidate.status)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setOfferCandidate(detailCandidate); }}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer flex items-center gap-1 font-semibold text-xs ${
                      isDark ? 'bg-[#2a2a2a] hover:bg-[#333] border-[#444] text-gray-200' : 'bg-white hover:bg-slate-50 border-[#D9E2F2] text-[#1B2D32]'
                    }`}
                  >
                    <FileText className="h-3 w-3" /> Offer Contract
                  </button>
                  <button
                    onClick={() => { setPortalCandidate(detailCandidate); }}
                    className="bg-[#187F7A] hover:bg-[#146A66] text-white px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> Candidate Portal
                  </button>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl border ${
                isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-[#E2E8F0]'
              }`}>
                <div><span className="text-gray-400 block text-[11px]">Personal Email</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{detailCandidate.email}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Work Email</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{detailCandidate.official_email || 'Not provisioned'}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Mobile Phone</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{detailCandidate.mobile_phone}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Proposed Joining Date</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{new Date(detailCandidate.proposed_joining_date).toLocaleDateString()}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Source of Hire</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{detailCandidate.source_of_hire}</span></div>
                <div><span className="text-gray-400 block text-[11px]">PAN Card (Masked)</span><span className={`font-mono font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>••••••••••</span></div>
                <div><span className="text-gray-400 block text-[11px]">Aadhaar (Masked)</span><span className={`font-mono font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>••••••••••</span></div>
                <div><span className="text-gray-400 block text-[11px]">Experience</span><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{detailCandidate.experience || '4 years'}</span></div>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <div className="flex gap-2">
                  {detailCandidate.status !== 'READY_FOR_DAY_ONE' && (
                    <button
                      onClick={() => {
                        setCandidates(candidates.map(c => c.id === detailCandidate.id ? { ...c, status: 'READY_FOR_DAY_ONE', tasksCompleted: 5 } : c));
                        setDetailCandidate({ ...detailCandidate, status: 'READY_FOR_DAY_ONE', tasksCompleted: 5 });
                        showToast(`Candidate verified as Ready For Day One!`);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg cursor-pointer font-semibold shadow-xs"
                    >
                      Verify All Documents
                    </button>
                  )}
                  {detailCandidate.status === 'READY_FOR_DAY_ONE' && (
                    <button
                      onClick={() => {
                        handleStartConvert(detailCandidate);
                        setDetailCandidate(null);
                      }}
                      className="bg-[#187F7A] hover:bg-[#146A66] text-white px-3.5 py-1.5 rounded-lg cursor-pointer font-semibold shadow-xs"
                    >
                      Convert to Employee →
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setDetailCandidate(null)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#333] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: INVITE CANDIDATE (TC-T1-ONB-03, TC-T4-E2E-01)
      ═══════════════════════════════════════════════════════════════════ */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Invite Candidate to Onboard</h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">First Name</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={e => setFormFirstName(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="e.g. Arjun"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={e => setFormLastName(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="e.g. Reddy"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Personal Email</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="arjun.reddy@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Mobile Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Department</label>
                  <select
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none cursor-pointer ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  >
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Finance &amp; Accounts</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Designation</label>
                  <input
                    type="text"
                    value={formDesig}
                    onChange={e => setFormDesig(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Proposed Joining Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                    isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                  }`}
                />
              </div>
              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-gray-500 hover:bg-slate-100 dark:hover:bg-[#333] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66] cursor-pointer shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: ADD CANDIDATE (Full Screen Form)
      ═══════════════════════════════════════════════════════════════════ */}
      {isAddCandidateOpen && (
        <div className={`fixed inset-0 z-50 flex flex-col overflow-y-auto ${
          isDark ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-[#0B1730]'
        }`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3.5 ${
            isDark ? 'bg-[#111] border-[#333]' : 'bg-[#FAFCFF] border-[#D9E2F2]'
          }`}>
            <h2 className="text-base font-bold">Add Candidate</h2>
            <button onClick={() => setIsAddCandidateOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddCandidateSubmit} className="flex-1 p-6 space-y-8 max-w-5xl mx-auto w-full">

            {/* Candidate Details */}
            <section>
              <h3 className={`text-sm font-bold border-b pb-2 mb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>Candidate Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email ID <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="candidate@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={e => setFormFirstName(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="e.g. Sarah"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={e => setFormLastName(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="e.g. Sanders"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Alias user name</label>
                  <input
                    type="text"
                    value={formAlias}
                    onChange={e => setFormAlias(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                    placeholder="e.g. ssanders"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">PAN card number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formPan}
                      onChange={e => setFormPan(e.target.value)}
                      placeholder="ABCDE1234F"
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs focus:outline-none font-mono ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                    <label className={`text-xs border px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 font-semibold ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-blue-400 hover:bg-[#333]' : 'bg-slate-50 border-[#D9E2F2] text-[#187F7A] hover:bg-slate-100'
                    }`}>
                      <Upload className="h-3 w-3" />
                      <span>{panFileName ? 'Attached' : 'Upload'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPanFileName(file.name);
                            showToast(`Attached: ${file.name}`);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {panFileName && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">&bull; Document Attached: {panFileName}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">Accepted formats: PNG, JPG, PDF — Max size 4 MB</p>
                </div>
              </div>
            </section>

            {/* Address Details */}
            <section>
              <h3 className={`text-sm font-bold border-b pb-2 mb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>Address Details</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Permanent Address */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Permanent Address</p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address 1</label>
                    <input
                      value={permAddr1}
                      onChange={e => setPermAddr1(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address 2</label>
                    <input
                      value={permAddr2}
                      onChange={e => setPermAddr2(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      value={permCity}
                      onChange={e => setPermCity(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">State/UT</label>
                      <input
                        value={permState}
                        onChange={e => setPermState(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                          isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Postal Code</label>
                      <input
                        value={permPostal}
                        onChange={e => setPermPostal(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                          isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Country</label>
                    <input
                      value={permCountry}
                      onChange={e => setPermCountry(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                </div>

                {/* Current/Correspondence Address */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current / Correspondence Address</p>
                    <button
                      type="button"
                      onClick={handleCopyPermanentAddress}
                      className="text-xs font-semibold text-[#187F7A] hover:underline cursor-pointer"
                    >
                      Same as Permanent
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address 1</label>
                    <input
                      value={currAddr1}
                      onChange={e => setCurrAddr1(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address 2</label>
                    <input
                      value={currAddr2}
                      onChange={e => setCurrAddr2(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      value={currCity}
                      onChange={e => setCurrCity(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">State/UT</label>
                      <input
                        value={currState}
                        onChange={e => setCurrState(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                          isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Postal Code</label>
                      <input
                        value={currPostal}
                        onChange={e => setCurrPostal(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                          isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Country</label>
                    <input
                      value={currCountry}
                      onChange={e => setCurrCountry(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                        isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Details */}
            <section>
              <h3 className={`text-sm font-bold border-b pb-2 mb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>Personal Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Experience</label>
                  <input
                    type="text"
                    value={formExperience}
                    onChange={e => setFormExperience(e.target.value)}
                    placeholder="e.g. 5 years"
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Department</label>
                  <select
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none cursor-pointer ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  >
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Finance</option>
                    <option>Product</option>
                    <option>Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Source of Hire</label>
                  <select
                    value={formSourceOfHire}
                    onChange={e => setFormSourceOfHire(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none cursor-pointer ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  >
                    <option>LinkedIn</option>
                    <option>Job Portal</option>
                    <option>Referral</option>
                    <option>Campus</option>
                    <option>Recruiter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={formDesig}
                    onChange={e => setFormDesig(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none cursor-pointer ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={e => setFormDob(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formNationality}
                    onChange={e => setFormNationality(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Video Resume URL</label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={e => setFormVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                      isDark ? 'bg-[#252525] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Education Table */}
            <section>
              <div className={`flex items-center justify-between border-b pb-2 mb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <h3 className="text-sm font-bold">Education</h3>
                <button
                  type="button"
                  onClick={() => setEduRows(r => [...r, { id: `e-${Date.now()}`, school: '', degree: '', focus: '', graduation: '', title: '' }])}
                  className="text-xs text-[#187F7A] font-semibold hover:underline cursor-pointer"
                >
                  + Add row
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className={isDark ? 'bg-[#222] text-gray-400' : 'bg-[#F4F2EC] text-[#5E7174]'}>
                    <tr>
                      {['School / College', 'Degree / Diploma', 'Primary Focus', 'Graduation Year', 'Academic Title', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#2a2a2a]' : 'divide-[#E2E8F0]'}`}>
                    {eduRows.map(row => (
                      <tr key={row.id}>
                        {(['school', 'degree', 'focus', 'graduation', 'title'] as const).map(f => (
                          <td key={f} className="px-2 py-2">
                            <input
                              value={row[f]}
                              onChange={e => setEduRows(rows => rows.map(r => r.id === row.id ? { ...r, [f]: e.target.value } : r))}
                              className={`w-full rounded border px-2 py-1 text-xs focus:outline-none ${
                                isDark ? 'bg-[#252525] border-[#444] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                              }`}
                            />
                          </td>
                        ))}
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => setEduRows(rows => rows.filter(r => r.id !== row.id))}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Experience Table */}
            <section>
              <div className={`flex items-center justify-between border-b pb-2 mb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <h3 className="text-sm font-bold">Experience</h3>
                <button
                  type="button"
                  onClick={() => setExpRows(r => [...r, { id: `x-${Date.now()}`, designation: '', industry: '', working: '', location: '', currentlyWorking: false }])}
                  className="text-xs text-[#187F7A] font-semibold hover:underline cursor-pointer"
                >
                  + Add row
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className={isDark ? 'bg-[#222] text-gray-400' : 'bg-[#F4F2EC] text-[#5E7174]'}>
                    <tr>
                      {['Designation', 'Industry', 'Working Duration', 'Location', 'Currently Working', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#2a2a2a]' : 'divide-[#E2E8F0]'}`}>
                    {expRows.map(row => (
                      <tr key={row.id}>
                        {(['designation', 'industry', 'working', 'location'] as const).map(f => (
                          <td key={f} className="px-2 py-2">
                            <input
                              value={row[f]}
                              onChange={e => setExpRows(rows => rows.map(r => r.id === row.id ? { ...r, [f]: e.target.value } : r))}
                              className={`w-full rounded border px-2 py-1 text-xs focus:outline-none ${
                                isDark ? 'bg-[#252525] border-[#444] text-gray-100' : 'bg-white border-[#CBD5E1] text-[#0B1730]'
                              }`}
                            />
                          </td>
                        ))}
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.currentlyWorking}
                            onChange={e => setExpRows(rows => rows.map(r => r.id === row.id ? { ...r, currentlyWorking: e.target.checked } : r))}
                            className="w-3.5 h-3.5 accent-[#187F7A] cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => setExpRows(rows => rows.filter(r => r.id !== row.id))}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bottom Form Actions */}
            <div className={`sticky bottom-0 border-t flex items-center gap-3 pt-4 pb-2 ${
              isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#E2E8F0]'
            }`}>
              <button
                type="submit"
                className="rounded-lg bg-[#187F7A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#146A66] cursor-pointer shadow-xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { handleAddCandidateSubmit({ preventDefault: () => {} } as React.FormEvent); }}
                className="rounded-lg bg-[#173D45] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0f282e] cursor-pointer shadow-xs"
              >
                Save &amp; Invite Candidate
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-5 py-2 text-xs font-medium text-gray-500 hover:bg-slate-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => setIsAddCandidateOpen(false)}
                className="rounded-lg px-5 py-2 text-xs font-medium text-gray-500 hover:bg-slate-100 dark:hover:bg-[#2a2a2a] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: CONVERT TO EMPLOYEE (TC-T1-ONB-05, TC-T3-PAIR-01)
      ═══════════════════════════════════════════════════════════════════ */}
      {convertingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Convert to Employee</h3>
              <button onClick={() => setConvertingCandidate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConvertSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-gray-500">
                Converting{' '}
                <strong className={isDark ? 'text-gray-100' : 'text-[#1B2D32]'}>
                  {convertingCandidate.first_name} {convertingCandidate.last_name}
                </strong>{' '}
                will create an active employee record, allocate permanent vault storage, and activate corporate user authentication.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-500">Generated Employee Code</label>
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={e => setEmployeeCode(e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-mono focus:outline-none ${
                    isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Official Work Email</label>
                <input
                  type="email"
                  required
                  value={officialEmail}
                  onChange={e => setOfficialEmail(e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:outline-none ${
                    isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-100 focus:border-blue-500' : 'bg-white border-[#CBD5E1] text-[#0B1730] focus:border-[#187F7A]'
                  }`}
                />
              </div>
              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <button
                  type="button"
                  onClick={() => setConvertingCandidate(null)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-gray-500 hover:bg-slate-100 dark:hover:bg-[#333] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Confirm &amp; Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: OFFER LETTER CONTRACT
      ═══════════════════════════════════════════════════════════════════ */}
      {offerCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#187F7A]" />
                <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Offer Letter &amp; Compensation Contract</h3>
              </div>
              <button onClick={() => setOfferCandidate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className={`mt-4 p-5 border rounded-xl space-y-4 text-xs ${
              isDark ? 'bg-[#1e1e1e] border-[#333] text-gray-200' : 'bg-slate-50 border-[#E2E8F0] text-[#1B2D32]'
            }`}>
              <div className={`flex justify-between border-b pb-3 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <div>
                  <h4 className="font-bold text-sm text-[#187F7A]">CUBEAI SOLUTIONS PRIVATE LIMITED</h4>
                  <p className="text-[10px] text-gray-400">Bangalore Technology Park, Bangalore 560103</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-gray-400">Ref: CUBEAI/OFFER/2026/089</span>
                  <p className="text-[10px] text-emerald-600 font-bold">&bull; Accepted by Candidate</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><strong>Candidate:</strong> {offerCandidate.first_name} {offerCandidate.last_name}</div>
                <div><strong>Designation:</strong> {offerCandidate.designation}</div>
                <div><strong>Department:</strong> {offerCandidate.department}</div>
                <div><strong>Proposed Joining:</strong> {new Date(offerCandidate.proposed_joining_date).toLocaleDateString()}</div>
              </div>
              <div className={`border rounded-lg overflow-hidden text-xs ${
                isDark ? 'border-[#333]' : 'border-[#D9E2F2]'
              }`}>
                <div className={`px-3 py-2 font-bold ${isDark ? 'bg-[#2a2a2a] text-gray-200' : 'bg-[#F4F2EC] text-[#1B2D32]'}`}>
                  Annual Compensation Structure (CTC Breakdown)
                </div>
                {[
                  ['Basic Salary (50%):', '₹1,200,000.00'],
                  ['House Rent Allowance - HRA (25%):', '₹600,000.00'],
                  ['Special / Flexi Allowance (20%):', '₹480,000.00'],
                  ['Employer Statutory Provident Fund - PF (5%):', '₹120,000.00'],
                ].map(([label, val]) => (
                  <div key={label} className={`flex justify-between px-3 py-1.5 border-t ${isDark ? 'border-[#333] text-gray-400' : 'border-[#E2E8F0] text-[#5E7174]'}`}>
                    <span>{label}</span>
                    <span className="font-mono font-medium">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 font-bold border-t border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
                  <span>Total Annual Gross CTC:</span>
                  <span className="font-mono">₹2,400,000.00</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setOfferCandidate(null)} className="rounded-lg border border-gray-300 dark:border-[#444] px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 dark:hover:bg-[#2a2a2a] cursor-pointer">
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Offer letter PDF exported successfully.');
                  setOfferCandidate(null);
                }}
                className="rounded-lg bg-[#187F7A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#146A66] cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Offer Letter PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: CANDIDATE PORTAL PREVIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {portalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl ${
            isDark ? 'bg-[#222] border-[#444]' : 'bg-white border-[#D9E2F2]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>Candidate Pre-boarding Portal</h3>
                <p className="text-xs text-gray-500">Magic link tokenized external applicant wizard</p>
              </div>
              <button onClick={() => setPortalCandidate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-[#187F7A]/10 border border-[#187F7A]/30 p-3 rounded-xl text-[#187F7A]">
                <span>Welcome, <strong>{portalCandidate.first_name} {portalCandidate.last_name}</strong>!</span>
                <span className="text-[10px] font-mono bg-[#187F7A]/20 px-2 py-0.5 rounded font-semibold">Token Active (7 Days)</span>
              </div>
              <div className="space-y-3">
                {[
                  { step: 'Step 1: Statutory Identity Declarations', detail: 'PAN Card: ABCDE1234F • Aadhaar Number: Verified via OTP' },
                  { step: 'Step 2: Bank Account & Direct Deposit', detail: 'HDFC Bank • A/C: 50100987654321 • IFSC: HDFC0000123' },
                  { step: 'Step 3: Document Uploads & Credentials', detail: 'Passport, Degree Certificate, Previous Experience Letter attached' },
                ].map(item => (
                  <div key={item.step} className={`p-3 border rounded-xl space-y-1 ${
                    isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-slate-50 border-[#E2E8F0]'
                  }`}>
                    <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>{item.step}</div>
                    <div className="text-gray-500">{item.detail}</div>
                  </div>
                ))}
              </div>
              <div className={`pt-4 border-t flex justify-end gap-3 ${isDark ? 'border-[#333]' : 'border-[#E2E8F0]'}`}>
                <button type="button" onClick={() => setPortalCandidate(null)} className="rounded-lg px-4 py-2 font-medium text-gray-500 hover:bg-slate-100 dark:hover:bg-[#2a2a2a] cursor-pointer">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Candidate intake submission verified!');
                    setPortalCandidate(null);
                  }}
                  className="rounded-lg bg-[#187F7A] px-4 py-2 font-semibold text-white hover:bg-[#146A66] cursor-pointer shadow-xs"
                >
                  Simulate Candidate Final Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
