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

  @Post('candidates/mass-update')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  massUpdateCandidates(
    @CurrentTenant() tenantId: string,
    @Body() body: { candidateIds: string[]; updates: Record<string, any> },
  ) {
    return this.onboardingService.massUpdateCandidates(tenantId, body.candidateIds || [], body.updates || {});
  }

  @Post('candidates/bulk-delete')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  bulkDeleteCandidates(
    @CurrentTenant() tenantId: string,
    @Body() body: { candidateIds: string[] },
  ) {
    return this.onboardingService.bulkDeleteCandidates(tenantId, body.candidateIds || []);
  }

  @Post('candidates/bulk-convert')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  bulkConvertCandidates(
    @CurrentTenant() tenantId: string,
    @Body() body: { candidateIds: string[]; payload?: any },
  ) {
    return this.onboardingService.bulkConvertCandidates(tenantId, body.candidateIds || [], body.payload);
  }

  @Post('candidates/bulk-invite')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  bulkInviteCandidates(
    @CurrentTenant() tenantId: string,
    @Body() body: { candidateIds: string[] },
  ) {
    return this.onboardingService.bulkInviteCandidates(tenantId, body.candidateIds || []);
  }

  @Post('candidates/bulk-import')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  bulkImportCandidates(
    @CurrentTenant() tenantId: string,
    @Body() body: { candidates: any[] },
  ) {
    return this.onboardingService.bulkImportCandidates(tenantId, body.candidates || []);
  }

  @Get('candidates/export')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  exportCandidates(@CurrentTenant() tenantId: string) {
    return this.onboardingService.exportCandidates(tenantId);
  }

  @Get('candidates/history-export')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  getCandidatesAuditHistory(@CurrentTenant() tenantId: string) {
    return this.onboardingService.getCandidatesAuditHistory(tenantId);
  }

  @Get('candidates/access-log-export')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  getAccessLogs(@CurrentTenant() tenantId: string) {
    return this.onboardingService.getAccessLogs(tenantId);
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
