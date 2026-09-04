import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DemoDataNotice: React.FC<{ compact?: boolean }> = ({ compact=false }) => (
  <div className={`demo-data-banner ${compact?'rounded-lg px-3 py-2':'rounded-xl px-4 py-3'} border border-red-950/30 shadow-sm`} role="note">
    <div className="flex items-start gap-2.5">
      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wide">Demonstration environment</p>
        <p className="text-[10px] sm:text-[11px] leading-relaxed text-red-50/90">All operators, licences, memberships, compliance statuses, ratings and verification indicators shown here are illustrative prototype data and are not an official tourism registry or government certification.</p>
      </div>
    </div>
  </div>
);
