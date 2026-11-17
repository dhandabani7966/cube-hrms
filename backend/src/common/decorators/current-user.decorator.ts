import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { tenantContextStorage } from '../context/tenant-context.storage';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || {
      id: tenantContextStorage.getStore()?.userId,
      email: tenantContextStorage.getStore()?.userEmail,
      roles: tenantContextStorage.getStore()?.roles || [],
    };
  },
);
