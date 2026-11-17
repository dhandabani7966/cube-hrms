import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class EssService {
  constructor(private dataStore: DataStoreService) {}

  getMyProfile(tenantId: string) {
    const emps = this.dataStore.getEmployees(tenantId);
    return emps.length > 0 ? this.dataStore.getEmployeeById(tenantId, emps[0].id) : null;
  }

  getAnnouncements(tenantId: string) {
    return this.dataStore.getAnnouncements(tenantId);
  }

  createProfileRequest(tenantId: string, payload: any) {
    return this.dataStore.createProfileRequest(tenantId, payload);
  }

  getProfileRequests(tenantId: string) {
    return this.dataStore.getProfileRequests(tenantId);
  }

  createDelegation(tenantId: string, payload: any) {
    return this.dataStore.createDelegation(tenantId, payload);
  }
}
