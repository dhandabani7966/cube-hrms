import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class DocumentsService {
  constructor(private dataStore: DataStoreService) {}

  getFolders(tenantId: string) {
    return this.dataStore.getDocumentFolders(tenantId);
  }

  createFolder(tenantId: string, data: any) {
    return this.dataStore.createDocumentFolder(tenantId, data);
  }

  updateFolder(tenantId: string, id: string, data: any) {
    return this.dataStore.updateDocumentFolder(tenantId, id, data);
  }

  getCompanyDocuments(tenantId: string, folderId?: string) {
    return this.dataStore.getCompanyDocuments(tenantId, folderId);
  }

  createCompanyDocument(tenantId: string, data: any) {
    return this.dataStore.createCompanyDocument(tenantId, data);
  }

  getComplianceSummary(tenantId: string, documentId?: string) {
    return this.dataStore.getComplianceSummary(tenantId, documentId);
  }

  recordConsent(
    tenantId: string,
    documentId: string,
    employeeId: string,
    consentStatus: 'OPTED_IN' | 'OPTED_OUT' = 'OPTED_IN',
    ip?: string,
    ua?: string,
    notes?: string,
  ) {
    return this.dataStore.recordDocumentConsent(tenantId, documentId, employeeId, consentStatus, ip, ua, notes);
  }

  sendBulkReminders(tenantId: string, documentId?: string) {
    return this.dataStore.sendBulkConsentReminders(tenantId, documentId);
  }

  getVaultFiles(tenantId: string, employeeId?: string, category?: string) {
    return this.dataStore.getEmployeeVaultFiles(tenantId, employeeId, category);
  }

  uploadVaultFile(tenantId: string, data: any) {
    return this.dataStore.uploadEmployeeVaultFile(tenantId, data);
  }

  deleteVaultFile(tenantId: string, id: string) {
    return this.dataStore.deleteEmployeeVaultFile(tenantId, id);
  }

  getExpiryRadar(tenantId: string) {
    return this.dataStore.getDocumentExpiryRadar(tenantId);
  }

  sendExpiryAlerts(tenantId: string, fileIds?: string[]) {
    return this.dataStore.sendExpiryAlerts(tenantId, fileIds);
  }

  getSignatureFlows(tenantId: string, employeeId?: string) {
    return this.dataStore.getSignatureFlows(tenantId, employeeId);
  }

  createSignatureFlow(tenantId: string, data: any) {
    return this.dataStore.createSignatureFlow(tenantId, data);
  }

  signSignatureFlow(tenantId: string, id: string, signatureData?: any) {
    return this.dataStore.signSignatureFlow(tenantId, id, signatureData);
  }

  getSettings(tenantId: string) {
    return this.dataStore.getDocumentSettings(tenantId);
  }

  updateSettings(tenantId: string, data: any) {
    return this.dataStore.updateDocumentSettings(tenantId, data);
  }

  syncSharePoint(tenantId: string) {
    return this.dataStore.syncToSharePoint(tenantId);
  }

  checkLockout(tenantId: string, employeeId: string) {
    return this.dataStore.checkUserMandatoryLockout(tenantId, employeeId);
  }

  // Backwards-compatible legacy methods
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
