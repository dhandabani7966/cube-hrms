import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get()
  getCases(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.casesService.getCases(tenantId, { status, priority });
  }

  @Get('categories')
  getCategories(@CurrentTenant() tenantId: string) {
    return this.casesService.getCategories(tenantId);
  }

  @Get(':id')
  getCaseById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.casesService.getCaseById(tenantId, id);
  }

  @Post()
  createCase(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.casesService.createCase(tenantId, body);
  }

  @Post(':id/messages')
  addMessage(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.casesService.addMessage(tenantId, id, body);
  }

  @Post(':id/resolve')
  resolveCase(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { resolutionSummary: string },
  ) {
    return this.casesService.resolveCase(tenantId, id, body.resolutionSummary);
  }
}
