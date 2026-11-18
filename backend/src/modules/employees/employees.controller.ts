import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  getEmployees(
    @CurrentTenant() tenantId: string,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
  ) {
    return this.employeesService.getEmployees(tenantId, { search, departmentId, status });
  }

  @Get('org-tree')
  getOrgTree(@CurrentTenant() tenantId: string) {
    return this.employeesService.getOrgTree(tenantId);
  }

  @Get('recycle-bin/records')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  getRecycleBin(@CurrentTenant() tenantId: string) {
    return this.employeesService.getRecycleBin(tenantId);
  }

  @Get('processes/active')
  getHrProcesses(@CurrentTenant() tenantId: string) {
    return this.employeesService.getHrProcesses(tenantId);
  }

  @Get('processes')
  getAllHrProcesses(
    @CurrentTenant() tenantId: string,
    @Query('process') process?: string,
  ) {
    return this.employeesService.getHrProcesses(tenantId, process);
  }

  @Post('processes')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  createHrProcess(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.employeesService.createHrProcess(tenantId, body);
  }

  @Get('insights/overview')
  getInsights(@CurrentTenant() tenantId: string) {
    return this.employeesService.getInsights(tenantId);
  }

  @Post(':id/restore')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  restoreEmployee(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.restoreEmployee(tenantId, id);
  }

  @Get(':id')
  getEmployeeById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.getEmployeeById(tenantId, id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  createEmployee(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.employeesService.createEmployee(tenantId, body);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  updateEmployee(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.updateEmployee(tenantId, id, body);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  updateEmployeeStatus(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.employeesService.updateEmployeeStatus(tenantId, id, body.status, body.reason);
  }

  @Patch(':id/profile')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'EMPLOYEE')
  updateEmployeeProfile(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.updateEmployeeProfile(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  deactivateEmployee(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.deactivateEmployee(tenantId, id);
  }

  @Get(':id/history')
  getJobHistory(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.getJobHistory(tenantId, id);
  }

  @Post(':id/history')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  addJobHistory(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.addJobHistory(tenantId, id, body);
  }

  @Get('custom-fields/definitions')
  getCustomFieldDefinitions(@CurrentTenant() tenantId: string) {
    return this.employeesService.getCustomFieldDefinitions(tenantId);
  }

  @Post('custom-fields/definitions')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  createCustomFieldDefinition(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.employeesService.createCustomFieldDefinition(tenantId, body);
  }

  @Get(':id/custom-fields')
  getCustomFieldValues(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.getCustomFieldValues(tenantId, id);
  }

  @Post(':id/custom-fields')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN', 'HR_MANAGER')
  setCustomFieldValue(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { fieldId: string; value: string },
  ) {
    return this.employeesService.setCustomFieldValue(tenantId, id, body.fieldId, body.value);
  }
}

@Controller('departments')
export class DepartmentsController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  getDepartments(@CurrentTenant() tenantId: string) {
    return this.employeesService.getDepartments(tenantId);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  createDepartment(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.employeesService.createDepartment(tenantId, body);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  updateDepartment(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.updateDepartment(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  deleteDepartment(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.deleteDepartment(tenantId, id);
  }
}

@Controller('designations')
export class DesignationsController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  getDesignations(@CurrentTenant() tenantId: string) {
    return this.employeesService.getDesignations(tenantId);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  createDesignation(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.employeesService.createDesignation(tenantId, body);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  updateDesignation(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.employeesService.updateDesignation(tenantId, id, body);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_ADMIN')
  deleteDesignation(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.employeesService.deleteDesignation(tenantId, id);
  }
}

@Controller('locations')
export class LocationsController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  getLocations(@CurrentTenant() tenantId: string) {
    return this.employeesService.getLocations(tenantId);
  }
}
