import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tenantContextStorage } from '../context/tenant-context.storage';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const tenantId = tenantContextStorage.getStore()?.tenantId;
    if (!tenantId || tenantId.trim() === '') {
      throw new ForbiddenException({
        success: false,
        error: {
          code: 'TENANT_HEADER_MISSING',
          message: 'A valid X-Tenant-ID header is required to access this resource',
        },
      });
    }

    // UUID format validation regex (allowing standard UUID v1-v5 or test fixture standard UUIDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new ForbiddenException({
        success: false,
        error: {
          code: 'INVALID_TENANT_ID',
          message: 'X-Tenant-ID must be a valid UUID format',
        },
      });
    }

    return true;
  }
}
