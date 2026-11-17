import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantContextPayload {
  tenantId: string;
  userId?: string;
  userEmail?: string;
  roles?: string[];
  permissions?: string[];
}

export const tenantContextStorage = new AsyncLocalStorage<TenantContextPayload>();
