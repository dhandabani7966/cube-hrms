import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Users,
  Building2,
  ShieldCheck,
  LifeBuoy,
  FileText,
  UserX,
  Building,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from 'lucide-react';

import { ThemeProvider, useTheme } from './lib/theme';
import { OnboardingView } from './features/onboarding/OnboardingView';
import { EmployeesView } from './features/employees/EmployeesView';
import { EssView } from './features/ess/EssView';
import { CasesView } from './features/cases/CasesView';
import { DocumentsView } from './features/documents/DocumentsView';
import { OffboardingView } from './features/offboarding/OffboardingView';
import { TENANTS, ROLES, getTenantId, setTenantId, getCurrentRole, setCurrentRole, type Role } from './lib/api';

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tenant, setTenant] = useState(getTenantId());
  const [role, setRole] = useState<Role>(getCurrentRole());
  const location = useLocation();

  const handleTenantChange = (newTenant: string) => {
    setTenant(newTenant);
    setTenantId(newTenant);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setCurrentRole(newRole);
  };

  const navItems = [
    { path: '/onboarding', label: '1. Onboarding', icon: Users },
    { path: '/employees', label: '2. Employee DBMS & Org', icon: Building2 },
    { path: '/ess', label: '3. Employee Self-Service', icon: ShieldCheck },
    { path: '/cases', label: '4. HR Help Desk & Cases', icon: LifeBuoy },
    { path: '/documents', label: '5. Documents & Compliance', icon: FileText },
    { path: '/offboarding', label: '6. Offboarding & Exits', icon: UserX },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#121212] text-gray-100' : 'bg-[#F8FAFF] text-[#0B1730]'}`}>
      {/* Sidebar */}
      <aside
        className={`border-r flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none ${
          isSidebarOpen ? 'w-64' : 'w-18'
        } ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#D9E2F2]'}`}
      >
        <div>
          {/* Logo & Open/Close Bar */}
          <div className={`flex h-16 items-center border-b transition-colors ${
            isDark ? 'border-[#333]' : 'border-[#D9E2F2]'
          } ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src="/cubeai-icon.png" alt="CubeAI" className="h-8 w-8 rounded-lg shrink-0 shadow-sm" />
                  <div className="overflow-hidden">
                    <span className={`font-bold tracking-tight block truncate text-sm ${isDark ? 'text-gray-100' : 'text-[#0B1730]'}`}>CubeAI HRMS</span>
                    <span className="block text-[10px] text-[#5E7174] font-medium truncate">Enterprise Edition</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse Sidebar"
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isDark ? 'text-gray-400 hover:bg-[#252525] hover:text-gray-200' : 'text-gray-500 hover:bg-slate-100 hover:text-gray-800'
                  }`}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  title="Expand Sidebar (CubeAI HRMS)"
                  className="flex items-center justify-center rounded-lg p-1.5 transition hover:scale-105 cursor-pointer relative group"
                >
                  <img
                    src="/cubeai-icon.png"
                    alt="CubeAI Solutions"
                    className="h-8 w-8 rounded-lg shrink-0 shadow-sm transition group-hover:ring-2 group-hover:ring-[#187F7A]"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border shadow-xs transition ${
                      isDark ? 'bg-[#2a2a2a] border-[#444] text-gray-300' : 'bg-white border-[#D9E2F2] text-[#187F7A]'
                    }`}
                  >
                    <PanelLeftOpen className="h-2.5 w-2.5" />
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Mode Toggle (Top of Slide Bar) */}
          <div className={`border-b transition-colors ${
            isDark ? 'border-[#333] bg-[#161616]' : 'border-[#D9E2F2] bg-slate-50/80'
          } ${isSidebarOpen ? 'px-4 py-2 flex items-center justify-between' : 'py-2 flex items-center justify-center'}`}>
            {isSidebarOpen ? (
              <>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Theme Mode
                </span>
                <button
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? 'Light' : 'Night'} Mode`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border shadow-xs transition cursor-pointer ${
                    isDark
                      ? 'bg-[#252525] border-[#444] text-blue-300 hover:bg-[#2f2f2f]'
                      : 'bg-white border-gray-300 text-amber-700 hover:bg-amber-50/50'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Moon className="h-3.5 w-3.5 text-blue-400" />
                      <span>Night Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'Light' : 'Night'} Mode`}
                className={`p-1.5 rounded-md border transition cursor-pointer ${
                  isDark
                    ? 'bg-[#252525] border-[#444] text-blue-300 hover:bg-[#2f2f2f]'
                    : 'bg-white border-gray-300 text-amber-600 hover:bg-amber-50/50'
                }`}
              >
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!isSidebarOpen ? item.label : undefined}
                  aria-label={item.label}
                  className={`flex items-center rounded-lg py-2.5 text-xs font-semibold transition cursor-pointer ${
                    isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'
                  } ${
                    isActive
                      ? 'bg-[#187F7A] text-white shadow-sm'
                      : isDark
                      ? 'text-gray-300 hover:bg-[#252525] hover:text-white'
                      : 'text-[#5E7174] hover:bg-slate-50 hover:text-[#0B1730]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        {isSidebarOpen && (
          <div className={`p-4 border-t space-y-2 text-[11px] transition-colors ${
            isDark ? 'border-[#333] bg-[#161616] text-gray-400' : 'border-[#D9E2F2] bg-[#F4F2EC]/40 text-[#5E7174]'
          }`}>
            <div className="flex items-center justify-between">
              <span>Stack:</span>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>React 19 &bull; Vite 8</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend:</span>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>NestJS :3001</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Mode:</span>
              <span className="font-mono text-emerald-500 font-bold capitalize">{theme}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-8 backdrop-blur transition-colors ${
          isDark
            ? 'bg-[#181818]/95 border-[#333] text-gray-100'
            : 'bg-white/95 border-[#D9E2F2] text-[#0B1730]'
        }`}>
          <div className="flex items-center gap-6">
            {/* Suite Heading */}
            <h1 className={`text-sm font-bold tracking-tight ${isDark ? 'text-gray-100' : 'text-[#1B2D32]'}`}>
              Core HR &amp; Employee Management
            </h1>

            <div className={`h-4 w-px ${isDark ? 'bg-[#333]' : 'bg-[#D9E2F2]'}`} />

            {/* Tenant Selector */}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-[#187F7A]" />
              <select
                value={tenant}
                onChange={(e) => handleTenantChange(e.target.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold focus:border-[#187F7A] focus:outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#222] border-[#444] text-gray-100'
                    : 'bg-slate-50 border-[#D9E2F2] text-[#1B2D32]'
                }`}
              >
                {TENANTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Persona / Role Selector */}
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-[#5E7174]" />
              <span className="text-xs text-[#5E7174]">Role:</span>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:border-[#187F7A] focus:outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#222] border-[#444] text-emerald-400'
                    : 'bg-slate-50 border-[#D9E2F2] text-[#187F7A]'
                }`}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className={`h-4 w-px ${isDark ? 'bg-[#333]' : 'bg-[#D9E2F2]'}`} />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#187F7A] text-white font-bold text-xs">
                {role === 'HR_ADMIN' ? 'HA' : role === 'LINE_MANAGER' ? 'LM' : 'EM'}
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#1B2D32]'}`}>
                {role === 'HR_ADMIN' ? 'HR Administrator' : role === 'LINE_MANAGER' ? 'Sarah (Manager)' : 'John (Employee)'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route path="/employees" element={<EmployeesView />} />
            <Route path="/ess" element={<EssView />} />
            <Route path="/cases" element={<CasesView />} />
            <Route path="/cases/*" element={<CasesView />} />
            <Route path="/documents" element={<DocumentsView />} />
            <Route path="/documents/*" element={<DocumentsView />} />
            <Route path="/offboarding" element={<OffboardingView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
