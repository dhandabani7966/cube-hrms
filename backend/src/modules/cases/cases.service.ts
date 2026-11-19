import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class CasesService {
  constructor(private dataStore: DataStoreService) {}

  getCases(
    tenantId: string,
    filter?: {
      status?: string;
      priority?: string;
      queue?: string;
      category_id?: string;
      search?: string;
      sort?: string;
      requester_id?: string;
      agent_id?: string;
      role?: string;
    },
  ) {
    return this.dataStore.getCases(tenantId, filter);
  }

  getCaseById(tenantId: string, id: string, role?: string) {
    const c = this.dataStore.getCaseById(tenantId, id, role);
    if (!c) throw new NotFoundException('Case not found');
    return c;
  }

  createCase(tenantId: string, payload: any, role?: string) {
    return this.dataStore.createCase(tenantId, payload, role);
  }

  updateCase(tenantId: string, id: string, payload: any, role?: string) {
    return this.dataStore.updateCase(tenantId, id, payload, role);
  }

  addMessage(tenantId: string, caseId: string, payload: any, role?: string) {
    return this.dataStore.addCaseMessage(tenantId, caseId, payload, role);
  }

  resolveCase(tenantId: string, caseId: string, resolutionSummary: string, agentName?: string) {
    return this.dataStore.resolveCase(tenantId, caseId, resolutionSummary, agentName);
  }

  rateCase(tenantId: string, caseId: string, rating: number, feedback?: string) {
    return this.dataStore.rateCase(tenantId, caseId, rating, feedback);
  }

  runEscalationCheck(tenantId: string) {
    return this.dataStore.runEscalationCheck(tenantId);
  }

  getCategories(tenantId: string) {
    return this.dataStore.getCaseCategories(tenantId);
  }

  createCategory(tenantId: string, payload: any) {
    return this.dataStore.createCaseCategory(tenantId, payload);
  }

  updateCategory(tenantId: string, id: string, payload: any) {
    return this.dataStore.updateCaseCategory(tenantId, id, payload);
  }

  getSlaPolicies(tenantId: string) {
    return this.dataStore.getSlaPolicies(tenantId);
  }

  saveSlaPolicy(tenantId: string, payload: any) {
    return this.dataStore.saveSlaPolicy(tenantId, payload);
  }

  getKnowledgeStatus(tenantId: string) {
    return this.dataStore.getKnowledgeHiveStatus(tenantId);
  }

  reindexKnowledge(tenantId: string) {
    return this.dataStore.reindexKnowledgeHive(tenantId);
  }

  getRecommendations(tenantId: string, query: string) {
    return this.dataStore.getPolicyRecommendations(tenantId, query);
  }

  getEmployeeContext(tenantId: string, employeeId: string) {
    return this.dataStore.getEmployeeCasesContext(tenantId, employeeId);
  }

  checkUnresolvedForOffboarding(tenantId: string, employeeId: string) {
    return this.dataStore.checkUnresolvedCasesForOffboarding(tenantId, employeeId);
  }
}
