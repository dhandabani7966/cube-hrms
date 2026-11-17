import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get('candidates')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  getCandidates(@CurrentTenant() tenantId: string, @Query('status') status?: string) {
    return this.onboardingService.getCandidates(tenantId, status);
  }

  @Post('candidates')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  createCandidate(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.onboardingService.createCandidate(tenantId, body);
  }

  @Post('candidates/:id/convert')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  convertCandidate(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.onboardingService.convertCandidate(tenantId, id, body);
  }
}
