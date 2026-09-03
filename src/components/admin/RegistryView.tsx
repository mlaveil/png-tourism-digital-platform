/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Building2,
  MapPin,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';
import { TourismOperator, Province, TourismCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RegistryViewProps {
  operators: TourismOperator[];
  provinces: Province[];
  categories: TourismCategory[];
  filters: {
    search: string;
    province: string;
    category: string;
    status: string;
    compliance: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSelectOperator: (operator: TourismOperator) => void;
  onOpenCreateModal: () => void;
  loading: boolean;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  operators,
  provinces,
  categories,
  filters,
  onFilterChange,
  onSelectOperator,
  onOpenCreateModal,
  loading
}) => {
  const [selectedSort, setSelectedSort] = useState<'name' | 'province' | 'status' | 'updated'>('updated');

  const exportCSV = () => {
    const headers = [
      'Operator ID',
      'Business Name',
      'Trading Name',
      'Business Type / Sector',
      'Category',
      'Province',
      'District',
      'Contact Person',
      'Email',
      'Phone',
      'Registration Status',
      'Licence Status',
      'Membership Status',
      'Compliance Status',
      'Rating',
      'Latitude',
      'Longitude',
      'Last Updated'
    ];

    const rows = operators.map(op => [
      `"${op.id}"`,
      `"${op.businessName.replace(/"/g, '""')}"`,
      `"${op.tradingName.replace(/"/g, '""')}"`,
      `"${op.operatorType || ''}"`,
      `"${op.categoryName || ''}"`,
      `"${op.province}"`,
      `"${op.district}"`,
      `"${op.contactPerson.replace(/"/g, '""')}"`,
      `"${op.email}"`,
      `"${op.phone}"`,
      `"${op.registrationStatus}"`,
      `"${op.licenseStatus}"`,
      `"${op.membershipStatus}"`,
      `"${op.complianceStatus}"`,
      op.rating || 5.0,
      op.latitude,
      op.longitude,
      `"${op.lastUpdatedDate}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PNG_National_Tourism_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const payload = {
      meta: {
        title: 'PNG TPA National Tourism Operator Registry Extract',
        generatedAt: new Date().toISOString(),
        count: operators.length
      },
      operators
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PNG_National_Tourism_Registry_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="admin-registry-view" className="space-y-4 animate-in fade-in">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-registry-search"
              type="text"
              value={filters.search}
              onChange={e => onFilterChange('search', e.target.value)}
              placeholder="Search by business name, trading name, contact, province..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={exportCSV}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
              title="Export filtered records as CSV (Excel ready)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-export-json"
              onClick={exportJSON}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
              title="Export filtered records as JSON"
            >
              <FileText className="w-3.5 h-3.5 text-[#00472F]" />
              <span>JSON</span>
            </button>

            <button
              id="btn-create-operator-modal"
              onClick={onOpenCreateModal}
              className="px-4 py-2 text-xs font-semibold bg-[#00472F] hover:bg-[#003624] text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D9A100]" />
              <span>Add Operator</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Province Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Province
            </label>
            <select
              id="filter-registry-province"
              value={filters.province}
              onChange={e => onFilterChange('province', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-emerald-600"
            >
              <option value="All">All Provinces ({provinces.length})</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              id="filter-registry-category"
              value={filters.category}
              onChange={e => onFilterChange('category', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-emerald-600"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Registration Status
            </label>
            <select
              id="filter-registry-status"
              value={filters.status}
              onChange={e => onFilterChange('status', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-emerald-600"
            >
              <option value="All">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Compliance Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Compliance Status
            </label>
            <select
              id="filter-registry-compliance"
              value={filters.compliance}
              onChange={e => onFilterChange('compliance', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-emerald-600"
            >
              <option value="All">All Compliance</option>
              <option value="Compliant">Compliant</option>
              <option value="Conditional">Conditional / Pending</option>
              <option value="Non-Compliant">Non-Compliant / Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Count Banner */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{operators.length}</strong> operators in National Registry
        </span>
        {(filters.province !== 'All' || filters.category !== 'All' || filters.status !== 'All' || filters.compliance !== 'All' || filters.search) && (
          <button
            onClick={() => {
              onFilterChange('search', '');
              onFilterChange('province', 'All');
              onFilterChange('category', 'All');
              onFilterChange('status', 'All');
              onFilterChange('compliance', 'All');
            }}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3.5 px-4">Operator & Business</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Province & District</th>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4">Licence</th>
                <th className="py-3.5 px-4">Membership</th>
                <th className="py-3.5 px-4">Compliance</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1" />
                    <span>Loading registry records...</span>
                  </td>
                </tr>
              ) : operators.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm">No operators matching selected criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or create a new operator.</p>
                  </td>
                </tr>
              ) : (
                operators.map(op => (
                  <tr
                    key={op.id}
                    id={`row-operator-${op.id}`}
                    onClick={() => onSelectOperator(op)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Business Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={op.heroImage}
                          alt={op.businessName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                            {op.businessName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {op.id} {op.tradingName !== op.businessName && `• ${op.tradingName}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-medium">{op.categoryName || 'Tourism Provider'}</span>
                    </td>

                    {/* Province & District */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{op.province}</span>
                      <span className="text-[11px] text-slate-500">{op.district}</span>
                    </td>

                    {/* Registration Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge type="registration" status={op.registrationStatus} size="sm" />
                    </td>

                    {/* Licence Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge type="license" status={op.licenseStatus} size="sm" />
                    </td>

                    {/* Membership Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge type="membership" status={op.membershipStatus} size="sm" />
                    </td>

                    {/* Compliance Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge type="compliance" status={op.complianceStatus} size="sm" />
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectOperator(op);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Open 360° Inspector"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
