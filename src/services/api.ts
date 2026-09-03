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
  AuditLog,
  NotificationItem,
  DashboardAnalytics,
  Province,
  TourismCategory,
  DemoUser,
  RegistrationStatus,
  MembershipStatus,
  LicenseStatus
} from '../types';

let currentUser: DemoUser = {
  id: 'user-admin-1',
  name: 'Markus Kaumu',
  role: 'admin',
  title: 'Director of Policy & Licensing',
  department: 'PNG Tourism Promotion Authority (PNG TPA)',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export const setCurrentUser = (user: DemoUser) => {
  currentUser = user;
};

export const getCurrentUser = (): DemoUser => {
  return currentUser;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-user-name': currentUser.name,
  'x-user-role': currentUser.role
});

export const api = {
  setCurrentUser(name: string, role: string) {
    currentUser = {
      ...currentUser,
      name,
      role: role as any
    };
  },

  // Operators
  async getOperators(filters?: {
    search?: string;
    province?: string;
    category?: string;
    status?: string;
    compliance?: string;
  }): Promise<TourismOperator[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.province) params.append('province', filters.province);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.compliance) params.append('compliance', filters.compliance);

    const res = await fetch(`/api/operators?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load operators');
    return res.json();
  },

  async getOperatorById(id: string): Promise<TourismOperator> {
    const res = await fetch(`/api/operators/${id}`);
    if (!res.ok) throw new Error('Failed to load operator');
    return res.json();
  },

  async createOperator(data: Partial<TourismOperator>): Promise<TourismOperator> {
    const res = await fetch('/api/operators', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create operator');
    }
    return res.json();
  },

  async updateOperator(id: string, data: Partial<TourismOperator>): Promise<TourismOperator> {
    const res = await fetch(`/api/operators/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update operator');
    }
    return res.json();
  },

  // Public Operators
  async getPublicOperators(filters?: { search?: string; province?: string; category?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.province) params.append('province', filters.province);
    if (filters?.category) params.append('category', filters.category);

    const res = await fetch(`/api/public/operators?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load public directory');
    return res.json();
  },

  async getPublicOperatorById(id: string): Promise<any> {
    const res = await fetch(`/api/public/operators/${id}`);
    if (!res.ok) throw new Error('Failed to load public operator profile');
    return res.json();
  },

  // Registrations Workflow
  async getRegistrations(): Promise<RegistrationApplication[]> {
    const res = await fetch('/api/registrations');
    if (!res.ok) throw new Error('Failed to load registrations');
    return res.json();
  },

  async createRegistration(operatorId: string, notes?: string): Promise<RegistrationApplication> {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ operatorId, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create registration application');
    }
    return res.json();
  },

  async updateRegistrationStatus(id: string, status: RegistrationStatus, notes?: string): Promise<RegistrationApplication> {
    const res = await fetch(`/api/registrations/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update registration status');
    }
    return res.json();
  },

  // Memberships
  async getMemberships(): Promise<MembershipRecord[]> {
    const res = await fetch('/api/memberships');
    if (!res.ok) throw new Error('Failed to load memberships');
    return res.json();
  },

  async createMembership(data: Partial<MembershipRecord>): Promise<MembershipRecord> {
    const res = await fetch('/api/memberships', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create membership');
    }
    return res.json();
  },

  async updateMembershipStatus(id: string, status: MembershipStatus, notes?: string): Promise<MembershipRecord> {
    const res = await fetch(`/api/memberships/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update membership status');
    return res.json();
  },

  // Licenses
  async getLicenses(): Promise<LicenseRecord[]> {
    const res = await fetch('/api/licenses');
    if (!res.ok) throw new Error('Failed to load licenses');
    return res.json();
  },

  async createLicense(data: Partial<LicenseRecord>): Promise<LicenseRecord> {
    const res = await fetch('/api/licenses', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to issue licence');
    }
    return res.json();
  },

  async updateLicenseStatus(id: string, status: LicenseStatus, notes?: string): Promise<LicenseRecord> {
    const res = await fetch(`/api/licenses/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update licence status');
    return res.json();
  },

  // Compliance
  async getCompliance(operatorId: string): Promise<OperatorCompliance> {
    const res = await fetch(`/api/compliance/${operatorId}`);
    if (!res.ok) throw new Error('Failed to load compliance details');
    return res.json();
  },

  async updateComplianceRequirement(
    operatorId: string,
    requirementId: string,
    status: 'Compliant' | 'Pending' | 'Non-Compliant' | 'Expired',
    notes?: string
  ): Promise<OperatorCompliance> {
    const res = await fetch(`/api/compliance/${operatorId}/requirement`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ requirementId, status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update compliance requirement');
    }
    return res.json();
  },

  // Metadata
  async getProvinces(): Promise<Province[]> {
    const res = await fetch('/api/provinces');
    if (!res.ok) throw new Error('Failed to load provinces');
    return res.json();
  },

  async getCategories(): Promise<TourismCategory[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  // Analytics & Audit
  async getDashboard(): Promise<DashboardAnalytics> {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  },

  async getNotifications(role?: string, operatorId?: string): Promise<NotificationItem[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (operatorId) params.append('operatorId', operatorId);
    const res = await fetch(`/api/notifications?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  async resetSeed(): Promise<void> {
    const res = await fetch('/api/seed/reset', {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset seed');
  }
};
