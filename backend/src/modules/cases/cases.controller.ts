import { Controller, Get, Post, Patch, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get('categories')
  getCategories(@CurrentTenant() tenantId: string) {
    return this.casesService.getCategories(tenantId);
  }

  @Post('categories')
  createCategory(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.casesService.createCategory(tenantId, body);
  }

  @Put('categories/:id')
  updateCategory(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.casesService.updateCategory(tenantId, id, body);
  }

  @Get('sla-policies')
  getSlaPolicies(@CurrentTenant() tenantId: string) {
    return this.casesService.getSlaPolicies(tenantId);
  }

  @Post('sla-policies')
  saveSlaPolicy(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.casesService.saveSlaPolicy(tenantId, body);
  }

  @Get('knowledge-status')
  getKnowledgeStatus(@CurrentTenant() tenantId: string) {
    return this.casesService.getKnowledgeStatus(tenantId);
  }

  @Post('knowledge-status/reindex')
  reindexKnowledge(@CurrentTenant() tenantId: string) {
    return this.casesService.reindexKnowledge(tenantId);
  }

  @Get('recommendations')
  getRecommendations(@CurrentTenant() tenantId: string, @Query('q') q?: string, @Query('query') query?: string) {
    return this.casesService.getRecommendations(tenantId, q || query || '');
  }

  @Post('escalation-check')
  runEscalationCheck(@CurrentTenant() tenantId: string) {
    return this.casesService.runEscalationCheck(tenantId);
  }

  @Get('employee-context/:employeeId')
  getEmployeeContext(@CurrentTenant() tenantId: string, @Param('employeeId') employeeId: string) {
    return this.casesService.getEmployeeContext(tenantId, employeeId);
  }

  @Get('unresolved/by-employee/:employeeId')
  checkUnresolvedForOffboarding(@CurrentTenant() tenantId: string, @Param('employeeId') employeeId: string) {
    return this.casesService.checkUnresolvedForOffboarding(tenantId, employeeId);
  }

  @Get()
  getCases(
    @CurrentTenant() tenantId: string,
    @Headers('x-user-role') role?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('queue') queue?: string,
    @Query('category_id') categoryId?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('requester_id') requesterId?: string,
    @Query('agent_id') agentId?: string,
  ) {
    return this.casesService.getCases(tenantId, {
      status,
      priority,
      queue,
      category_id: categoryId,
      search,
      sort,
      requester_id: requesterId,
      agent_id: agentId,
      role,
    });
  }

  @Get(':id')
  getCaseById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Headers('x-user-role') role?: string,
  ) {
    return this.casesService.getCaseById(tenantId, id, role);
  }

  @Post()
  createCase(
    @CurrentTenant() tenantId: string,
    @Body() body: any,
    @Headers('x-user-role') role?: string,
  ) {
    return this.casesService.createCase(tenantId, body, role);
  }

  @Patch(':id')
  updateCase(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
    @Headers('x-user-role') role?: string,
  ) {
    return this.casesService.updateCase(tenantId, id, body, role);
  }

  @Post(':id/messages')
  addMessage(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
    @Headers('x-user-role') role?: string,
  ) {
    return this.casesService.addMessage(tenantId, id, body, role);
  }

  @Post(':id/resolve')
  resolveCase(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { resolutionSummary: string; agentName?: string },
  ) {
    return this.casesService.resolveCase(tenantId, id, body.resolutionSummary, body.agentName);
  }

  @Post(':id/rate')
  rateCase(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { rating: number; feedback?: string },
  ) {
    return this.casesService.rateCase(tenantId, id, body.rating, body.feedback);
  }
}
