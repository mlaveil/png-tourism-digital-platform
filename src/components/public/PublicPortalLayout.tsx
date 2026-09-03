import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, Map, Grid, X, Compass, ArrowRight } from 'lucide-react';
import { TourismOperator, Province, TourismCategory } from '../../types';
import { LeafletMap } from '../common/LeafletMap';
import { DiscoverHero } from './DiscoverHero';
import { DemoDataNotice } from '../common/DemoDataNotice';
import { PlatformStatusStrip } from '../common/PlatformStatusStrip';

interface Props {
  operators: TourismOperator[];
  provinces: Province[];
  categories: TourismCategory[];
  onSelectOperator?: (op: TourismOperator) => void;
}

export const PublicPortalLayout: React.FC<Props> = ({ operators, provinces, categories }) => {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [profileOperator, setProfileOperator] = useState<TourismOperator | null>(null);

  const publicOperators = operators.filter((op) =>
    op.registrationStatus === 'Registered' &&
    (!search || [op.businessName, op.tradingName, op.province, op.description].some((v) => v.toLowerCase().includes(search.toLowerCase()))) &&
    (selectedProvince === 'All' || op.province === selectedProvince) &&
    (selectedCategory === 'All' || op.categoryId === selectedCategory)
  );

  const openProfile = (op: TourismOperator) => setProfileOperator(op);

  return (
    <div id="public-tourism-portal" className="space-y-6 sm:space-y-8 animate-in fade-in pb-12">
      <DemoDataNotice />
      <DiscoverHero search={search} onSearch={setSearch} onMap={() => setViewMode('map')} />
      <PlatformStatusStrip />

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Tourism discovery summary">
        {[
          ['Provinces', provinces.length],
          ['Listings', publicOperators.length],
          ['Experiences', categories.length],
          ['GIS mapped', publicOperators.filter((op) => op.latitude && op.longitude).length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#00472F]">{value}</p>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Experience filters">
        <button onClick={() => setSelectedCategory('All')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${selectedCategory === 'All' ? 'bg-[#00472F] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>All experiences</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${selectedCategory === c.id ? 'bg-[#00472F] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>{c.name}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-rose-500" aria-hidden="true" />
          <label htmlFor="province-filter" className="sr-only">Filter by province</label>
          <select id="province-filter" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold">
            <option value="All">All provinces</option>
            {provinces.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1" role="group" aria-label="Listing view">
          <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><Grid className="w-3.5 h-3.5" aria-hidden="true" />Listings</button>
          <button onClick={() => setViewMode('map')} aria-pressed={viewMode === 'map'} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${viewMode === 'map' ? 'bg-[#00472F] text-white' : 'text-slate-500'}`}><Map className="w-3.5 h-3.5" aria-hidden="true" />Map</button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <LeafletMap operators={publicOperators} selectedOperator={profileOperator} onSelectOperator={openProfile} height="560px" />
      ) : publicOperators.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {publicOperators.map((op) => (
            <article key={op.id} onClick={() => openProfile(op)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-emerald-600">
              <button className="w-full text-left" onClick={() => openProfile(op)} aria-label={`View ${op.businessName}`}>
                <div className="relative h-48">
                  <img src={op.heroImage} alt={op.businessName} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-800 flex gap-1 items-center"><ShieldCheck className="w-3 h-3" aria-hidden="true" /> Registry listing</span>
                  <div className="absolute bottom-3 left-3 right-3 text-white"><p className="text-[10px] uppercase font-bold text-emerald-300">{op.categoryName}</p><h3 className="font-bold text-base">{op.businessName}</h3></div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex gap-1.5 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />{op.district}, {op.province}</div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{op.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">{op.priceRange || 'Contact operator'}</span><span className="text-xs font-bold text-[#00472F] flex items-center gap-1">View profile <ArrowRight className="w-3 h-3" aria-hidden="true" /></span></div>
                </div>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center"><Compass className="w-10 h-10 text-slate-300 mx-auto" /><h3 className="font-bold text-slate-700 mt-3">No listings found</h3><p className="text-xs text-slate-400 mt-1">Try another province, category or search term.</p></div>
      )}

      {profileOperator && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3" onClick={() => setProfileOperator(null)}>
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${profileOperator.businessName} profile`}>
            <div className="relative h-56">
              <img src={profileOperator.heroImage} alt={profileOperator.businessName} className="w-full h-full object-cover" />
              <button onClick={() => setProfileOperator(null)} aria-label="Close profile" className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white"><X className="w-5 h-5" /></button>
              <div className="absolute bottom-4 left-5 text-white"><p className="text-xs font-bold text-emerald-300">{profileOperator.categoryName}</p><h2 className="text-2xl font-extrabold">{profileOperator.businessName}</h2></div>
            </div>
            <div className="p-5 space-y-4">
              <DemoDataNotice compact />
              <div className="flex gap-4 text-xs text-slate-600"><span className="flex items-center gap-1"><MapPin className="w-4 h-4" aria-hidden="true" />{profileOperator.district}, {profileOperator.province}</span>{profileOperator.rating && <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />{profileOperator.rating}</span>}</div>
              <p className="text-sm text-slate-700 leading-relaxed">{profileOperator.description}</p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="p-3 bg-slate-50 rounded-xl"><b>Contact</b><p className="mt-1">{profileOperator.contactPerson}</p><p>{profileOperator.phone}</p></div><div className="p-3 bg-slate-50 rounded-xl"><b>Website</b><p className="mt-1 break-all">{profileOperator.website || 'Not provided'}</p></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
