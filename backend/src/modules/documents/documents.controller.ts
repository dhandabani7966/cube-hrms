import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('policies')
  getPolicies(@CurrentTenant() tenantId: string) {
    return this.documentsService.getPolicies(tenantId);
  }

  @Post('policies/:id/acknowledge')
  acknowledgePolicy(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { employeeId: string },
  ) {
    return this.documentsService.acknowledgePolicy(tenantId, id, body.employeeId);
  }

  @Get()
  getEmployeeDocuments(
    @CurrentTenant() tenantId: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.documentsService.getEmployeeDocuments(tenantId, employeeId);
  }

  @Get('expiring')
  getExpiringDocuments(
    @CurrentTenant() tenantId: string,
    @Query('days') days?: string,
  ) {
    const daysAhead = days ? parseInt(days, 10) : 60;
    return this.documentsService.getExpiringDocuments(tenantId, daysAhead);
  }
}
