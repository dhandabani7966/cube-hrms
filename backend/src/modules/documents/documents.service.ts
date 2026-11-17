import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class DocumentsService {
  constructor(private dataStore: DataStoreService) {}

  getPolicies(tenantId: string) {
    return this.dataStore.getPolicies(tenantId);
  }

  acknowledgePolicy(tenantId: string, policyId: string, employeeId: string, ip?: string, ua?: string) {
    return this.dataStore.acknowledgePolicy(tenantId, policyId, employeeId, ip, ua);
  }

  getEmployeeDocuments(tenantId: string, employeeId?: string) {
    return this.dataStore.getEmployeeDocuments(tenantId, employeeId);
  }

  getExpiringDocuments(tenantId: string, daysAhead: number = 60) {
    return this.dataStore.getExpiringDocuments(tenantId, daysAhead);
  }
}
