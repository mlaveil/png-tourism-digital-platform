/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TourismOperator, RegistrationApplication, MembershipRecord, LicenseRecord, OperatorCompliance, AuditLog, NotificationItem, RegistrationStatus, MembershipStatus, LicenseStatus, ComplianceStatus, DashboardAnalytics } from '../types';
import { INITIAL_OPERATORS, INITIAL_REGISTRATIONS, INITIAL_MEMBERSHIPS, INITIAL_LICENSES, INITIAL_COMPLIANCE, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, PROVINCES, TOURISM_CATEGORIES } from './data';

const EXPIRY_WINDOW_DAYS = 90;
const dateOnly = (d: Date) => d.toISOString().split('T')[0];
const daysUntil = (value: string) => Math.ceil((new Date(`${value}T23:59:59`).getTime() - Date.now()) / 86400000);

class TourismDataStore {
  private operators: TourismOperator[] = [];
  private registrations: RegistrationApplication[] = [];
  private memberships: MembershipRecord[] = [];
  private licenses: LicenseRecord[] = [];
  private complianceRecords: Record<string, OperatorCompliance> = {};
  private auditLogs: AuditLog[] = [];
  private notifications: NotificationItem[] = [];

  constructor() { this.resetToDefaults(); }

  public resetToDefaults() {
    this.operators = JSON.parse(JSON.stringify(INITIAL_OPERATORS));
    this.registrations = JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
    this.memberships = JSON.parse(JSON.stringify(INITIAL_MEMBERSHIPS));
    this.licenses = JSON.parse(JSON.stringify(INITIAL_LICENSES));
    this.complianceRecords = JSON.parse(JSON.stringify(INITIAL_COMPLIANCE));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  private nextNumber(prefix: 'REG' | 'MEM' | 'LIC', records: Array<{ [key: string]: unknown }>, field: string): string {
    const year = new Date().getFullYear();
    const re = new RegExp(`^TPA-${prefix}-${year}-(\\d+)$`);
    const max = records.reduce((highest, record) => {
      const value = String(record[field] || '');
      const match = value.match(re);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);
    return `TPA-${prefix}-${year}-${String(max + 1).padStart(4, '0')}`;
  }

  public logAudit(user: string, role: string, action: string, entity: 'Operator' | 'Registration' | 'Membership' | 'Licence' | 'Compliance' | 'System', entityId: string, previousStatus?: string, newStatus?: string, notes?: string): AuditLog {
    const log: AuditLog = { id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`, timestamp: new Date().toISOString(), user: user || 'TPA System', role: role || 'System', action, entity, entityId, previousStatus, newStatus, notes };
    this.auditLogs.unshift(log);
    return log;
  }

  public getAuditLogs(): AuditLog[] { return this.auditLogs; }
  public getNotifications(role?: string, operatorId?: string): NotificationItem[] { return this.notifications.filter(n => (operatorId && n.operatorId === operatorId) || (role && n.targetRole === role) || (!n.targetRole && !n.operatorId)); }
  public markNotificationRead(id: string) { const item = this.notifications.find(n => n.id === id); if (item) item.read = true; return item; }

  public getProvinces() {
    return PROVINCES.map(p => ({ ...p, operatorCount: this.operators.filter(op => op.province.toLowerCase() === p.name.toLowerCase() && op.registrationStatus === 'Registered').length }));
  }
  public getCategories() { return TOURISM_CATEGORIES; }

  public getOperators(filters?: { search?: string; province?: string; category?: string; status?: string; compliance?: string; publicOnly?: boolean }): TourismOperator[] {
    let result = [...this.operators];
    if (filters?.publicOnly) result = result.filter(op => op.registrationStatus === 'Registered');
    if (filters?.province && filters.province !== 'All') { const p = filters.province.toLowerCase().replace(/-/g, ' '); result = result.filter(op => op.province.toLowerCase().includes(p) || p.includes(op.province.toLowerCase())); }
    if (filters?.category && filters.category !== 'All') result = result.filter(op => op.categoryId === filters.category || op.categoryName === filters.category);
    if (filters?.status && filters.status !== 'All') result = result.filter(op => op.registrationStatus === filters.status);
    if (filters?.compliance && filters.compliance !== 'All') result = result.filter(op => op.complianceStatus === filters.compliance);
    if (filters?.search) { const q = filters.search.toLowerCase(); result = result.filter(op => [op.businessName, op.tradingName, op.province, op.description, op.contactPerson].some(v => v.toLowerCase().includes(q))); }
    return result;
  }
  public getOperatorById(id: string) { return this.operators.find(op => op.id === id); }

  public createOperator(data: Partial<TourismOperator>, actor: { name: string; role: string }): TourismOperator {
    const id = data.id || `op-${Date.now()}`;
    const category = TOURISM_CATEGORIES.find(c => c.id === data.categoryId) || TOURISM_CATEGORIES[0];
    const newOp: TourismOperator = {
      id, businessName: data.businessName || 'New Tourism Business', tradingName: data.tradingName || data.businessName || 'New Tourism Business', operatorType: data.operatorType || 'Tour Operator', categoryId: category.id, categoryName: category.name, province: data.province || 'National Capital District', district: data.district || 'Urban District', address: data.address || 'Port Moresby, Papua New Guinea', contactPerson: data.contactPerson || 'Business Owner', email: data.email || 'demo@example.com', phone: data.phone || '+675 7000 0000', website: data.website || '', description: data.description || 'Demonstration tourism services provider.', latitude: Number(data.latitude) || -9.4438, longitude: Number(data.longitude) || 147.1803, registrationStatus: (data.registrationStatus as RegistrationStatus) || 'Draft', membershipStatus: (data.membershipStatus as MembershipStatus) || 'None', licenseStatus: (data.licenseStatus as LicenseStatus) || 'None', complianceStatus: (data.complianceStatus as ComplianceStatus) || 'Conditional', heroImage: data.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80', galleryImages: data.galleryImages || ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'], features: data.features || ['Demonstration listing', 'Local guided tours', 'Safety briefing concept'], priceRange: data.priceRange || 'PGK 350 - PGK 2,500', rating: 5, reviewCount: 1, createdDate: new Date().toISOString(), lastUpdatedDate: new Date().toISOString()
    };
    this.operators.unshift(newOp); this.createDefaultCompliance(newOp.id);
    this.logAudit(actor.name, actor.role, 'Operator Created', 'Operator', newOp.id, undefined, newOp.registrationStatus, `Created demonstration operator "${newOp.businessName}" in ${newOp.province}`);
    return newOp;
  }

  public updateOperator(id: string, updates: Partial<TourismOperator>, actor: { name: string; role: string }): TourismOperator | null {
    const idx = this.operators.findIndex(op => op.id === id); if (idx === -1) return null;
    const prev = this.operators[idx];
    if (updates.categoryId) { const cat = TOURISM_CATEGORIES.find(c => c.id === updates.categoryId); if (cat) updates.categoryName = cat.name; }
    const updated = { ...prev, ...updates, lastUpdatedDate: new Date().toISOString() };
    this.operators[idx] = updated;
    if (prev.registrationStatus !== updated.registrationStatus) this.logAudit(actor.name, actor.role, 'Operator Status Updated', 'Operator', id, prev.registrationStatus, updated.registrationStatus, `Registration status changed for "${updated.businessName}"`);
    return updated;
  }

  public getRegistrations() { return this.registrations; }
  public getRegistrationById(id: string) { return this.registrations.find(r => r.id === id || r.operatorId === id); }
  public createRegistration(operatorId: string, actor: { name: string; role: string }, notes?: string): RegistrationApplication {
    const operator = this.getOperatorById(operatorId); if (!operator) throw new Error('Operator not found');
    const appNumber = this.nextNumber('REG', this.registrations as unknown as Array<{ [key: string]: unknown }>, 'applicationNumber'); const now = new Date().toISOString();
    const reg: RegistrationApplication = { id: `reg-${Date.now()}`, applicationNumber: appNumber, operatorId, operatorName: operator.businessName, status: 'Submitted', submittedDate: now, history: [{ timestamp: now, fromStatus: operator.registrationStatus, toStatus: 'Submitted', actor: actor.name, role: actor.role, notes: notes || 'Demonstration registration application submitted.' }] };
    this.registrations.unshift(reg); this.updateOperator(operatorId, { registrationStatus: 'Submitted' }, actor); this.logAudit(actor.name, actor.role, 'Registration Submitted', 'Registration', reg.id, operator.registrationStatus, 'Submitted', `Demonstration registration ${appNumber} submitted for ${operator.businessName}`); return reg;
  }
  public updateRegistrationStatus(regId: string, newStatus: RegistrationStatus, actor: { name: string; role: string }, reviewerNotes?: string) {
    const reg = this.registrations.find(r => r.id === regId || r.operatorId === regId); if (!reg) return null;
    const from = reg.status; reg.status = newStatus; reg.reviewedDate = new Date().toISOString(); reg.reviewer = actor.name; reg.reviewerNotes = reviewerNotes || reg.reviewerNotes;
    reg.history.push({ timestamp: new Date().toISOString(), fromStatus: from, toStatus: newStatus, actor: actor.name, role: actor.role, notes: reviewerNotes || `Status changed from ${from} to ${newStatus}` });
    this.updateOperator(reg.operatorId, { registrationStatus: newStatus }, actor); this.logAudit(actor.name, actor.role, `Registration ${newStatus}`, 'Registration', reg.id, from, newStatus, `Registration ${reg.applicationNumber} updated to ${newStatus}.`); return reg;
  }

  public getMemberships() { return this.memberships; }
  public createMembership(data: Partial<MembershipRecord>, actor: { name: string; role: string }): MembershipRecord {
    const operator = this.getOperatorById(data.operatorId || ''); if (!operator) throw new Error('Operator not found');
    const memNumber = this.nextNumber('MEM', this.memberships as unknown as Array<{ [key: string]: unknown }>, 'membershipNumber');
    const newMem: MembershipRecord = { id: `mem-${Date.now()}`, membershipNumber: memNumber, operatorId: operator.id, operatorName: operator.businessName, membershipType: data.membershipType || 'Tour Operator Member', startDate: data.startDate || dateOnly(new Date()), expiryDate: data.expiryDate || dateOnly(new Date(Date.now() + 365 * 86400000)), status: (data.status as MembershipStatus) || 'Active', feePaid: Number(data.feePaid) || 2500, notes: data.notes || 'Demonstration membership record.' };
    this.memberships.unshift(newMem); if (newMem.status === 'Active') this.updateOperator(operator.id, { membershipStatus: 'Active' }, actor); this.logAudit(actor.name, actor.role, 'Membership Created', 'Membership', newMem.id, undefined, newMem.status, `Created demonstration membership ${memNumber}.`); return newMem;
  }
  public updateMembershipStatus(id: string, status: MembershipStatus, actor: { name: string; role: string }, notes?: string) {
    const mem = this.memberships.find(m => m.id === id); if (!mem) return null; const prev = mem.status; mem.status = status; if (notes) mem.notes = `${mem.notes} | ${notes}`; const op = this.getOperatorById(mem.operatorId); if (op) this.updateOperator(op.id, { membershipStatus: status }, actor); this.logAudit(actor.name, actor.role, `Membership ${status}`, 'Membership', mem.id, prev, status, notes || `Membership status updated to ${status}`); return mem;
  }

  public getLicenses() { return this.licenses; }
  public createLicense(data: Partial<LicenseRecord>, actor: { name: string; role: string }): LicenseRecord {
    const operator = this.getOperatorById(data.operatorId || ''); if (!operator) throw new Error('Operator not found');
    const licNumber = this.nextNumber('LIC', this.licenses as unknown as Array<{ [key: string]: unknown }>, 'licenseNumber');
    const newLic: LicenseRecord = { id: `lic-${Date.now()}`, licenseNumber: licNumber, operatorId: operator.id, operatorName: operator.businessName, licenseType: data.licenseType || 'Standard Tourism Commercial Licence', issueDate: data.issueDate || dateOnly(new Date()), expiryDate: data.expiryDate || dateOnly(new Date(Date.now() + 365 * 86400000)), status: (data.status as LicenseStatus) || 'Active', conditions: data.conditions || ['Maintain applicable insurance coverage', 'Follow applicable PNG tourism safety requirements'], notes: data.notes || 'Demonstration licence record.' };
    this.licenses.unshift(newLic); if (newLic.status === 'Active') this.updateOperator(operator.id, { licenseStatus: 'Active' }, actor); this.logAudit(actor.name, actor.role, 'Licence Issued', 'Licence', newLic.id, undefined, newLic.status, `Created demonstration licence ${licNumber}.`); return newLic;
  }
  public updateLicenseStatus(id: string, status: LicenseStatus, actor: { name: string; role: string }, notes?: string) {
    const lic = this.licenses.find(l => l.id === id); if (!lic) return null; const prev = lic.status; lic.status = status; if (notes) lic.notes = `${lic.notes} | ${notes}`; const op = this.getOperatorById(lic.operatorId); if (op) this.updateOperator(op.id, { licenseStatus: status }, actor); this.logAudit(actor.name, actor.role, `Licence ${status}`, 'Licence', lic.id, prev, status, notes || `Licence status updated to ${status}`); return lic;
  }

  public getCompliance(operatorId: string): OperatorCompliance { if (!this.complianceRecords[operatorId]) this.createDefaultCompliance(operatorId); return this.complianceRecords[operatorId]; }
  private createDefaultCompliance(operatorId: string): OperatorCompliance {
    const today = dateOnly(new Date()); const in365 = dateOnly(new Date(Date.now() + 365 * 86400000)); const in730 = dateOnly(new Date(Date.now() + 730 * 86400000));
    const def: OperatorCompliance = { operatorId, overallStatus: 'Compliant', lastAssessedDate: new Date().toISOString(), assessorNotes: 'Demonstration compliance record.', requirements: [
      { id: `cr-${Date.now()}-1`, name: 'Business Registration', category: 'Legal', status: 'Compliant', issueDate: today, expiryDate: in730, documentRef: 'DEMO-BUSINESS-REGISTRATION.pdf' },
      { id: `cr-${Date.now()}-2`, name: 'Tourism Operating Licence', category: 'Legal', status: 'Compliant', issueDate: today, expiryDate: in365, documentRef: 'DEMO-TOURISM-LICENCE.pdf' },
      { id: `cr-${Date.now()}-3`, name: 'Public Liability Insurance', category: 'Insurance', status: 'Compliant', issueDate: today, expiryDate: in365, documentRef: 'DEMO-INSURANCE.pdf' },
      { id: `cr-${Date.now()}-4`, name: 'Visitor Health & Safety Plan', category: 'Safety', status: 'Compliant', issueDate: today, expiryDate: in365, documentRef: 'DEMO-SAFETY-PLAN.pdf' },
      { id: `cr-${Date.now()}-5`, name: 'Tax Clearance Certificate', category: 'Financial', status: 'Compliant', issueDate: today, expiryDate: in365, documentRef: 'DEMO-TAX-CLEARANCE.pdf' },
      { id: `cr-${Date.now()}-6`, name: 'Environmental & Cultural Heritage Return', category: 'Quality', status: 'Compliant', issueDate: today, expiryDate: in365, documentRef: 'DEMO-ENVIRONMENTAL-RETURN.pdf' }
    ]};
    this.complianceRecords[operatorId] = def; return def;
  }
  public updateComplianceRequirement(operatorId: string, reqId: string, status: 'Compliant' | 'Pending' | 'Non-Compliant' | 'Expired', actor: { name: string; role: string }, notes?: string): OperatorCompliance {
    const comp = this.getCompliance(operatorId); const req = comp.requirements.find(r => r.id === reqId); if (req) { req.status = status; req.verifiedBy = actor.name; if (notes) req.notes = notes; }
    const overall: ComplianceStatus = comp.requirements.some(r => r.status === 'Non-Compliant' || r.status === 'Expired') ? 'Non-Compliant' : comp.requirements.some(r => r.status === 'Pending') ? 'Conditional' : 'Compliant';
    comp.overallStatus = overall; comp.lastAssessedDate = new Date().toISOString(); if (notes) comp.assessorNotes = notes; const op = this.getOperatorById(operatorId); if (op) this.updateOperator(op.id, { complianceStatus: overall }, actor); this.logAudit(actor.name, actor.role, 'Compliance Updated', 'Compliance', operatorId, undefined, overall, `Demonstration requirement "${req?.name || reqId}" set to ${status}.`); return comp;
  }

  public getDashboardAnalytics(): DashboardAnalytics {
    const totalOperators = this.operators.length;
    const pendingApplications = this.registrations.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
    const activeLicenses = this.licenses.filter(l => l.status === 'Active').length;
    const activeMemberships = this.memberships.filter(m => m.status === 'Active').length;
    const compliantCount = this.operators.filter(o => o.complianceStatus === 'Compliant').length;
    const conditionalCount = this.operators.filter(o => o.complianceStatus === 'Conditional').length;
    const nonCompliantCount = this.operators.filter(o => o.complianceStatus === 'Non-Compliant').length;
    const complianceRate = totalOperators ? Math.round((compliantCount / totalOperators) * 100) : 0;
    const provinceMap: Record<string, number> = {}; this.operators.forEach(op => { provinceMap[op.province] = (provinceMap[op.province] || 0) + 1; });
    const catMap: Record<string, number> = {}; this.operators.forEach(op => { const cat = op.categoryName || 'General Tourism'; catMap[cat] = (catMap[cat] || 0) + 1; });
    const regMap: Record<string, number> = {}; this.operators.forEach(op => { regMap[op.registrationStatus] = (regMap[op.registrationStatus] || 0) + 1; });
    const expiring = <T extends { status: string; expiryDate: string }>(items: T[]) => items.filter(item => item.status === 'Active').map(item => ({ item, days: daysUntil(item.expiryDate) })).filter(x => x.days >= 0 && x.days <= EXPIRY_WINDOW_DAYS).sort((a, b) => a.days - b.days).slice(0, 5).map(x => x.item);
    return { totalOperators, pendingApplications, activeLicenses, activeMemberships, complianceRate, compliantCount, conditionalCount, nonCompliantCount, operatorsByProvince: Object.entries(provinceMap).map(([province, count]) => ({ province, count })), operatorsByCategory: Object.entries(catMap).map(([category, count]) => ({ category, count })), registrationDistribution: Object.entries(regMap).map(([status, count]) => ({ status, count })), recentApplications: this.registrations.slice(0, 5), expiringLicenses: expiring(this.licenses), expiringMemberships: expiring(this.memberships) };
  }
}

export const dbStore = new TourismDataStore();
