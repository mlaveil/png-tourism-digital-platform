import React from 'react';
import { Database, Map, ShieldCheck, Smartphone } from 'lucide-react';

export const PlatformStatusStrip: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-[10px] font-semibold text-slate-600">
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2"><Database className="w-4 h-4 text-[#00472F]"/><span>Central tourism data model</span></div>
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2"><Map className="w-4 h-4 text-[#00472F]"/><span>GIS-ready discovery</span></div>
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#00472F]"/><span>Compliance workflow</span></div>
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#00472F]"/><span>Multi-channel prototype</span></div>
  </div>
);
