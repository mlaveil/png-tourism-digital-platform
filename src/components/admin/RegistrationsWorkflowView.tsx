/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, FileText, ArrowRight, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { RegistrationApplication, RegistrationStatus, DemoUser } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RegistrationsWorkflowViewProps {
  registrations: RegistrationApplication[];
  onSelectApplication: (operatorId: string) => void;
  onUpdateStatus: (regId: string, status: RegistrationStatus, notes?: string) => Promise<void>;
  currentUser: DemoUser;
}

export const RegistrationsWorkflowView: React.FC<RegistrationsWorkflowViewProps> = ({
  registrations,
  onSelectApplication,
  onUpdateStatus,
  currentUser
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReg, setSelectedReg] = useState<RegistrationApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const columns: { status: RegistrationStatus; title: string; color: string }[] = [
    { status: 'Submitted', title: 'Submitted (New)', color: 'border-blue-300 bg-blue-50/40 text-blue-900' },
    { status: 'Under Review', title: 'Under Review', color: 'border-amber-300 bg-amber-50/40 text-amber-900' },
    { status: 'Approved', title: 'Approved', color: 'border-teal-300 bg-teal-50/40 text-teal-900' },
    { status: 'Registered', title: 'Registered (Live)', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900' }
  ];

  const handleAction = async (status: RegistrationStatus) => {
    if (!selectedReg) return;
    try {
      setActionLoading(true);
      await onUpdateStatus(selectedReg.id, status, reviewNotes || `Processed as ${status}`);
      setSelectedReg(null);
      setReviewNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to update registration status');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = statusFilter === 'All'
    ? registrations
    : registrations.filter(r => r.status === statusFilter);

  return (
    <div id="admin-workflow-view" className="space-y-4 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">National Tourism Registration Workflow</h3>
          <p className="text-xs text-slate-500">
            End-to-end regulatory review pipeline from initial submission to official registry inclusion
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Review Application</span>
                <h4 className="text-base font-bold text-slate-900">{selectedReg.operatorName}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedReg.applicationNumber}</p>
              </div>
              <StatusBadge type="registration" status={selectedReg.status} size="sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Regulatory Assessment Notes:
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="Enter notes on compliance verification, safety standards, or required corrections..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 leading-relaxed font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 justify-end">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>

              {selectedReg.status === 'Submitted' && (
                <button
                  type="button"
                  onClick={() => handleAction('Under Review')}
                  disabled={actionLoading}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Start Review
                </button>
              )}

              {(selectedReg.status === 'Under Review' || selectedReg.status === 'Submitted') && (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction('Approved')}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Approve Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('Rejected')}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Reject
                  </button>
                </>
              )}

              {selectedReg.status === 'Approved' && (
                <button
                  type="button"
                  onClick={() => handleAction('Registered')}
                  disabled={actionLoading}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Finalize Registration
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const items = registrations.filter(r => r.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 space-y-3 min-h-[400px] flex flex-col"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                    <h4 className="text-xs font-bold text-slate-900">{col.title}</h4>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl">
                      No applications in this stage
                    </div>
                  ) : (
                    items.map(reg => (
                      <div
                        key={reg.id}
                        onClick={() => setSelectedReg(reg)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs cursor-pointer transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-slate-900 line-clamp-1">{reg.operatorName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{reg.applicationNumber}</p>
                        {reg.reviewerNotes && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded line-clamp-2">
                            {reg.reviewerNotes}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{new Date(reg.submittedDate).toLocaleDateString()}</span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onSelectApplication(reg.operatorId);
                            }}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Inspector →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Application No</th>
                <th className="py-3.5 px-4">Operator Name</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(reg => (
                <tr
                  key={reg.id}
                  onClick={() => setSelectedReg(reg)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{reg.applicationNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{reg.operatorName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{new Date(reg.submittedDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-slate-600">{reg.reviewer || 'Pending Assignment'}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge type="registration" status={reg.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectApplication(reg.operatorId);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
                    >
                      360° Inspector
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
