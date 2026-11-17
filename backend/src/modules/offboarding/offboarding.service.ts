import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class OffboardingService {
  constructor(private dataStore: DataStoreService) {}

  getExitRequests(tenantId: string) {
    return this.dataStore.getExitRequests(tenantId);
  }

  createExitRequest(tenantId: string, payload: any) {
    return this.dataStore.createExitRequest(tenantId, payload);
  }

  getClearances(tenantId: string, exitRequestId: string) {
    return this.dataStore.getClearances(tenantId, exitRequestId);
  }

  updateClearanceItem(tenantId: string, itemId: string, status: string, holdReason?: string, amount?: number) {
    return this.dataStore.updateClearanceItem(tenantId, itemId, status, holdReason, amount);
  }

  getFnfSettlement(tenantId: string, exitRequestId: string) {
    return this.dataStore.getFnfSettlement(tenantId, exitRequestId);
  }
}
