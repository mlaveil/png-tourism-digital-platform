/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Star,
  Search,
  Bookmark,
  User,
  Map,
  Sparkles,
  Award,
  ChevronRight,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { TourismOperator, TourismCategory } from '../../types';
import { LeafletMap } from '../common/LeafletMap';

interface SuperAppViewProps {
  operators: TourismOperator[];
  categories: TourismCategory[];
  onSelectOperator?: (op: TourismOperator) => void;
}

export const SuperAppView: React.FC<SuperAppViewProps> = ({
  operators,
  categories,
  onSelectOperator
}) => {
  const [activeNav, setActiveNav] = useState<'explore' | 'map' | 'licence' | 'saved'>('explore');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedOp, setSelectedOp] = useState<TourismOperator | null>(null);

  const filtered = operators.filter(o => {
    const matchSearch =
      !search ||
      o.businessName.toLowerCase().includes(search.toLowerCase()) ||
      o.province.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'All' || o.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div id="super-app-view" className="flex flex-col items-center justify-center py-6 animate-in fade-in">
      <div className="text-center mb-6 space-y-1">
        <h2 className="text-xl font-bold text-slate-900">PNG Tourism Official Super App</h2>
        <p className="text-xs text-slate-500">
          Citizen, Visitor, & Operator Unified Cross-Channel Mobile Interface
        </p>
      </div>

      {/* Phone Mockup Frame */}
      <div className="w-full max-w-[390px] h-[800px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-[6px] border-slate-800 relative flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3"></div>
        </div>

        {/* Smartphone Screen Canvas */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col justify-between text-slate-900 relative">
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Super App Body Area */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-xs">
            {activeNav === 'explore' && (
              <>
                {/* Header Welcome */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Papua New Guinea
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      Explore Paradise 🌴
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    PNG
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search Kokoda, diving, festivals..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 shadow-2xs focus:outline-emerald-600 font-medium"
                  />
                </div>

                {/* Experience Categories */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Top Categories</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">See all</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button
                      onClick={() => setSelectedCat('All')}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] ${
                        selectedCat === 'All'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      All
                    </button>
                    {categories.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCat(c.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] ${
                          selectedCat === c.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Verified Operators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Verified TPA Operators</span>
                    <span className="text-[10px] text-slate-500">{filtered.length} found</span>
                  </div>

                  <div className="space-y-3">
                    {filtered.map(op => (
                      <div
                        key={op.id}
                        onClick={() => setSelectedOp(op)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs cursor-pointer hover:border-emerald-500 transition-all flex flex-col"
                      >
                        <div className="relative h-28 w-full bg-slate-100">
                          <img src={op.heroImage} alt={op.businessName} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-emerald-800 text-[9px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            TPA Certified
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[10px] font-bold">
                            ★ {op.rating || 5.0}
                          </div>
                        </div>

                        <div className="p-3 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">
                            {op.categoryName}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{op.businessName}</h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{op.district}, {op.province}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeNav === 'map' && (
              <div className="space-y-2 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">National Tourism Map</span>
                  <span className="text-[10px] text-slate-500">{filtered.length} Pins</span>
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden min-h-[500px]">
                  <LeafletMap operators={filtered} height="520px" />
                </div>
              </div>
            )}

            {activeNav === 'licence' && (
              <div className="space-y-4">
                <div className="text-center pt-4 space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">PNG TPA Official Digital Licences</h4>
                  <p className="text-[11px] text-slate-500">Scan & verify commercial tourism permits instantly</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Live Registry Lookup</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    All tourism operators listed in this Super App hold valid statutory registration and operating licences under the PNG Tourism Promotion Authority.
                  </p>
                </div>
              </div>
            )}

            {activeNav === 'saved' && (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No saved itineraries yet</p>
                <p className="text-[11px]">Bookmark treks, dive charters, and lodges while exploring</p>
              </div>
            )}
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-[10px] font-semibold text-slate-500">
            <button
              onClick={() => setActiveNav('explore')}
              className={`flex flex-col items-center gap-0.5 ${
                activeNav === 'explore' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveNav('map')}
              className={`flex flex-col items-center gap-0.5 ${
                activeNav === 'map' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setActiveNav('licence')}
              className={`flex flex-col items-center gap-0.5 ${
                activeNav === 'licence' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Licences</span>
            </button>
            <button
              onClick={() => setActiveNav('saved')}
              className={`flex flex-col items-center gap-0.5 ${
                activeNav === 'saved' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
