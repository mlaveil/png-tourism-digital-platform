/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  ShieldCheck,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  RefreshCw,
  Eye,
  Calendar,
  AlertTriangle,
  History,
  FileBadge,
  Check
} from 'lucide-react';
import {
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  OperatorCompliance,
  AuditLog,
  RegistrationStatus,
  MembershipStatus,
  LicenseStatus,
  DemoUser
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { api } from '../../services/api';

interface OperatorDetailModalProps {
  operatorId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUser: DemoUser;
  onOperatorUpdated: () => void;
}

export const OperatorDetailModal: React.FC<OperatorDetailModalProps> = ({
  operatorId,
  isOpen,
  onClose,
  currentUser,
  onOperatorUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'licensing' | 'membership' | 'compliance' | 'audit'>('overview');
  const [operator, setOperator] = useState<TourismOperator | null>(null);
  const [registration, setRegistration] = useState<RegistrationApplication | null>(null);
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [compliance, setCompliance] = useState<OperatorCompliance | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Membership / License modal sub-states
  const [showAddMem, setShowAddMem] = useState(false);
  const [showAddLic, setShowAddLic] = useState(false);

  const [newMemType, setNewMemType] = useState<any>('Tour Operator Member');
  const [newLicType, setNewLicType] = useState<any>('Standard Tourism Commercial Licence');

  const isStaffOrAdmin = currentUser.role === 'admin' || currentUser.role === 'staff';
  const isAdmin = currentUser.role === 'admin';

  const loadData = async () => {
    try {
      setLoading(true);
      const [op, allRegs, allMems, allLics, comp, allLogs] = await Promise.all([
        api.getOperatorById(operatorId),
        api.getRegistrations(),
        api.getMemberships(),
        api.getLicenses(),
        api.getCompliance(operatorId),
        api.getAuditLogs()
      ]);

      setOperator(op);
      const reg = allRegs.find(r => r.operatorId === operatorId);
      setRegistration(reg || null);
      setMemberships(allMems.filter(m => m.operatorId === operatorId));
      setLicenses(allLics.filter(l => l.operatorId === operatorId));
      setCompliance(comp);
      setAuditLogs(allLogs.filter(l => l.entityId === operatorId || (reg && l.entityId === reg.id)));
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to load details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && operatorId) {
      loadData();
    }
  }, [isOpen, operatorId]);

  if (!isOpen) return null;

  // --- Workflow Actions ---
  const handleSubmitRegistration = async () => {
    try {
      setActionLoading(true);
      await api.createRegistration(operatorId, actionNotes || 'Application submitted for registration.');
      setActionNotes('');
      setMessage({ text: 'Registration application submitted successfully!', type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRegistrationStatus = async (status: RegistrationStatus) => {
    if (!registration) return;
    try {
      setActionLoading(true);
      await api.updateRegistrationStatus(registration.id, status, actionNotes);
      setActionNotes('');
      setMessage({ text: `Registration status updated to ${status}!`, type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Membership Actions ---
  const handleCreateMembership = async () => {
    try {
      setActionLoading(true);
      await api.createMembership({
        operatorId,
        membershipType: newMemType,
        status: 'Active',
        feePaid: 2500,
        notes: actionNotes || 'Membership issued by TPA Licensing Division.'
      });
      setShowAddMem(false);
      setActionNotes('');
      setMessage({ text: 'Active membership established!', type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMembershipStatus = async (id: string, status: MembershipStatus) => {
    try {
      setActionLoading(true);
      await api.updateMembershipStatus(id, status, actionNotes || `Status set to ${status}`);
      setMessage({ text: `Membership status updated to ${status}!`, type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Licensing Actions ---
  const handleCreateLicense = async () => {
    try {
      setActionLoading(true);
      await api.createLicense({
        operatorId,
        licenseType: newLicType,
        status: 'Active',
        notes: actionNotes || 'Licence issued under PNG Tourism Authority Act.'
      });
      setShowAddLic(false);
      setActionNotes('');
      setMessage({ text: 'Active Tourism Operating Licence issued!', type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLicenseStatus = async (id: string, status: LicenseStatus) => {
    try {
      setActionLoading(true);
      await api.updateLicenseStatus(id, status, actionNotes || `Status set to ${status}`);
      setMessage({ text: `Licence status updated to ${status}!`, type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Compliance Action ---
  const handleToggleRequirementStatus = async (
    reqId: string,
    newStatus: 'Compliant' | 'Pending' | 'Non-Compliant' | 'Expired'
  ) => {
    try {
      setActionLoading(true);
      const updated = await api.updateComplianceRequirement(
        operatorId,
        reqId,
        newStatus,
        `Assessed by ${currentUser.name} (${currentUser.role})`
      );
      setCompliance(updated);
      setMessage({ text: `Compliance requirement updated! Overall status: ${updated.overallStatus}`, type: 'success' });
      await loadData();
      onOperatorUpdated();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div id="operator-detail-modal" className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={operator?.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'}
              alt={operator?.businessName}
              className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">{operator?.businessName}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {operator?.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Trading as: <span className="text-slate-200">{operator?.tradingName}</span> • 📍 {operator?.district}, {operator?.province}
              </p>

              {/* Status Badges Header Row */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <StatusBadge type="registration" status={operator?.registrationStatus || 'Draft'} size="sm" />
                <StatusBadge type="membership" status={operator?.membershipStatus || 'None'} size="sm" />
                <StatusBadge type="license" status={operator?.licenseStatus || 'None'} size="sm" />
                <StatusBadge type="compliance" status={operator?.complianceStatus || 'Conditional'} size="sm" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-operator-modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: '360° Overview', icon: Building2 },
            { id: 'workflow', label: 'Registration Workflow', icon: Clock },
            { id: 'licensing', label: 'Licences', icon: ShieldCheck },
            { id: 'membership', label: 'Memberships', icon: Award },
            { id: 'compliance', label: 'Compliance Engine', icon: FileBadge },
            { id: 'audit', label: 'Audit Trail', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-op-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMessage(null);
                }}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-900 bg-white font-bold shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification / Feedback Banner */}
        {message && (
          <div
            className={`p-3 text-xs font-medium flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading registry records...</span>
            </div>
          ) : !operator ? (
            <div className="p-8 text-center text-rose-600 text-xs font-medium">
              Operator record not found.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Category & Type
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{operator.categoryName}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{operator.operatorType}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Location (GIS Coordinates)
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{operator.province}</p>
                      <p className="text-xs text-slate-600 font-mono mt-0.5">
                        {operator.latitude.toFixed(4)}, {operator.longitude.toFixed(4)}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Contact Person
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{operator.contactPerson}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{operator.phone}</p>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Business Details & Public Listing Summary
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{operator.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 font-medium">Physical Address:</span>
                        <p className="text-slate-900 font-semibold mt-0.5">{operator.address}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Official Email:</span>
                        <p className="text-slate-900 font-semibold mt-0.5">{operator.email}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Official Website:</span>
                        <p className="text-emerald-700 font-semibold mt-0.5">
                          <a href={operator.website} target="_blank" rel="noreferrer" className="underline">
                            {operator.website || 'N/A'}
                          </a>
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Price Range:</span>
                        <p className="text-slate-900 font-semibold mt-0.5">{operator.priceRange || 'N/A'}</p>
                      </div>
                    </div>

                    {operator.features && (
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium block mb-2">
                          Verified Facilities & Capabilities:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {operator.features.map((f, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: REGISTRATION WORKFLOW */}
              {activeTab === 'workflow' && (
                <div className="space-y-6">
                  {/* Workflow Stepper Status */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Current Registration Status
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge type="registration" status={operator.registrationStatus} size="lg" />
                          {registration && (
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              Application No: {registration.applicationNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {registration?.submittedDate && (
                        <div className="text-right text-xs text-slate-500">
                          <span>Submitted: {new Date(registration.submittedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Step Visualizer */}
                    <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[11px] font-semibold">
                      {['Draft', 'Submitted', 'Under Review', 'Approved', 'Registered'].map((stepName, i) => {
                        const statuses = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Registered'];
                        const currentIdx = statuses.indexOf(operator.registrationStatus);
                        const isDone = currentIdx >= i;
                        const isCurrent = operator.registrationStatus === stepName;

                        return (
                          <div key={stepName} className="flex flex-col items-center gap-1.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : i + 1}
                            </div>
                            <span className={isCurrent ? 'text-emerald-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}>
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Box for TPA Staff / Admin */}
                  <div className="p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Registration Action Controller
                    </h4>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Staff / Reviewer Audit Notes:
                      </label>
                      <input
                        id="input-workflow-notes"
                        type="text"
                        value={actionNotes}
                        onChange={e => setActionNotes(e.target.value)}
                        placeholder="Enter regulatory assessment, verification comments, or inspection references..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {operator.registrationStatus === 'Draft' && (
                        <button
                          id="btn-action-submit-reg"
                          onClick={handleSubmitRegistration}
                          disabled={actionLoading}
                          className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submit Application to TPA</span>
                        </button>
                      )}

                      {operator.registrationStatus === 'Submitted' && (
                        <button
                          id="btn-action-start-review"
                          onClick={() => handleUpdateRegistrationStatus('Under Review')}
                          disabled={actionLoading || !isStaffOrAdmin}
                          className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Mark as Under Review</span>
                        </button>
                      )}

                      {(operator.registrationStatus === 'Under Review' || operator.registrationStatus === 'Submitted') && (
                        <>
                          <button
                            id="btn-action-approve-reg"
                            onClick={() => handleUpdateRegistrationStatus('Approved')}
                            disabled={actionLoading || !isAdmin}
                            className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                            title={!isAdmin ? 'Requires TPA Administrator role' : ''}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Application</span>
                          </button>

                          <button
                            id="btn-action-reject-reg"
                            onClick={() => handleUpdateRegistrationStatus('Rejected')}
                            disabled={actionLoading || !isAdmin}
                            className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Application</span>
                          </button>
                        </>
                      )}

                      {operator.registrationStatus === 'Approved' && (
                        <button
                          id="btn-action-complete-registered"
                          onClick={() => handleUpdateRegistrationStatus('Registered')}
                          disabled={actionLoading || !isStaffOrAdmin}
                          className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Finalize & Enrol in National Registry</span>
                        </button>
                      )}

                      {operator.registrationStatus === 'Registered' && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Operator is fully Registered & active in National Tourism Registry.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Application Audit History */}
                  {registration?.history && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Workflow Transition Audit History
                      </h4>
                      <div className="space-y-2">
                        {registration.history.map((h, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 font-semibold text-slate-900">
                                <span>{h.fromStatus} → {h.toStatus}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                                  {h.role}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1">{h.notes}</p>
                            </div>
                            <div className="text-right text-[11px] text-slate-400">
                              <span>{new Date(h.timestamp).toLocaleString()}</span>
                              <span className="block font-medium text-slate-500">{h.actor}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LICENSING */}
              {activeTab === 'licensing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Official Tourism Commercial Licences</h4>
                      <p className="text-xs text-slate-500">Statutory operating permits issued by PNG TPA</p>
                    </div>
                    {isStaffOrAdmin && (
                      <button
                        id="btn-open-issue-lic-modal"
                        onClick={() => setShowAddLic(true)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Issue New Licence</span>
                      </button>
                    )}
                  </div>

                  {showAddLic && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
                      <h5 className="text-xs font-bold text-emerald-950">Issue Official Tourism Licence</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Licence Type</label>
                          <select
                            value={newLicType}
                            onChange={e => setNewLicType(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Standard Tourism Commercial Licence">Standard Tourism Commercial Licence</option>
                            <option value="Trekking & Wilderness Guide Licence">Trekking & Wilderness Guide Licence</option>
                            <option value="Marine & Scuba Charter Licence">Marine & Scuba Charter Licence</option>
                            <option value="Hospitality & Guest House Licence">Hospitality & Guest House Licence</option>
                            <option value="Transport & Tour Vehicle Licence">Transport & Tour Vehicle Licence</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Licence Notes</label>
                          <input
                            type="text"
                            value={actionNotes}
                            onChange={e => setActionNotes(e.target.value)}
                            placeholder="e.g. Endorsed for Central & Kokoda guides"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddLic(false)}
                          className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          id="btn-confirm-issue-lic"
                          type="button"
                          onClick={handleCreateLicense}
                          disabled={actionLoading}
                          className="px-4 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                        >
                          {actionLoading ? 'Issuing...' : 'Confirm & Issue Licence'}
                        </button>
                      </div>
                    </div>
                  )}

                  {licenses.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
                      No operating licences currently recorded for this operator.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {licenses.map(lic => (
                        <div
                          key={lic.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-xs">{lic.licenseType}</h5>
                                <StatusBadge type="license" status={lic.status} size="sm" />
                              </div>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">Licence No: {lic.licenseNumber}</p>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              <span>Expires: <strong>{lic.expiryDate}</strong></span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600">{lic.notes}</p>

                          {lic.conditions && lic.conditions.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                              <span className="font-semibold text-slate-700 block text-[11px]">Licence Conditions:</span>
                              {lic.conditions.map((c, i) => (
                                <p key={i} className="text-slate-600 text-[11px] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                                  {c}
                                </p>
                              ))}
                            </div>
                          )}

                          {isStaffOrAdmin && (
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                              {lic.status !== 'Active' ? (
                                <button
                                  onClick={() => handleUpdateLicenseStatus(lic.id, 'Active')}
                                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                                >
                                  Activate / Renew
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleUpdateLicenseStatus(lic.id, 'Suspended')}
                                    className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md"
                                  >
                                    Suspend Licence
                                  </button>
                                  <button
                                    onClick={() => handleUpdateLicenseStatus(lic.id, 'Cancelled')}
                                    className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md"
                                  >
                                    Cancel Licence
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MEMBERSHIP */}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">TPA Tourism Industry Membership</h4>
                      <p className="text-xs text-slate-500">Official Association membership credentials</p>
                    </div>
                    {isStaffOrAdmin && (
                      <button
                        id="btn-open-create-mem-modal"
                        onClick={() => setShowAddMem(true)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Membership</span>
                      </button>
                    )}
                  </div>

                  {showAddMem && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
                      <h5 className="text-xs font-bold text-emerald-950">Issue New Membership Record</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Membership Category</label>
                          <select
                            value={newMemType}
                            onChange={e => setNewMemType(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Tour Operator Member">Tour Operator Member</option>
                            <option value="Corporate Member">Corporate Member</option>
                            <option value="Associate Member">Associate Member</option>
                            <option value="Accommodation Provider">Accommodation Provider</option>
                            <option value="Dive & Marine Specialist">Dive & Marine Specialist</option>
                            <option value="Eco & Cultural Affiliate">Eco & Cultural Affiliate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                          <input
                            type="text"
                            value={actionNotes}
                            onChange={e => setActionNotes(e.target.value)}
                            placeholder="e.g. Annual TPA Tour Operator Association"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddMem(false)}
                          className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          id="btn-confirm-create-mem"
                          type="button"
                          onClick={handleCreateMembership}
                          disabled={actionLoading}
                          className="px-4 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
                        >
                          {actionLoading ? 'Creating...' : 'Confirm Membership'}
                        </button>
                      </div>
                    </div>
                  )}

                  {memberships.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
                      No membership records found for this operator.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {memberships.map(mem => (
                        <div
                          key={mem.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-xs">{mem.membershipType}</h5>
                                <StatusBadge type="membership" status={mem.status} size="sm" />
                              </div>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">Mem No: {mem.membershipNumber}</p>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              <span>Fee: <strong>PGK {mem.feePaid.toLocaleString()}</strong></span>
                              <span className="block text-[11px]">Valid to: {mem.expiryDate}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600">{mem.notes}</p>

                          {isStaffOrAdmin && (
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                              {mem.status !== 'Active' ? (
                                <button
                                  onClick={() => handleUpdateMembershipStatus(mem.id, 'Active')}
                                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                                >
                                  Renew Membership
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateMembershipStatus(mem.id, 'Suspended')}
                                  className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md"
                                >
                                  Suspend
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: COMPLIANCE ENGINE */}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  {/* Overall Summary Card */}
                  <div className="p-5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Overall Operator Statutory Compliance Status
                      </span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <StatusBadge type="compliance" status={compliance?.overallStatus || 'Conditional'} size="lg" />
                        <span className="text-xs text-slate-300">
                          {compliance?.overallStatus === 'Compliant'
                            ? 'All statutory requirements verified. Full commercial good standing.'
                            : compliance?.overallStatus === 'Conditional'
                            ? 'One or more non-critical requirements pending review.'
                            : 'Requires immediate regulatory compliance action.'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      <span>Last Assessed:</span>
                      <span className="block text-white font-medium">
                        {compliance?.lastAssessedDate
                          ? new Date(compliance.lastAssessedDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Checklist Matrix */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Statutory Requirements Checklist & Assessment
                    </h4>

                    <div className="space-y-2.5">
                      {compliance?.requirements.map(req => (
                        <div
                          key={req.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{req.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {req.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                              {req.documentRef && <span>Doc: <code>{req.documentRef}</code></span>}
                              {req.expiryDate && <span>Expiry: {req.expiryDate}</span>}
                              {req.verifiedBy && <span>Verified by: {req.verifiedBy}</span>}
                            </div>
                            {req.notes && <p className="text-slate-600 text-[11px] italic">{req.notes}</p>}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge type="compliance" status={req.status} size="sm" />

                            {isStaffOrAdmin && (
                              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                                <button
                                  id={`btn-req-comp-${req.id}`}
                                  onClick={() => handleToggleRequirementStatus(req.id, 'Compliant')}
                                  disabled={actionLoading}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    req.status === 'Compliant'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                                  }`}
                                  title="Mark Compliant"
                                >
                                  Compliant
                                </button>
                                <button
                                  id={`btn-req-pend-${req.id}`}
                                  onClick={() => handleToggleRequirementStatus(req.id, 'Pending')}
                                  disabled={actionLoading}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    req.status === 'Pending'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
                                  }`}
                                  title="Mark Pending"
                                >
                                  Pending
                                </button>
                                <button
                                  id={`btn-req-non-${req.id}`}
                                  onClick={() => handleToggleRequirementStatus(req.id, 'Non-Compliant')}
                                  disabled={actionLoading}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    req.status === 'Non-Compliant'
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                                  }`}
                                  title="Mark Non-Compliant"
                                >
                                  Non-Comp
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: AUDIT TRAIL */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Immutable Administrative Action Trail
                    </h4>
                    <span className="text-xs text-slate-500">{auditLogs.length} audit entries</span>
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
                      No audit history logged for this operator.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {auditLogs.map(log => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                              <span>{log.action}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                                {log.entity}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1">{log.notes}</p>
                            {log.previousStatus && log.newStatus && (
                              <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                                Transition: {log.previousStatus} → {log.newStatus}
                              </p>
                            )}
                          </div>

                          <div className="text-right text-[11px] text-slate-400 shrink-0">
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                            <span className="block font-semibold text-slate-700">{log.user} ({log.role})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">National Tourism Registry Official Source of Truth</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
