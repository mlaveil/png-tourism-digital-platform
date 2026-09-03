/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LicenseRecord, LicenseStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface LicensingViewProps {
  licenses: LicenseRecord[];
  onSelectOperator: (operatorId: string) => void;
  onUpdateLicenseStatus: (id: string, status: LicenseStatus) => Promise<void>;
}

export const LicensingView: React.FC<LicensingViewProps> = ({
  licenses,
  onSelectOperator,
  onUpdateLicenseStatus
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = licenses.filter(lic => {
    const matchSearch =
      lic.operatorName.toLowerCase().includes(search.toLowerCase()) ||
      lic.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      lic.licenseType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || lic.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="admin-licensing-view" className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">National Tourism Licensing Register</h3>
          <p className="text-xs text-slate-500">
            Statutory operating licences issued under the Papua New Guinea Tourism Authority Act
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search licences, operators..."
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 w-48 sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Licences Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Licence Number</th>
              <th className="py-3.5 px-4">Operator Name</th>
              <th className="py-3.5 px-4">Licence Type</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Expiry Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(lic => (
              <tr
                key={lic.id}
                onClick={() => onSelectOperator(lic.operatorId)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{lic.licenseNumber}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{lic.operatorName}</td>
                <td className="py-3.5 px-4 text-slate-700">{lic.licenseType}</td>
                <td className="py-3.5 px-4 text-slate-500">{lic.issueDate}</td>
                <td className="py-3.5 px-4 text-slate-900 font-medium">{lic.expiryDate}</td>
                <td className="py-3.5 px-4">
                  <StatusBadge type="license" status={lic.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectOperator(lic.operatorId);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
                  >
                    Manage
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
