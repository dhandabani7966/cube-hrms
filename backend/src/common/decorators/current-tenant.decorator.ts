import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { tenantContextStorage } from '../context/tenant-context.storage';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const store = tenantContextStorage.getStore();
    if (store?.tenantId) {
      return store.tenantId;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId || (request.headers['x-tenant-id'] as string) || '';
  },
);
