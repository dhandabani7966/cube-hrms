export const TENANT_A_ID = '11111111-1111-1111-1111-111111111111';
export const TENANT_B_ID = '22222222-2222-2222-2222-222222222222';

export const TENANTS = [
  { id: TENANT_A_ID, name: 'Acme Technologies Inc.', code: 'ACME' },
  { id: TENANT_B_ID, name: 'Globex Corp', code: 'GLOBEX' },
];

export const ROLES = ['HR_ADMIN', 'LINE_MANAGER', 'EMPLOYEE'] as const;
export type Role = typeof ROLES[number];

let currentTenantId = localStorage.getItem('cubeai_tenant_id') || TENANT_A_ID;
let currentRole: Role = (localStorage.getItem('cubeai_role') as Role) || 'HR_ADMIN';

export const getTenantId = () => currentTenantId;
export const setTenantId = (id: string) => {
  currentTenantId = id;
  localStorage.setItem('cubeai_tenant_id', id);
};

export const getCurrentRole = () => currentRole;
export const setCurrentRole = (role: Role) => {
  currentRole = role;
  localStorage.setItem('cubeai_role', role);
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('X-Tenant-ID', currentTenantId);
  headers.set('X-User-Role', currentRole);
  headers.set('Content-Type', 'application/json');

  try {
    const res = await fetch(`/api/v1${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, using client state fallback`, err);
    throw err;
  }
}
