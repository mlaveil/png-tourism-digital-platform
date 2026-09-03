/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck, User } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onSelectOperator?: (operatorId: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onSelectOperator }) => {
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');

  const filtered = logs.filter(l => {
    const matchSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.notes.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase());
    const matchEntity = entityFilter === 'All' || l.entity === entityFilter;
    return matchSearch && matchEntity;
  });

  return (
    <div id="admin-audit-logs-view" className="space-y-4 animate-in fade-in">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Immutable Administrative System Audit Trail</h3>
          <p className="text-xs text-slate-500">
            Cryptographically timestamped activity logs across registration, licensing, and compliance operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actions, users, notes..."
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 w-48 sm:w-64"
          />
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Entities</option>
            <option value="Operator">Operator</option>
            <option value="Registration">Registration</option>
            <option value="License">License</option>
            <option value="Membership">Membership</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
        {filtered.map(log => (
          <div key={log.id} className="p-4 text-xs hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">{log.action}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">
                  {log.entity}: {log.entityId}
                </span>
                {log.previousStatus && log.newStatus && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {log.previousStatus} → {log.newStatus}
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{log.notes}</p>
            </div>

            <div className="text-right text-[11px] text-slate-400 shrink-0">
              <span className="block font-medium text-slate-700">{log.user} ({log.role})</span>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
