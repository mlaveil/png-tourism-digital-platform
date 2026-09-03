/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  Compass,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Province, TourismOperator, TourismCategory } from '../../types';
import { LeafletMap } from '../common/LeafletMap';

interface ProvincialPortalLayoutProps {
  provinces: Province[];
  operators: TourismOperator[];
  categories: TourismCategory[];
}

export const ProvincialPortalLayout: React.FC<ProvincialPortalLayoutProps> = ({
  provinces,
  operators,
  categories
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    provinces[0]?.id || 'prov-enb'
  );

  const activeProvince = provinces.find(p => p.id === selectedProvinceId) || provinces[0];

  const provinceOperators = operators.filter(o => o.province === activeProvince.name);
  const compliantCount = provinceOperators.filter(o => o.complianceStatus === 'Compliant').length;
  const compliancePct = provinceOperators.length > 0
    ? Math.round((compliantCount / provinceOperators.length) * 100)
    : 100;

  return (
    <div id="provincial-portal-view" className="space-y-6 animate-in fade-in pb-12">
      {/* Provincial Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono border border-emerald-500/30">
              {activeProvince.region} Region
            </span>
            <span className="text-xs text-slate-400">Capital: {activeProvince.capital}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            {activeProvince.name} Tourism Bureau
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {activeProvince.description}
          </p>
        </div>

        {/* Province Switcher */}
        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2 min-w-[260px] shrink-0">
          <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Select Province Portal:
          </label>
          <select
            id="select-province-portal"
            value={selectedProvinceId}
            onChange={e => setSelectedProvinceId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 text-white border border-slate-600 focus:outline-emerald-500 font-semibold"
          >
            {provinces.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Provincial KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Operators</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {provinceOperators.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">TPA Registered</span>
          </div>
          <p className="text-[11px] text-slate-500">Contributing to local economy</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-['Outfit']">
              {compliancePct}%
            </span>
            <span className="text-xs text-slate-500 font-semibold">({compliantCount} full)</span>
          </div>
          <p className="text-[11px] text-slate-500">Provincial regulatory standing</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Attractions</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-600 font-['Outfit']">
              {activeProvince.keyAttractions.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">Destinations</span>
          </div>
          <p className="text-[11px] text-slate-500">Major eco & cultural sites</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Growth</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-['Outfit']">+18.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">YoY Visitors</span>
          </div>
          <p className="text-[11px] text-slate-500">Visitor arrivals momentum</p>
        </div>
      </div>

      {/* Provincial GIS Map & Key Attractions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provincial Leaflet Map (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <h3 className="font-bold text-slate-900">
              {activeProvince.name} Provincial Tourism GIS Map
            </h3>
            <span className="text-slate-500 font-mono">
              Coordinates: {activeProvince.coordinates.lat}, {activeProvince.coordinates.lng}
            </span>
          </div>

          <LeafletMap
            operators={provinceOperators}
            center={[activeProvince.coordinates.lat, activeProvince.coordinates.lng]}
            zoom={8}
            height="460px"
          />
        </div>

        {/* Provincial Key Highlights */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Key Provincial Attractions
            </h3>

            <div className="space-y-2.5">
              {activeProvince.keyAttractions.map((att, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{att}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 text-white shadow-md space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Provincial Tourism Office Liaison
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              The {activeProvince.name} Provincial Tourism Bureau collaborates with PNG TPA Headquarters to streamline local operator registration, compliance training, and festival coordination.
            </p>
          </div>
        </div>
      </div>

      {/* Provincial Operators Directory Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Enrolled Tourism Operators in {activeProvince.name} ({provinceOperators.length})
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Operator Name</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Compliance</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {provinceOperators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No operators currently registered in {activeProvince.name}.
                  </td>
                </tr>
              ) : (
                provinceOperators.map(op => (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{op.businessName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{op.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{op.district}</td>
                    <td className="py-3.5 px-4 text-slate-600">{op.categoryName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{op.phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 font-semibold">✓ {op.complianceStatus}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {op.registrationStatus}
                      </span>
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
