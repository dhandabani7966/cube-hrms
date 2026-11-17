import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class EmployeesService {
  constructor(private dataStore: DataStoreService) {}

  getEmployees(tenantId: string, query?: { search?: string; departmentId?: string; status?: string }) {
    return this.dataStore.getEmployees(tenantId, query);
  }

  getEmployeeById(tenantId: string, id: string) {
    const emp = this.dataStore.getEmployeeById(tenantId, id);
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  createEmployee(tenantId: string, payload: any) {
    return this.dataStore.createEmployee(tenantId, payload);
  }

  updateEmployee(tenantId: string, id: string, payload: any) {
    return this.dataStore.updateEmployee(tenantId, id, payload);
  }

  updateEmployeeStatus(tenantId: string, id: string, status: string, reason?: string) {
    return this.dataStore.updateEmployeeStatus(tenantId, id, status, reason);
  }

  updateEmployeeProfile(tenantId: string, employeeId: string, payload: any) {
    return this.dataStore.updateEmployeeProfile(tenantId, employeeId, payload);
  }

  deactivateEmployee(tenantId: string, id: string) {
    return this.dataStore.deactivateEmployee(tenantId, id);
  }

  restoreEmployee(tenantId: string, id: string) {
    return this.dataStore.restoreEmployee(tenantId, id);
  }

  getRecycleBin(tenantId: string) {
    return this.dataStore.getRecycleBin(tenantId);
  }

  getHrProcesses(tenantId: string) {
    return this.dataStore.getHrProcesses(tenantId);
  }

  getJobHistory(tenantId: string, employeeId: string) {
    return this.dataStore.getJobHistory(tenantId, employeeId);
  }

  addJobHistory(tenantId: string, employeeId: string, payload: any) {
    return this.dataStore.addJobHistory(tenantId, employeeId, payload);
  }

  getOrgTree(tenantId: string) {
    return this.dataStore.getOrgTree(tenantId);
  }

  getDepartments(tenantId: string) {
    return this.dataStore.getDepartments(tenantId);
  }

  createDepartment(tenantId: string, payload: any) {
    return this.dataStore.createDepartment(tenantId, payload);
  }

  updateDepartment(tenantId: string, id: string, payload: any) {
    return this.dataStore.updateDepartment(tenantId, id, payload);
  }

  deleteDepartment(tenantId: string, id: string) {
    return this.dataStore.deleteDepartment(tenantId, id);
  }

  getDesignations(tenantId: string) {
    return this.dataStore.getDesignations(tenantId);
  }

  createDesignation(tenantId: string, payload: any) {
    return this.dataStore.createDesignation(tenantId, payload);
  }

  updateDesignation(tenantId: string, id: string, payload: any) {
    return this.dataStore.updateDesignation(tenantId, id, payload);
  }

  getLocations(tenantId: string) {
    return this.dataStore.getLocations(tenantId);
  }

  getCustomFieldDefinitions(tenantId: string) {
    return this.dataStore.getCustomFieldDefinitions(tenantId);
  }

  createCustomFieldDefinition(tenantId: string, data: any) {
    return this.dataStore.createCustomFieldDefinition(tenantId, data);
  }

  getCustomFieldValues(tenantId: string, employeeId: string) {
    return this.dataStore.getCustomFieldValues(tenantId, employeeId);
  }

  setCustomFieldValue(tenantId: string, employeeId: string, fieldId: string, value: string) {
    return this.dataStore.setCustomFieldValue(tenantId, employeeId, fieldId, value);
  }
}
