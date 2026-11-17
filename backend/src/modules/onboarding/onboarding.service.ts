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
}
