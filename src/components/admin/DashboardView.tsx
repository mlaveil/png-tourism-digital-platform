/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Building2,
  Clock,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ArrowRight,
  FileBadge,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DashboardAnalytics, RegistrationApplication, LicenseRecord, MembershipRecord } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface DashboardViewProps {
  analytics: DashboardAnalytics | null;
  onNavigateToRegistry: (filter?: { status?: string; compliance?: string; province?: string }) => void;
  onSelectApplication: (operatorId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  onNavigateToRegistry,
  onSelectApplication
}) => {
  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading platform dashboard analytics...
      </div>
    );
  }

  return (
    <div id="admin-dashboard-view" className="space-y-6 animate-in fade-in">
      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Registered Operators */}
        <div
          id="kpi-total-operators"
          onClick={() => onNavigateToRegistry({})}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Operators</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">{analytics.totalOperators}</span>
            <span className="text-xs font-semibold text-emerald-600">Active Node</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
            <span>View all in Registry</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 2: Pending Applications */}
        <div
          id="kpi-pending-applications"
          onClick={() => onNavigateToRegistry({ status: 'Submitted' })}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Apps</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">{analytics.pendingApplications}</span>
            <span className="text-xs font-semibold text-amber-600">Review Queue</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-600 transition-colors">
            <span>Action applications</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 3: Active Licences */}
        <div
          id="kpi-active-licenses"
          onClick={() => onNavigateToRegistry({})}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Licences</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">{analytics.activeLicenses}</span>
            <span className="text-xs font-semibold text-emerald-600">Permits Issued</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
            <span>Manage licensing</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 4: Active Memberships */}
        <div
          id="kpi-active-memberships"
          onClick={() => onNavigateToRegistry({})}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Members</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">{analytics.activeMemberships}</span>
            <span className="text-xs font-semibold text-teal-600">Industry Assocs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-teal-600 transition-colors">
            <span>Membership roster</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 5: Compliance Rate */}
        <div
          id="kpi-compliance-rate"
          onClick={() => onNavigateToRegistry({ compliance: 'Compliant' })}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileBadge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">{analytics.complianceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">Statutory Standard</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
            <span>{analytics.compliantCount} fully verified</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Grid: Provincial Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provincial Distribution (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Operators by Papua New Guinea Province</h3>
              <p className="text-xs text-slate-500">Geographical coverage across national regional hubs</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{analytics.operatorsByProvince.length} Provinces active</span>
          </div>

          {/* Bar Visualizer */}
          <div className="space-y-2.5 pt-2">
            {analytics.operatorsByProvince.map(p => {
              const max = Math.max(...analytics.operatorsByProvince.map(x => x.count), 1);
              const pct = Math.round((p.count / max) * 100);

              return (
                <div
                  key={p.province}
                  onClick={() => onNavigateToRegistry({ province: p.province })}
                  className="group cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                      {p.province}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{p.count} operators</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Breakdown Gauge */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Statutory Compliance Status</h3>
            <p className="text-xs text-slate-500">Legal, safety, and insurance standards</p>
          </div>

          <div className="space-y-3 pt-2">
            <div
              onClick={() => onNavigateToRegistry({ compliance: 'Compliant' })}
              className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Fully Compliant
                </span>
                <span className="text-sm font-extrabold text-emerald-800 font-['Outfit']">
                  {analytics.compliantCount}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">Meets all 6 regulatory criteria</p>
            </div>

            <div
              onClick={() => onNavigateToRegistry({ compliance: 'Conditional' })}
              className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:border-amber-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Conditional / Pending
                </span>
                <span className="text-sm font-extrabold text-amber-800 font-['Outfit']">
                  {analytics.conditionalCount}
                </span>
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">One or more items in audit review</p>
            </div>

            <div
              onClick={() => onNavigateToRegistry({ compliance: 'Non-Compliant' })}
              className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 cursor-pointer hover:border-rose-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Non-Compliant / Expired
                </span>
                <span className="text-sm font-extrabold text-rose-800 font-['Outfit']">
                  {analytics.nonCompliantCount}
                </span>
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5">Action notice issued by TPA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Registration Applications & Expiring Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Queue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Registration Applications</h3>
            <span className="text-xs text-slate-500 font-medium">{analytics.recentApplications.length} records</span>
          </div>

          <div className="space-y-2.5">
            {analytics.recentApplications.map(app => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app.operatorId)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{app.operatorName}</span>
                    <StatusBadge type="registration" status={app.status} size="sm" />
                  </div>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">{app.applicationNumber}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span>{new Date(app.submittedDate).toLocaleDateString()}</span>
                  <span className="block text-emerald-700 font-semibold mt-0.5">Review →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Licences & Memberships */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Licences & Memberships Schedule</h3>
            <span className="text-xs text-slate-500 font-medium">Upcoming expiries</span>
          </div>

          <div className="space-y-2.5">
            {analytics.expiringLicenses.map(lic => (
              <div
                key={lic.id}
                onClick={() => onSelectApplication(lic.operatorId)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{lic.operatorName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                      Licence
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{lic.licenseType}</p>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-slate-500">Expires:</span>
                  <span className="block font-bold text-slate-900">{lic.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
