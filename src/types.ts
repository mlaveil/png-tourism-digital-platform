/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff' | 'operator' | 'public';

export type RegistrationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Registered'
  | 'Rejected';

export type MembershipStatus = 'None' | 'Pending' | 'Active' | 'Expired' | 'Suspended';

export type LicenseStatus = 'None' | 'Pending' | 'Active' | 'Expired' | 'Suspended' | 'Cancelled';

export type ComplianceStatus = 'Compliant' | 'Conditional' | 'Non-Compliant';

export type RequirementStatus = 'Compliant' | 'Pending' | 'Non-Compliant' | 'Expired';

export interface Province {
  id: string;
  name: string;
  region: 'Momase' | 'Highlands' | 'Southern' | 'Islands';
  capital: string;
  description: string;
  heroImage: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatorCount?: number;
}

export interface TourismCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  badgeColor: string;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  category: 'Legal' | 'Safety' | 'Insurance' | 'Quality' | 'Financial';
  status: RequirementStatus;
  issueDate?: string;
  expiryDate?: string;
  documentRef?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface OperatorCompliance {
  operatorId: string;
  overallStatus: ComplianceStatus;
  lastAssessedDate: string;
  assessorNotes: string;
  requirements: ComplianceRequirement[];
}

export interface MembershipRecord {
  id: string;
  membershipNumber: string;
  operatorId: string;
  operatorName: string;
  membershipType:
    | 'Corporate Member'
    | 'Associate Member'
    | 'Tour Operator Member'
    | 'Accommodation Provider'
    | 'Dive & Marine Specialist'
    | 'Eco & Cultural Affiliate';
  startDate: string;
  expiryDate: string;
  status: MembershipStatus;
  feePaid: number;
  notes: string;
}

export interface LicenseRecord {
  id: string;
  licenseNumber: string;
  operatorId: string;
  operatorName: string;
  licenseType:
    | 'Standard Tourism Commercial Licence'
    | 'Trekking & Wilderness Guide Licence'
    | 'Marine & Scuba Charter Licence'
    | 'Hospitality & Guest House Licence'
    | 'Cultural Experience & Festival Guide Licence'
    | 'Transport & Tour Vehicle Licence';
  issueDate: string;
  expiryDate: string;
  status: LicenseStatus;
  conditions: string[];
  notes: string;
}

export interface RegistrationAuditEvent {
  timestamp: string;
  fromStatus: RegistrationStatus;
  toStatus: RegistrationStatus;
  actor: string;
  role: string;
  notes: string;
}

export interface RegistrationApplication {
  id: string;
  applicationNumber: string;
  operatorId: string;
  operatorName: string;
  status: RegistrationStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewer?: string;
  reviewerNotes?: string;
  history: RegistrationAuditEvent[];
}

export interface TourismOperator {
  id: string;
  businessName: string;
  tradingName: string;
  operatorType: string;
  categoryId: string;
  categoryName?: string;
  province: string;
  district: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  latitude: number;
  longitude: number;
  registrationStatus: RegistrationStatus;
  membershipStatus: MembershipStatus;
  licenseStatus: LicenseStatus;
  complianceStatus: ComplianceStatus;
  heroImage: string;
  galleryImages?: string[];
  features?: string[];
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: 'Operator' | 'Registration' | 'Membership' | 'Licence' | 'Compliance' | 'System';
  entityId: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'workflow' | 'licensing' | 'compliance' | 'system';
  targetRole?: UserRole;
  operatorId?: string;
}

export interface DashboardAnalytics {
  totalOperators: number;
  pendingApplications: number;
  activeLicenses: number;
  activeMemberships: number;
  complianceRate: number;
  compliantCount: number;
  conditionalCount: number;
  nonCompliantCount: number;
  operatorsByProvince: { province: string; count: number }[];
  operatorsByCategory: { category: string; count: number }[];
  registrationDistribution: { status: string; count: number }[];
  recentApplications: RegistrationApplication[];
  expiringLicenses: LicenseRecord[];
  expiringMemberships: MembershipRecord[];
}

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  operatorId?: string;
}
