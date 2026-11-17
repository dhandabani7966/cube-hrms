import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class CasesService {
  constructor(private dataStore: DataStoreService) {}

  getCases(tenantId: string, filter?: { status?: string; priority?: string }) {
    return this.dataStore.getCases(tenantId, filter);
  }

  getCaseById(tenantId: string, id: string) {
    const c = this.dataStore.getCaseById(tenantId, id);
    if (!c) throw new NotFoundException('Case not found');
    return c;
  }

  createCase(tenantId: string, payload: any) {
    return this.dataStore.createCase(tenantId, payload);
  }

  addMessage(tenantId: string, caseId: string, payload: any) {
    return this.dataStore.addCaseMessage(tenantId, caseId, payload);
  }

  resolveCase(tenantId: string, caseId: string, resolutionSummary: string) {
    return this.dataStore.resolveCase(tenantId, caseId, resolutionSummary);
  }

  getCategories(tenantId: string) {
    return this.dataStore.getCaseCategories(tenantId);
  }
}
