/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Tv,
  Compass,
  MapPin,
  Star,
  QrCode,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { TourismOperator, TourismCategory } from '../../types';
import { LeafletMap } from '../common/LeafletMap';

interface KioskViewProps {
  operators: TourismOperator[];
  categories: TourismCategory[];
}

export const KioskView: React.FC<KioskViewProps> = ({ operators, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOp, setSelectedOp] = useState<TourismOperator | null>(null);

  const filtered = selectedCategory === 'All'
    ? operators
    : operators.filter(o => o.categoryId === selectedCategory);

  return (
    <div id="kiosk-mode-container" className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-slate-800 space-y-6 select-none animate-in fade-in">
      {/* Top Kiosk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
            PNG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-['Outfit']">
                Jacksons International Airport Visitor Kiosk
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                LIVE TOUCH TERMINAL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Official Papua New Guinea Tourism Promotion Authority Self-Service Station
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Touch any card to view verified itinerary & scan to phone</span>
        </div>
      </div>

      {/* Large Touch Category Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`p-4 rounded-2xl text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedCategory === 'All'
              ? 'bg-emerald-500 text-slate-950 shadow-lg scale-102'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>All Experiences</span>
        </button>

        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`p-4 rounded-2xl text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
              selectedCategory === c.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg scale-102'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="line-clamp-1">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Kiosk Content Grid: Map & Touch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Interactive Tourism Zone Map</span>
            <span>{filtered.length} Locations</span>
          </div>

          <LeafletMap
            operators={filtered}
            selectedOperator={selectedOp}
            onSelectOperator={op => setSelectedOp(op)}
            height="480px"
          />
        </div>

        {/* Right Touch Operator Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3 overflow-y-auto max-h-[500px] pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(op => (
              <div
                key={op.id}
                onClick={() => setSelectedOp(op)}
                className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 p-4 rounded-2xl cursor-pointer transition-all hover:scale-101 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-800">
                    <img src={op.heroImage} alt={op.businessName} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {op.rating || 5.0}
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    {op.categoryName}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">{op.businessName}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{op.district}, {op.province}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{op.priceRange || 'Moderate'}</span>
                  <span className="font-bold text-emerald-400">Touch to Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Touch Popup / QR Modal */}
      {selectedOp && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 text-white relative shadow-2xl">
            <button
              onClick={() => setSelectedOp(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedOp.heroImage}
                alt={selectedOp.businessName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
              />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                  {selectedOp.categoryName}
                </span>
                <h3 className="text-xl font-bold font-['Outfit']">{selectedOp.businessName}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedOp.address || `${selectedOp.district}, ${selectedOp.province}`}</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedOp.description}</p>

            {/* Scan QR for Mobile */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Take Itinerary on Your Mobile Device
                </h4>
                <p className="text-xs text-slate-400">
                  Scan this QR code with your phone camera to open full navigation guide and offline contact cards.
                </p>
              </div>

              <div className="w-20 h-20 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-950" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOp(null)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Close Kiosk Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
