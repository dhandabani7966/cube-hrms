import { Injectable } from '@nestjs/common';
import { tenantContextStorage, TenantContextPayload } from './tenant-context.storage';

@Injectable()
export class TenantContextService {
  getTenantId(): string | undefined {
    return tenantContextStorage.getStore()?.tenantId;
  }

  getUserId(): string | undefined {
    return tenantContextStorage.getStore()?.userId;
  }

  getUserEmail(): string | undefined {
    return tenantContextStorage.getStore()?.userEmail;
  }

  getRoles(): string[] {
    return tenantContextStorage.getStore()?.roles || [];
  }

  getStore(): TenantContextPayload | undefined {
    return tenantContextStorage.getStore();
  }

  run<T>(context: TenantContextPayload, fn: () => T): T {
    return tenantContextStorage.run(context, fn);
  }
}
