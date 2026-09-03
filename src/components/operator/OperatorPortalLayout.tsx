/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  FileBadge,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Edit,
  Save,
  Globe,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  OperatorCompliance,
  DemoUser
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { api } from '../../services/api';

interface OperatorPortalLayoutProps {
  operators: TourismOperator[];
  currentUser: DemoUser;
  onOperatorUpdated: () => void;
  onSelectOperatorModal: (op: TourismOperator) => void;
}

export const OperatorPortalLayout: React.FC<OperatorPortalLayoutProps> = ({
  operators,
  currentUser,
  onOperatorUpdated,
  onSelectOperatorModal
}) => {
  // Let user choose which operator they are managing
  const [selectedOpId, setSelectedOpId] = useState<string>(
    currentUser.operatorId || operators[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'licensing' | 'compliance' | 'profile'>('overview');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentOp = operators.find(o => o.id === selectedOpId) || operators[0];

  const [formData, setFormData] = useState({
    businessName: currentOp?.businessName || '',
    tradingName: currentOp?.tradingName || '',
    contactPerson: currentOp?.contactPerson || '',
    email: currentOp?.email || '',
    phone: currentOp?.phone || '',
    website: currentOp?.website || '',
    address: currentOp?.address || '',
    description: currentOp?.description || ''
  });

  // Update form when operator changes
  const handleSelectOp = (id: string) => {
    setSelectedOpId(id);
    const op = operators.find(o => o.id === id);
    if (op) {
      setFormData({
        businessName: op.businessName,
        tradingName: op.tradingName,
        contactPerson: op.contactPerson,
        email: op.email,
        phone: op.phone,
        website: op.website,
        address: op.address,
        description: op.description
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOp) return;
    try {
      setSaving(true);
      await api.updateOperator(currentOp.id, formData);
      setEditMode(false);
      setMessage('Operator profile updated successfully!');
      onOperatorUpdated();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!currentOp) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        No registered tourism operators found in platform.
      </div>
    );
  }

  return (
    <div id="operator-portal-layout" className="space-y-6 animate-in fade-in">
      {/* Top Banner with Operator Switcher */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src={currentOp.heroImage}
            alt={currentOp.businessName}
            className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white tracking-tight">{currentOp.businessName}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                {currentOp.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Trading as: {currentOp.tradingName} • 📍 {currentOp.district}, {currentOp.province}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge type="registration" status={currentOp.registrationStatus} size="sm" />
              <StatusBadge type="license" status={currentOp.licenseStatus} size="sm" />
              <StatusBadge type="membership" status={currentOp.membershipStatus} size="sm" />
              <StatusBadge type="compliance" status={currentOp.complianceStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* Business Selector (Allows testing as any operator) */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1.5 self-start md:self-auto min-w-[240px]">
          <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Switch Managed Operator:
          </label>
          <select
            value={currentOp.id}
            onChange={e => handleSelectOp(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-emerald-500 font-medium"
          >
            {operators.map(o => (
              <option key={o.id} value={o.id}>
                {o.businessName} ({o.province})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Operator Dashboard', icon: Building2 },
          { id: 'licensing', label: 'Licences & Membership', icon: ShieldCheck },
          { id: 'compliance', label: 'Statutory Compliance', icon: FileBadge },
          { id: 'profile', label: 'Public Directory Profile', icon: Globe }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium">
          {message}
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[450px]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Registration Status */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Registration Standing
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge type="registration" status={currentOp.registrationStatus} size="lg" />
                </div>
                <p className="text-xs text-slate-600">
                  {currentOp.registrationStatus === 'Registered'
                    ? 'Verified and published in National Tourism Registry.'
                    : currentOp.registrationStatus === 'Approved'
                    ? 'Approved by TPA. Enrolment finalizing.'
                    : currentOp.registrationStatus === 'Under Review'
                    ? 'Currently being audited by TPA Licensing Division.'
                    : 'Initial registration application in progress.'}
                </p>
                <button
                  onClick={() => onSelectOperatorModal(currentOp)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>View Application History</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Operating Licence */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Commercial Licence
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge type="license" status={currentOp.licenseStatus} size="lg" />
                </div>
                <p className="text-xs text-slate-600">
                  {currentOp.licenseStatus === 'Active'
                    ? 'Active Commercial Tourism Operating Permit.'
                    : 'No active commercial licence on file.'}
                </p>
                <button
                  onClick={() => setActiveTab('licensing')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>View Licence Certificate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 3: Statutory Compliance */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Compliance Assessment
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge type="compliance" status={currentOp.complianceStatus} size="lg" />
                </div>
                <p className="text-xs text-slate-600">
                  {currentOp.complianceStatus === 'Compliant'
                    ? 'Fully compliant with all legal, IPA, insurance & safety standards.'
                    : 'Action required on pending documentation.'}
                </p>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>Upload Certificates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Digital Credential Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official PNG TPA Digital Verified Badge</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Digital Operating Certificate & QR Code</h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Display this digital verification credential on your website, physical shopfront, and marketing materials. Tourists and partners can scan the QR code to verify live registration and compliance status.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 shrink-0">
                <div className="w-20 h-20 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">{currentOp.businessName}</span>
                  <span className="text-[11px] text-emerald-700 font-mono block">VERIFIED-TPA-{currentOp.id}</span>
                  <span className="text-[10px] text-slate-500 block">Valid across Papua New Guinea</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LICENSING & MEMBERSHIP */}
        {activeTab === 'licensing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Official Tourism Operating Licence
                </h3>
                <StatusBadge type="license" status={currentOp.licenseStatus} size="sm" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Licence Class:</span>
                  <span className="font-bold text-slate-900">Commercial Tourism Guide & Operator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="font-semibold text-slate-900">PNG Tourism Promotion Authority</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="font-semibold text-slate-900">{currentOp.province}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                To renew or amend licence conditions, contact the TPA Licensing & Compliance Division at Harbourside West, Port Moresby.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  TPA Industry Association Membership
                </h3>
                <StatusBadge type="membership" status={currentOp.membershipStatus} size="sm" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Membership Tier:</span>
                  <span className="font-bold text-slate-900">Tour Operator Corporate Member</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Standing:</span>
                  <span className="font-semibold text-emerald-700">Good Standing (2026-2027)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Membership provides international marketing promotion at world trade expos (ITB Berlin, WTM London, AIME Melbourne) and platform priority placement.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: STATUTORY COMPLIANCE CHECKLIST */}
        {activeTab === 'compliance' && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Self-Service Statutory Compliance Portal</h3>
                <p className="text-xs text-slate-500">
                  Upload renewal documents, insurance certificates, and tax clearance returns
                </p>
              </div>
              <StatusBadge type="compliance" status={currentOp.complianceStatus} size="sm" />
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { title: 'IPA Company / Business Registration', status: 'Compliant', code: 'IPA-PNG-REG-01' },
                { title: 'Public Liability & Marine Insurance (PGK 2,000,000)', status: currentOp.complianceStatus === 'Compliant' ? 'Compliant' : 'Conditional', code: 'INS-PL-2026' },
                { title: 'Wilderness & Tour Guide Safety Certifications', status: 'Compliant', code: 'WFA-CERT-PNG' },
                { title: 'IRC Tax Clearance Certificate', status: 'Compliant', code: 'IRC-TCC-2026' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Ref: {item.code}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge type="compliance" status={item.status as any} size="sm" />
                    <button
                      onClick={() => alert(`Document upload simulated for: ${item.title}`)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload Renewal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage Public Tourism Profile</h3>
                <p className="text-xs text-slate-500">
                  Update tourist-facing descriptions, contact details, and marketing information
                </p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{editMode ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trading Name</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formData.tradingName}
                    onChange={e => setFormData({ ...formData, tradingName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled={!editMode}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Website</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  disabled={!editMode}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 disabled:bg-slate-100 leading-relaxed"
                />
              </div>

              {editMode && (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Updates'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
