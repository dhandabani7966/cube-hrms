import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OffboardingService } from './offboarding.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('offboarding')
export class OffboardingController {
  constructor(private offboardingService: OffboardingService) {}

  @Get('resignations')
  getExitRequests(@CurrentTenant() tenantId: string) {
    return this.offboardingService.getExitRequests(tenantId);
  }

  @Post('resignations')
  createExitRequest(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.offboardingService.createExitRequest(tenantId, body);
  }

  @Get('resignations/:id/clearances')
  getClearances(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.offboardingService.getClearances(tenantId, id);
  }

  @Put('clearances/:itemId')
  updateClearanceItem(
    @CurrentTenant() tenantId: string,
    @Param('itemId') itemId: string,
    @Body() body: { status: string; holdReason?: string; recoveryAmount?: number },
  ) {
    return this.offboardingService.updateClearanceItem(
      tenantId,
      itemId,
      body.status,
      body.holdReason,
      body.recoveryAmount,
    );
  }

  @Get('resignations/:id/fnf')
  getFnfSettlement(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.offboardingService.getFnfSettlement(tenantId, id);
  }
}
