import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // 1. FOLDER HIERARCHY
  @Get('folders')
  getFolders(@CurrentTenant() tenantId: string) {
    return this.documentsService.getFolders(tenantId);
  }

  @Post('folders')
  createFolder(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.documentsService.createFolder(tenantId, body);
  }

  @Put('folders/:id')
  updateFolder(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.documentsService.updateFolder(tenantId, id, body);
  }

  // 2. COMPANY DOCUMENTS & POLICIES
  @Get('company-documents')
  getCompanyDocuments(
    @CurrentTenant() tenantId: string,
    @Query('folderId') folderId?: string,
  ) {
    return this.documentsService.getCompanyDocuments(tenantId, folderId);
  }

  @Post('company-documents')
  createCompanyDocument(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.documentsService.createCompanyDocument(tenantId, body);
  }

  // 3. COMPLIANCE & CONSENT MONITOR
  @Get('compliance-summary')
  getComplianceSummary(
    @CurrentTenant() tenantId: string,
    @Query('documentId') documentId?: string,
  ) {
    return this.documentsService.getComplianceSummary(tenantId, documentId);
  }

  @Post('company-documents/:id/consent')
  recordConsent(
    @CurrentTenant() tenantId: string,
    @Param('id') documentId: string,
    @Body()
    body: {
      employeeId: string;
      consentStatus?: 'OPTED_IN' | 'OPTED_OUT';
      ip?: string;
      ua?: string;
      notes?: string;
    },
    @Req() req: any,
  ) {
    const ip = body.ip || req?.ip || '198.51.100.42';
    const ua = body.ua || req?.headers?.['user-agent'] || 'Browser';
    return this.documentsService.recordConsent(
      tenantId,
      documentId,
      body.employeeId,
      body.consentStatus || 'OPTED_IN',
      ip,
      ua,
      body.notes,
    );
  }

  @Post('reminders/bulk')
  sendBulkReminders(
    @CurrentTenant() tenantId: string,
    @Body() body: { documentId?: string },
  ) {
    return this.documentsService.sendBulkReminders(tenantId, body?.documentId);
  }

  // 4. PERSONAL VAULT FILES
  @Get('vault')
  getVaultFiles(
    @CurrentTenant() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('category') category?: string,
  ) {
    return this.documentsService.getVaultFiles(tenantId, employeeId, category);
  }

  @Post('vault')
  uploadVaultFile(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.documentsService.uploadVaultFile(tenantId, body);
  }

  @Delete('vault/:id')
  deleteVaultFile(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.documentsService.deleteVaultFile(tenantId, id);
  }

  // 5. EXPIRY RADAR & ALERTS
  @Get('expiring-radar')
  getExpiryRadar(@CurrentTenant() tenantId: string) {
    return this.documentsService.getExpiryRadar(tenantId);
  }

  @Post('expiring/notify')
  sendExpiryAlerts(
    @CurrentTenant() tenantId: string,
    @Body() body: { fileIds?: string[] },
  ) {
    return this.documentsService.sendExpiryAlerts(tenantId, body?.fileIds);
  }

  // 6. E-SIGNATURE FLOWS
  @Get('esign-flows')
  getSignatureFlows(
    @CurrentTenant() tenantId: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.documentsService.getSignatureFlows(tenantId, employeeId);
  }

  @Post('esign-flows')
  createSignatureFlow(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.documentsService.createSignatureFlow(tenantId, body);
  }

  @Post('esign-flows/:id/sign')
  signSignatureFlow(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.documentsService.signSignatureFlow(tenantId, id, body);
  }

  // 7. SETTINGS & SHAREPOINT BACKUP
  @Get('settings')
  getSettings(@CurrentTenant() tenantId: string) {
    return this.documentsService.getSettings(tenantId);
  }

  @Put('settings')
  updateSettings(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.documentsService.updateSettings(tenantId, body);
  }

  @Post('sharepoint-sync')
  syncSharePoint(@CurrentTenant() tenantId: string) {
    return this.documentsService.syncSharePoint(tenantId);
  }

  // 8. MANDATORY ACCESS LOCKOUT CHECK
  @Get('check-lockout')
  checkLockout(
    @CurrentTenant() tenantId: string,
    @Query('employeeId') employeeId: string,
  ) {
    return this.documentsService.checkLockout(tenantId, employeeId || 'e-11111111-1111-1111-1111-111111111113');
  }

  // 9. BACKWARDS-COMPATIBLE LEGACY ROUTES
  @Get('policies')
  getPolicies(@CurrentTenant() tenantId: string) {
    return this.documentsService.getPolicies(tenantId);
  }

  @Post('policies/:id/acknowledge')
  acknowledgePolicy(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { employeeId: string },
    @Req() req: any,
  ) {
    const ip = req?.ip || '127.0.0.1';
    const ua = req?.headers?.['user-agent'] || 'Browser';
    return this.documentsService.acknowledgePolicy(tenantId, id, body.employeeId, ip, ua);
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
