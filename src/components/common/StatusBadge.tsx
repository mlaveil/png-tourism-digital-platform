/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RegistrationStatus, MembershipStatus, LicenseStatus, ComplianceStatus } from '../../types';

interface StatusBadgeProps {
  type: 'registration' | 'membership' | 'license' | 'compliance';
  status: RegistrationStatus | MembershipStatus | LicenseStatus | ComplianceStatus | string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, size = 'sm', id }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (type === 'registration') {
    switch (status) {
      case 'Registered':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        dotColor = 'bg-emerald-500';
        break;
      case 'Approved':
        colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
        dotColor = 'bg-teal-500';
        break;
      case 'Under Review':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        dotColor = 'bg-amber-500';
        break;
      case 'Submitted':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        dotColor = 'bg-blue-500';
        break;
      case 'Draft':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
        dotColor = 'bg-slate-400';
        break;
      case 'Rejected':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        dotColor = 'bg-rose-500';
        break;
    }
  } else if (type === 'membership' || type === 'license') {
    switch (status) {
      case 'Active':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        dotColor = 'bg-emerald-500';
        break;
      case 'Pending':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        dotColor = 'bg-amber-500';
        break;
      case 'Expired':
        colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
        dotColor = 'bg-orange-500';
        break;
      case 'Suspended':
      case 'Cancelled':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        dotColor = 'bg-rose-500';
        break;
      case 'None':
      default:
        colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
        dotColor = 'bg-slate-400';
        break;
    }
  } else if (type === 'compliance') {
    switch (status) {
      case 'Compliant':
        colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
        dotColor = 'bg-emerald-600';
        break;
      case 'Conditional':
        colorClasses = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
        dotColor = 'bg-amber-600';
        break;
      case 'Non-Compliant':
      case 'Expired':
        colorClasses = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
        dotColor = 'bg-rose-600';
        break;
      default:
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
        dotColor = 'bg-slate-400';
        break;
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size];

  return (
    <span
      id={id || `status-badge-${type}-${status.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses} whitespace-nowrap transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
