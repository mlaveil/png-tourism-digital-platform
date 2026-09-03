/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Clock,
  ShieldCheck,
  Award,
  FileBadge,
  History,
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import {
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  AuditLog,
  DashboardAnalytics,
  Province,
  TourismCategory,
  DemoUser
} from '../../types';
import { DashboardView } from './DashboardView';
import { RegistryView } from './RegistryView';
import { RegistrationsWorkflowView } from './RegistrationsWorkflowView';
import { LicensingView } from './LicensingView';
import { MembershipsView } from './MembershipsView';
import { ComplianceView } from './ComplianceView';
import { AuditLogsView } from './AuditLogsView';
import { ReportsExtractView } from './ReportsExtractView';

interface AdminLayoutProps {
  operators: TourismOperator[];
  registrations: RegistrationApplication[];
  memberships: MembershipRecord[];
  licenses: LicenseRecord[];
  auditLogs: AuditLog[];
  analytics: DashboardAnalytics | null;
  provinces: Province[];
  categories: TourismCategory[];
  currentUser: DemoUser;
  onSelectOperator: (operator: TourismOperator) => void;
  onSelectOperatorById: (id: string) => void;
  onOpenCreateOperator: () => void;
  onUpdateRegistrationStatus: (regId: string, status: any, notes?: string) => Promise<void>;
  onUpdateLicenseStatus: (id: string, status: any) => Promise<void>;
  onUpdateMembershipStatus: (id: string, status: any) => Promise<void>;
  loading: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  operators,
  registrations,
  memberships,
  licenses,
  auditLogs,
  analytics,
  provinces,
  categories,
  currentUser,
  onSelectOperator,
  onSelectOperatorById,
  onOpenCreateOperator,
  onUpdateRegistrationStatus,
  onUpdateLicenseStatus,
  onUpdateMembershipStatus,
  loading
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'registry' | 'workflow' | 'licensing' | 'membership' | 'compliance' | 'reports' | 'audit'>('dashboard');

  const [registryFilters, setRegistryFilters] = useState({
    search: '',
    province: 'All',
    category: 'All',
    status: 'All',
    compliance: 'All'
  });

  const handleFilterChange = (key: string, value: string) => {
    setRegistryFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigateFromDashboard = (filter?: { status?: string; compliance?: string; province?: string }) => {
    if (filter) {
      setRegistryFilters(prev => ({
        ...prev,
        status: filter.status || 'All',
        compliance: filter.compliance || 'All',
        province: filter.province || 'All'
      }));
    }
    setAdminTab('registry');
  };

  // Filtered operators for registry
  const filteredOperators = operators.filter(op => {
    const s = registryFilters.search.toLowerCase();
    const matchesSearch =
      !s ||
      op.businessName.toLowerCase().includes(s) ||
      op.tradingName.toLowerCase().includes(s) ||
      op.id.toLowerCase().includes(s) ||
      op.province.toLowerCase().includes(s) ||
      op.contactPerson.toLowerCase().includes(s);

    const matchesProvince = registryFilters.province === 'All' || op.province === registryFilters.province;
    const matchesCategory = registryFilters.category === 'All' || op.categoryId === registryFilters.category;
    const matchesStatus = registryFilters.status === 'All' || op.registrationStatus === registryFilters.status;
    const matchesCompliance = registryFilters.compliance === 'All' || op.complianceStatus === registryFilters.compliance;

    return matchesSearch && matchesProvince && matchesCategory && matchesStatus && matchesCompliance;
  });

  const tabs = [
    { id: 'dashboard', label: 'Platform Analytics', icon: LayoutDashboard, badge: null },
    { id: 'registry', label: 'National Registry', icon: Building2, badge: operators.length },
    { id: 'workflow', label: 'Applications Queue', icon: Clock, badge: registrations.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length },
    { id: 'licensing', label: 'Licence Register', icon: ShieldCheck, badge: licenses.length },
    { id: 'membership', label: 'Memberships', icon: Award, badge: memberships.length },
    { id: 'compliance', label: 'Compliance Assurance', icon: FileBadge, badge: null },
    { id: 'reports', label: 'Data Extracts & Reports', icon: FileSpreadsheet, badge: null },
    { id: 'audit', label: 'Audit Trail', icon: History, badge: null }
  ];

  return (
    <div id="admin-portal-layout" className="space-y-6">
      {/* Sub Header / Admin Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TPA Regulatory Administration Portal</h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
              STAFF & ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Papua New Guinea Tourism Promotion Authority • National Tourism Digital Platform Central Node
          </p>
        </div>

        <button
          id="btn-admin-add-operator"
          onClick={onOpenCreateOperator}
          className="px-4 py-2 text-xs font-semibold bg-[#00472F] hover:bg-[#003624] text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D9A100]" />
          <span>New Operator Registration</span>
        </button>
      </div>

      {/* Admin Sub Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-semibold no-scrollbar">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = adminTab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-admin-${t.id}`}
              onClick={() => setAdminTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#00472F] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A100]' : ''}`} />
              <span>{t.label}</span>
              {t.badge !== null && t.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#D9A100] text-[#003624]' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Tab Content */}
      <div className="min-h-[500px]">
        {adminTab === 'dashboard' && (
          <DashboardView
            analytics={analytics}
            onNavigateToRegistry={handleNavigateFromDashboard}
            onSelectApplication={onSelectOperatorById}
          />
        )}

        {adminTab === 'registry' && (
          <RegistryView
            operators={filteredOperators}
            provinces={provinces}
            categories={categories}
            filters={registryFilters}
            onFilterChange={handleFilterChange}
            onSelectOperator={onSelectOperator}
            onOpenCreateModal={onOpenCreateOperator}
            loading={loading}
          />
        )}

        {adminTab === 'workflow' && (
          <RegistrationsWorkflowView
            registrations={registrations}
            onSelectApplication={onSelectOperatorById}
            onUpdateStatus={onUpdateRegistrationStatus}
            currentUser={currentUser}
          />
        )}

        {adminTab === 'licensing' && (
          <LicensingView
            licenses={licenses}
            onSelectOperator={onSelectOperatorById}
            onUpdateLicenseStatus={onUpdateLicenseStatus}
          />
        )}

        {adminTab === 'membership' && (
          <MembershipsView
            memberships={memberships}
            onSelectOperator={onSelectOperatorById}
            onUpdateMembershipStatus={onUpdateMembershipStatus}
          />
        )}

        {adminTab === 'compliance' && (
          <ComplianceView
            operators={operators}
            onSelectOperator={onSelectOperatorById}
          />
        )}

        {adminTab === 'reports' && (
          <ReportsExtractView
            operators={operators}
            registrations={registrations}
            licenses={licenses}
            memberships={memberships}
            auditLogs={auditLogs}
            provinces={provinces}
            categories={categories}
            analytics={analytics}
          />
        )}

        {adminTab === 'audit' && (
          <AuditLogsView
            logs={auditLogs}
            onSelectOperator={onSelectOperatorById}
          />
        )}
      </div>
    </div>
  );
};
