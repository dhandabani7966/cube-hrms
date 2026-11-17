import { Controller, Get, Post, Body } from '@nestjs/common';
import { EssService } from './ess.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('ess')
export class EssController {
  constructor(private essService: EssService) {}

  @Get('me')
  getMyProfile(@CurrentTenant() tenantId: string) {
    return this.essService.getMyProfile(tenantId);
  }

  @Get('announcements')
  getAnnouncements(@CurrentTenant() tenantId: string) {
    return this.essService.getAnnouncements(tenantId);
  }

  @Get('profile-requests')
  getProfileRequests(@CurrentTenant() tenantId: string) {
    return this.essService.getProfileRequests(tenantId);
  }

  @Post('profile-requests')
  createProfileRequest(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.essService.createProfileRequest(tenantId, body);
  }

  @Post('delegations')
  createDelegation(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.essService.createDelegation(tenantId, body);
  }
}
