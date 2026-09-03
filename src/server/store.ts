/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  OperatorCompliance,
  ComplianceRequirement,
  AuditLog,
  NotificationItem,
  RegistrationStatus,
  MembershipStatus,
  LicenseStatus,
  ComplianceStatus,
  DashboardAnalytics
} from '../types';
import {
  INITIAL_OPERATORS,
  INITIAL_REGISTRATIONS,
  INITIAL_MEMBERSHIPS,
  INITIAL_LICENSES,
  INITIAL_COMPLIANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  PROVINCES,
  TOURISM_CATEGORIES
} from './data';

class TourismDataStore {
  private operators: TourismOperator[] = [];
  private registrations: RegistrationApplication[] = [];
  private memberships: MembershipRecord[] = [];
  private licenses: LicenseRecord[] = [];
  private complianceRecords: Record<string, OperatorCompliance> = {};
  private auditLogs: AuditLog[] = [];
  private notifications: NotificationItem[] = [];

  constructor() {
    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.operators = JSON.parse(JSON.stringify(INITIAL_OPERATORS));
    this.registrations = JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
    this.memberships = JSON.parse(JSON.stringify(INITIAL_MEMBERSHIPS));
    this.licenses = JSON.parse(JSON.stringify(INITIAL_LICENSES));
    this.complianceRecords = JSON.parse(JSON.stringify(INITIAL_COMPLIANCE));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  // --- Audit Logging ---
  public logAudit(
    user: string,
    role: string,
    action: string,
    entity: 'Operator' | 'Registration' | 'Membership' | 'Licence' | 'Compliance' | 'System',
    entityId: string,
    previousStatus?: string,
    newStatus?: string,
    notes?: string
  ): AuditLog {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user: user || 'TPA System',
      role: role || 'System',
      action,
      entity,
      entityId,
      previousStatus,
      newStatus,
      notes
    };
    this.auditLogs.unshift(log);
    return log;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // --- Notifications ---
  public getNotifications(role?: string, operatorId?: string): NotificationItem[] {
    return this.notifications.filter(n => {
      if (operatorId && n.operatorId === operatorId) return true;
      if (role && n.targetRole === role) return true;
      if (!n.targetRole && !n.operatorId) return true;
      return false;
    });
  }

  public markNotificationRead(id: string) {
    const item = this.notifications.find(n => n.id === id);
    if (item) item.read = true;
    return item;
  }

  // --- Provinces & Categories ---
  public getProvinces() {
    return PROVINCES.map(p => {
      const count = this.operators.filter(
        op => op.province.toLowerCase() === p.name.toLowerCase() && op.registrationStatus === 'Registered'
      ).length;
      return { ...p, operatorCount: count };
    });
  }

  public getCategories() {
    return TOURISM_CATEGORIES;
  }

  // --- Operators ---
  public getOperators(filters?: {
    search?: string;
    province?: string;
    category?: string;
    status?: string;
    compliance?: string;
    publicOnly?: boolean;
  }): TourismOperator[] {
    let result = [...this.operators];

    if (filters?.publicOnly) {
      result = result.filter(op => op.registrationStatus === 'Registered');
    }

    if (filters?.province && filters.province !== 'All') {
      const provClean = filters.province.toLowerCase().replace(/-/g, ' ');
      result = result.filter(op => op.province.toLowerCase().includes(provClean) || provClean.includes(op.province.toLowerCase()));
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(op => op.categoryId === filters.category || op.categoryName === filters.category);
    }

    if (filters?.status && filters.status !== 'All') {
      result = result.filter(op => op.registrationStatus === filters.status);
    }

    if (filters?.compliance && filters.compliance !== 'All') {
      result = result.filter(op => op.complianceStatus === filters.compliance);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        op =>
          op.businessName.toLowerCase().includes(q) ||
          op.tradingName.toLowerCase().includes(q) ||
          op.province.toLowerCase().includes(q) ||
          op.description.toLowerCase().includes(q) ||
          op.contactPerson.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getOperatorById(id: string): TourismOperator | undefined {
    return this.operators.find(op => op.id === id);
  }

  public createOperator(
    data: Partial<TourismOperator>,
    actor: { name: string; role: string }
  ): TourismOperator {
    const id = data.id || `op-${Date.now()}`;
    const category = TOURISM_CATEGORIES.find(c => c.id === data.categoryId) || TOURISM_CATEGORIES[0];

    const newOp: TourismOperator = {
      id,
      businessName: data.businessName || 'New Tourism Business',
      tradingName: data.tradingName || data.businessName || 'New Tourism Business',
      operatorType: data.operatorType || 'Tour Operator',
      categoryId: category.id,
      categoryName: category.name,
      province: data.province || 'National Capital District',
      district: data.district || 'Urban District',
      address: data.address || 'Port Moresby, Papua New Guinea',
      contactPerson: data.contactPerson || 'Business Owner',
      email: data.email || 'info@pngtourism.com.pg',
      phone: data.phone || '+675 321 0000',
      website: data.website || '',
      description: data.description || 'Registered Papua New Guinea tourism services provider.',
      latitude: Number(data.latitude) || -9.4438,
      longitude: Number(data.longitude) || 147.1803,
      registrationStatus: (data.registrationStatus as RegistrationStatus) || 'Draft',
      membershipStatus: (data.membershipStatus as MembershipStatus) || 'None',
      licenseStatus: (data.licenseStatus as LicenseStatus) || 'None',
      complianceStatus: (data.complianceStatus as ComplianceStatus) || 'Conditional',
      heroImage: data.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      galleryImages: data.galleryImages || [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
      ],
      features: data.features || ['TPA Registered', 'Local Guided Tours', 'Safety Briefing Provided'],
      priceRange: data.priceRange || 'PGK 350 - PGK 2,500',
      rating: 5.0,
      reviewCount: 1,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString()
    };

    this.operators.unshift(newOp);

    // Initialize default compliance baseline
    this.createDefaultCompliance(newOp.id);

    this.logAudit(
      actor.name,
      actor.role,
      'Operator Created',
      'Operator',
      newOp.id,
      undefined,
      newOp.registrationStatus,
      `Created operator "${newOp.businessName}" in ${newOp.province}`
    );

    return newOp;
  }

  public updateOperator(
    id: string,
    updates: Partial<TourismOperator>,
    actor: { name: string; role: string }
  ): TourismOperator | null {
    const idx = this.operators.findIndex(op => op.id === id);
    if (idx === -1) return null;

    const prev = this.operators[idx];
    const prevStatus = prev.registrationStatus;

    if (updates.categoryId) {
      const cat = TOURISM_CATEGORIES.find(c => c.id === updates.categoryId);
      if (cat) updates.categoryName = cat.name;
    }

    const updated: TourismOperator = {
      ...prev,
      ...updates,
      lastUpdatedDate: new Date().toISOString()
    };

    this.operators[idx] = updated;

    this.logAudit(
      actor.name,
      actor.role,
      'Operator Updated',
      'Operator',
      id,
      prevStatus !== updated.registrationStatus ? prevStatus : undefined,
      prevStatus !== updated.registrationStatus ? updated.registrationStatus : undefined,
      `Updated details for "${updated.businessName}"`
    );

    return updated;
  }

  // --- Registration Workflows ---
  public getRegistrations(): RegistrationApplication[] {
    return this.registrations;
  }

  public getRegistrationById(id: string): RegistrationApplication | undefined {
    return this.registrations.find(r => r.id === id || r.operatorId === id);
  }

  public createRegistration(
    operatorId: string,
    actor: { name: string; role: string },
    notes?: string
  ): RegistrationApplication {
    const operator = this.getOperatorById(operatorId);
    if (!operator) throw new Error('Operator not found');

    const appNumber = `TPA-REG-${new Date().getFullYear()}-${String(this.registrations.length + 1).padStart(4, '0')}`;
    const id = `reg-${Date.now()}`;

    const reg: RegistrationApplication = {
      id,
      applicationNumber: appNumber,
      operatorId,
      operatorName: operator.businessName,
      status: 'Submitted',
      submittedDate: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          fromStatus: operator.registrationStatus,
          toStatus: 'Submitted',
          actor: actor.name,
          role: actor.role,
          notes: notes || 'Formal registration application submitted to PNG TPA.'
        }
      ]
    };

    this.registrations.unshift(reg);

    // Update operator status
    this.updateOperator(operatorId, { registrationStatus: 'Submitted' }, actor);

    this.logAudit(
      actor.name,
      actor.role,
      'Registration Submitted',
      'Registration',
      reg.id,
      operator.registrationStatus,
      'Submitted',
      `Registration application ${appNumber} submitted for ${operator.businessName}`
    );

    return reg;
  }

  public updateRegistrationStatus(
    regId: string,
    newStatus: RegistrationStatus,
    actor: { name: string; role: string },
    reviewerNotes?: string
  ): RegistrationApplication | null {
    const reg = this.registrations.find(r => r.id === regId || r.operatorId === regId);
    if (!reg) return null;

    const fromStatus = reg.status;
    reg.status = newStatus;
    reg.reviewedDate = new Date().toISOString();
    reg.reviewer = actor.name;
    reg.reviewerNotes = reviewerNotes || reg.reviewerNotes;

    reg.history.push({
      timestamp: new Date().toISOString(),
      fromStatus,
      toStatus: newStatus,
      actor: actor.name,
      role: actor.role,
      notes: reviewerNotes || `Status changed from ${fromStatus} to ${newStatus}`
    });

    // Update corresponding operator
    const operator = this.getOperatorById(reg.operatorId);
    if (operator) {
      let finalOpStatus: RegistrationStatus = newStatus;
      this.updateOperator(operator.id, { registrationStatus: finalOpStatus }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      `Registration ${newStatus}`,
      'Registration',
      reg.id,
      fromStatus,
      newStatus,
      `Registration ${reg.applicationNumber} updated to ${newStatus}. Notes: ${reviewerNotes || 'None'}`
    );

    return reg;
  }

  // --- Memberships ---
  public getMemberships(): MembershipRecord[] {
    return this.memberships;
  }

  public createMembership(
    data: Partial<MembershipRecord>,
    actor: { name: string; role: string }
  ): MembershipRecord {
    const operator = this.getOperatorById(data.operatorId || '');
    if (!operator) throw new Error('Operator not found');

    const memNumber = `TPA-MEM-${new Date().getFullYear()}-${String(this.memberships.length + 1).padStart(4, '0')}`;
    const id = `mem-${Date.now()}`;

    const newMem: MembershipRecord = {
      id,
      membershipNumber: memNumber,
      operatorId: operator.id,
      operatorName: operator.businessName,
      membershipType: data.membershipType || 'Tour Operator Member',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: (data.status as MembershipStatus) || 'Active',
      feePaid: Number(data.feePaid) || 2500,
      notes: data.notes || 'Annual TPA Tourism Association Membership issued.'
    };

    this.memberships.unshift(newMem);

    if (newMem.status === 'Active') {
      this.updateOperator(operator.id, { membershipStatus: 'Active' }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      'Membership Created',
      'Membership',
      newMem.id,
      undefined,
      newMem.status,
      `Created ${newMem.membershipType} ${memNumber} for ${operator.businessName}`
    );

    return newMem;
  }

  public updateMembershipStatus(
    id: string,
    status: MembershipStatus,
    actor: { name: string; role: string },
    notes?: string
  ): MembershipRecord | null {
    const mem = this.memberships.find(m => m.id === id);
    if (!mem) return null;

    const prev = mem.status;
    mem.status = status;
    if (notes) mem.notes = `${mem.notes} | ${notes}`;

    const op = this.getOperatorById(mem.operatorId);
    if (op) {
      this.updateOperator(op.id, { membershipStatus: status }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      `Membership ${status}`,
      'Membership',
      mem.id,
      prev,
      status,
      notes || `Membership status updated to ${status}`
    );

    return mem;
  }

  // --- Licenses ---
  public getLicenses(): LicenseRecord[] {
    return this.licenses;
  }

  public createLicense(
    data: Partial<LicenseRecord>,
    actor: { name: string; role: string }
  ): LicenseRecord {
    const operator = this.getOperatorById(data.operatorId || '');
    if (!operator) throw new Error('Operator not found');

    const licNumber = `TPA-LIC-${new Date().getFullYear()}-${String(this.licenses.length + 1).padStart(4, '0')}`;
    const id = `lic-${Date.now()}`;

    const newLic: LicenseRecord = {
      id,
      licenseNumber: licNumber,
      operatorId: operator.id,
      operatorName: operator.businessName,
      licenseType: data.licenseType || 'Standard Tourism Commercial Licence',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: (data.status as LicenseStatus) || 'Active',
      conditions: data.conditions || [
        'Maintain certified public liability insurance',
        'Compliance with PNG National Tourism Safety Guidelines'
      ],
      notes: data.notes || 'Official tourism operating licence approved and granted.'
    };

    this.licenses.unshift(newLic);

    if (newLic.status === 'Active') {
      this.updateOperator(operator.id, { licenseStatus: 'Active' }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      'Licence Issued',
      'Licence',
      newLic.id,
      undefined,
      newLic.status,
      `Issued ${newLic.licenseType} ${licNumber} to ${operator.businessName}`
    );

    return newLic;
  }

  public updateLicenseStatus(
    id: string,
    status: LicenseStatus,
    actor: { name: string; role: string },
    notes?: string
  ): LicenseRecord | null {
    const lic = this.licenses.find(l => l.id === id);
    if (!lic) return null;

    const prev = lic.status;
    lic.status = status;
    if (notes) lic.notes = `${lic.notes} | ${notes}`;

    const op = this.getOperatorById(lic.operatorId);
    if (op) {
      this.updateOperator(op.id, { licenseStatus: status }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      `Licence ${status}`,
      'Licence',
      lic.id,
      prev,
      status,
      notes || `Licence status updated to ${status}`
    );

    return lic;
  }

  // --- Compliance System ---
  public getCompliance(operatorId: string): OperatorCompliance {
    if (!this.complianceRecords[operatorId]) {
      this.createDefaultCompliance(operatorId);
    }
    return this.complianceRecords[operatorId];
  }

  private createDefaultCompliance(operatorId: string): OperatorCompliance {
    const def: OperatorCompliance = {
      operatorId,
      overallStatus: 'Compliant',
      lastAssessedDate: new Date().toISOString(),
      assessorNotes: 'Statutory compliance verification record created.',
      requirements: [
        {
          id: `cr-${Date.now()}-1`,
          name: 'Investment Promotion Authority (IPA) Business Registration',
          category: 'Legal',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'IPA-CERT-VERIFIED.pdf'
        },
        {
          id: `cr-${Date.now()}-2`,
          name: 'PNG TPA Official Tourism Operating Licence',
          category: 'Legal',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'TPA-LICENCE.pdf'
        },
        {
          id: `cr-${Date.now()}-3`,
          name: 'Commercial Public Liability Insurance Coverage',
          category: 'Insurance',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'INSURANCE-POL.pdf'
        },
        {
          id: `cr-${Date.now()}-4`,
          name: 'Visitor Health, Safety & Emergency Evacuation Protocol',
          category: 'Safety',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'SAFETY-PLAN.pdf'
        },
        {
          id: `cr-${Date.now()}-5`,
          name: 'IRC National Tax Clearance Certificate',
          category: 'Financial',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'IRC-TCC.pdf'
        },
        {
          id: `cr-${Date.now()}-6`,
          name: 'Environmental Management & Cultural Heritage Care Return',
          category: 'Quality',
          status: 'Compliant',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          documentRef: 'CEPA-RETURN.pdf'
        }
      ]
    };
    this.complianceRecords[operatorId] = def;
    return def;
  }

  public updateComplianceRequirement(
    operatorId: string,
    reqId: string,
    status: 'Compliant' | 'Pending' | 'Non-Compliant' | 'Expired',
    actor: { name: string; role: string },
    notes?: string
  ): OperatorCompliance {
    const comp = this.getCompliance(operatorId);
    const req = comp.requirements.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      req.verifiedBy = actor.name;
      if (notes) req.notes = notes;
    }

    // Auto calculate overall status:
    // ALL REQUIREMENTS COMPLIANT -> COMPLIANT
    // ONE OR MORE EXPIRED / NON-COMPLIANT -> NON-COMPLIANT
    // ONE OR MORE PENDING -> CONDITIONAL
    let overall: ComplianceStatus = 'Compliant';
    const hasNonCompliantOrExpired = comp.requirements.some(r => r.status === 'Non-Compliant' || r.status === 'Expired');
    const hasPending = comp.requirements.some(r => r.status === 'Pending');

    if (hasNonCompliantOrExpired) {
      overall = 'Non-Compliant';
    } else if (hasPending) {
      overall = 'Conditional';
    } else {
      overall = 'Compliant';
    }

    comp.overallStatus = overall;
    comp.lastAssessedDate = new Date().toISOString();
    if (notes) comp.assessorNotes = notes;

    // Update operator record
    const op = this.getOperatorById(operatorId);
    if (op) {
      this.updateOperator(op.id, { complianceStatus: overall }, actor);
    }

    this.logAudit(
      actor.name,
      actor.role,
      'Compliance Updated',
      'Compliance',
      operatorId,
      undefined,
      overall,
      `Requirement "${req?.name || reqId}" set to ${status}. Overall calculated: ${overall}`
    );

    return comp;
  }

  // --- Dashboard Analytics ---
  public getDashboardAnalytics(): DashboardAnalytics {
    const totalOperators = this.operators.length;
    const pendingApplications = this.registrations.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
    const activeLicenses = this.licenses.filter(l => l.status === 'Active').length;
    const activeMemberships = this.memberships.filter(m => m.status === 'Active').length;

    const compliantCount = this.operators.filter(o => o.complianceStatus === 'Compliant').length;
    const conditionalCount = this.operators.filter(o => o.complianceStatus === 'Conditional').length;
    const nonCompliantCount = this.operators.filter(o => o.complianceStatus === 'Non-Compliant').length;
    const complianceRate = totalOperators > 0 ? Math.round((compliantCount / totalOperators) * 100) : 0;

    // Province distribution
    const provinceMap: Record<string, number> = {};
    this.operators.forEach(op => {
      provinceMap[op.province] = (provinceMap[op.province] || 0) + 1;
    });
    const operatorsByProvince = Object.entries(provinceMap).map(([province, count]) => ({ province, count }));

    // Category distribution
    const catMap: Record<string, number> = {};
    this.operators.forEach(op => {
      const cat = op.categoryName || 'General Tourism';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const operatorsByCategory = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    // Registration status distribution
    const regMap: Record<string, number> = {};
    this.operators.forEach(op => {
      regMap[op.registrationStatus] = (regMap[op.registrationStatus] || 0) + 1;
    });
    const registrationDistribution = Object.entries(regMap).map(([status, count]) => ({ status, count }));

    const recentApplications = this.registrations.slice(0, 5);
    const expiringLicenses = this.licenses.filter(l => l.status === 'Active').slice(0, 5);
    const expiringMemberships = this.memberships.filter(m => m.status === 'Active').slice(0, 5);

    return {
      totalOperators,
      pendingApplications,
      activeLicenses,
      activeMemberships,
      complianceRate,
      compliantCount,
      conditionalCount,
      nonCompliantCount,
      operatorsByProvince,
      operatorsByCategory,
      registrationDistribution,
      recentApplications,
      expiringLicenses,
      expiringMemberships
    };
  }
}

export const dbStore = new TourismDataStore();
