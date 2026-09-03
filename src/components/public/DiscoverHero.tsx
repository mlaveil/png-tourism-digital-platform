import React from 'react';
import { Search, Map, Sparkles, ShieldCheck } from 'lucide-react';

interface DiscoverHeroProps { search:string; onSearch:(value:string)=>void; onMap:()=>void; }

export const DiscoverHero: React.FC<DiscoverHeroProps> = ({search,onSearch,onMap}) => (
  <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl min-h-[400px] flex items-end">
    <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1800&auto=format&fit=crop&q=85" alt="Papua New Guinea landscape" className="absolute inset-0 w-full h-full object-cover opacity-45" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/10" />
    <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12">
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"><Sparkles className="w-3.5 h-3.5 text-[#F3BA2F]"/> Discover Papua New Guinea</div>
        <div><h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02]">Plan your next<br/><span className="text-[#F3BA2F]">PNG journey.</span></h1><p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-200 leading-relaxed">Explore destinations, experiences and tourism businesses across Papua New Guinea. Search by place, activity or province.</p></div>
        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-3xl">
          <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search destinations, Kokoda, diving, culture…" className="w-full rounded-xl bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none" aria-label="Search PNG tourism listings"/></div>
          <button onClick={onMap} className="rounded-xl bg-[#00472F] px-5 py-3 text-sm font-bold text-white flex items-center justify-center gap-2 hover:bg-[#003624]"><Map className="w-4 h-4"/> Explore map</button>
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-slate-300"><span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/> Registry-linked listings</span><span>•</span><span>Provinces & regions</span><span>•</span><span>Experiences & places</span></div>
      </div>
    </div>
  </section>
);
