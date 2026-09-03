/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Search, Plus, Filter, CheckCircle2 } from 'lucide-react';
import { MembershipRecord, MembershipStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface MembershipsViewProps {
  memberships: MembershipRecord[];
  onSelectOperator: (operatorId: string) => void;
  onUpdateMembershipStatus: (id: string, status: MembershipStatus) => Promise<void>;
}

export const MembershipsView: React.FC<MembershipsViewProps> = ({
  memberships,
  onSelectOperator,
  onUpdateMembershipStatus
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = memberships.filter(mem => {
    const matchSearch =
      mem.operatorName.toLowerCase().includes(search.toLowerCase()) ||
      mem.membershipNumber.toLowerCase().includes(search.toLowerCase()) ||
      mem.membershipType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || mem.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="admin-memberships-view" className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">TPA Tourism Industry Membership Roster</h3>
          <p className="text-xs text-slate-500">
            Active industry associations, operator affiliations, and annual subscription records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search memberships, operators..."
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 w-48 sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Memberships Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Membership Number</th>
              <th className="py-3.5 px-4">Operator Name</th>
              <th className="py-3.5 px-4">Membership Category</th>
              <th className="py-3.5 px-4">Annual Fee</th>
              <th className="py-3.5 px-4">Expiry Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(mem => (
              <tr
                key={mem.id}
                onClick={() => onSelectOperator(mem.operatorId)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{mem.membershipNumber}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{mem.operatorName}</td>
                <td className="py-3.5 px-4 text-slate-700">{mem.membershipType}</td>
                <td className="py-3.5 px-4 text-emerald-800 font-semibold">PGK {mem.feePaid.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-slate-900 font-medium">{mem.expiryDate}</td>
                <td className="py-3.5 px-4">
                  <StatusBadge type="membership" status={mem.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectOperator(mem.operatorId);
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
