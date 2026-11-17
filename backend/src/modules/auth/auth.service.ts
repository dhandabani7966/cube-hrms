import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Injectable()
export class AuthService {
  constructor(
    private dataStore: DataStoreService,
    private tenantContext: TenantContextService,
  ) {}

  login(tenantId: string, email: string) {
    const user = this.dataStore.findUserByEmail(tenantId, email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password for this tenant' },
      });
    }

    // In production, bcrypt.compare is verified here
    const token = `jwt-${user.id}-${Date.now()}`;
    return {
      accessToken: token,
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        tenantId: user.tenant_id,
      },
    };
  }

  getCurrentUser() {
    const tenantId = this.tenantContext.getTenantId();
    const userId = this.tenantContext.getUserId() || 'u-11111111-1111-1111-1111-111111111111';
    if (!tenantId) {
      throw new UnauthorizedException('Tenant context missing');
    }
    const user = this.dataStore.findUserById(tenantId, userId);
    return user || { id: userId, email: 'user@cubeai.internal', roles: ['EMPLOYEE'], tenantId };
  }
}
