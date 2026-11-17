import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContextStorage, TenantContextPayload } from '../context/tenant-context.storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const rawHeader = req.headers['x-tenant-id'] || req.headers['x-tenant-uuid'];
    const tenantId = Array.isArray(rawHeader) ? rawHeader[0] : (rawHeader as string) || '';

    const rawRoles = req.headers['x-user-roles'] || req.headers['x-user-role'];
    let roles: string[] = ['SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER', 'LINE_MANAGER', 'EMPLOYEE'];
    if (rawRoles) {
      roles = (Array.isArray(rawRoles) ? rawRoles[0] : (rawRoles as string))
        .split(',')
        .map((r) => r.trim());
    }

    const payload: TenantContextPayload = {
      tenantId: tenantId.trim(),
      roles,
    };

    // Attach to express request object for controller convenience
    (req as any).tenantId = payload.tenantId;

    tenantContextStorage.run(payload, () => {
      next();
    });
  }
}
