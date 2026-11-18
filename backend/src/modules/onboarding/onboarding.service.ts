import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class OnboardingService {
  constructor(private dataStore: DataStoreService) {}

  getCandidates(tenantId: string, status?: string) {
    return this.dataStore.getCandidates(tenantId, status);
  }

  createCandidate(tenantId: string, payload: any) {
    return this.dataStore.createCandidate(tenantId, payload);
  }

  convertCandidate(tenantId: string, candidateId: string, payload: any) {
    try {
      return this.dataStore.convertCandidateToEmployee(tenantId, candidateId, payload);
    } catch (e: any) {
      throw new NotFoundException(e.message);
    }
  }

  massUpdateCandidates(tenantId: string, candidateIds: string[], updates: Record<string, any>) {
    return this.dataStore.massUpdateCandidates(tenantId, candidateIds, updates);
  }

  bulkDeleteCandidates(tenantId: string, candidateIds: string[]) {
    return this.dataStore.bulkDeleteCandidates(tenantId, candidateIds);
  }

  bulkConvertCandidates(tenantId: string, candidateIds: string[], payload?: any) {
    return this.dataStore.bulkConvertCandidates(tenantId, candidateIds, payload);
  }

  bulkInviteCandidates(tenantId: string, candidateIds: string[]) {
    return this.dataStore.bulkInviteCandidates(tenantId, candidateIds);
  }

  bulkImportCandidates(tenantId: string, candidatesList: any[]) {
    return this.dataStore.bulkImportCandidates(tenantId, candidatesList);
  }

  exportCandidates(tenantId: string) {
    return this.dataStore.exportCandidates(tenantId);
  }

  getCandidatesAuditHistory(tenantId: string) {
    return this.dataStore.getCandidatesAuditHistory(tenantId);
  }

  getAccessLogs(tenantId: string) {
    return this.dataStore.getAccessLogs(tenantId);
  }
}
