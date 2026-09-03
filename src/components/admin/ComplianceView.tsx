/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileBadge, Search, Filter, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { TourismOperator, ComplianceStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ComplianceViewProps {
  operators: TourismOperator[];
  onSelectOperator: (operatorId: string) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  operators,
  onSelectOperator
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = operators.filter(op => {
    const matchSearch =
      op.businessName.toLowerCase().includes(search.toLowerCase()) ||
      op.province.toLowerCase().includes(search.toLowerCase()) ||
      op.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || op.complianceStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="admin-compliance-view" className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">National Tourism Compliance Assurance Matrix</h3>
          <p className="text-xs text-slate-500">
            Monitoring statutory criteria: IPA Business Registration, Licences, Public Liability, Safety & Health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search operator, province..."
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 w-48 sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Compliance ({operators.length})</option>
            <option value="Compliant">Compliant</option>
            <option value="Conditional">Conditional / Pending</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>
        </div>
      </div>

      {/* Compliance Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Operator Name</th>
              <th className="py-3.5 px-4">Province</th>
              <th className="py-3.5 px-4">IPA Status</th>
              <th className="py-3.5 px-4">Licence Status</th>
              <th className="py-3.5 px-4">Overall Standing</th>
              <th className="py-3.5 px-4 text-right">Audit & Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(op => (
              <tr
                key={op.id}
                onClick={() => onSelectOperator(op.id)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{op.businessName}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{op.id}</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-700">{op.province}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge type="license" status={op.licenseStatus} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge type="compliance" status={op.complianceStatus} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectOperator(op.id);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200"
                  >
                    Compliance Engine →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
