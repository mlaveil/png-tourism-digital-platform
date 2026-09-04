import React, { useState } from 'react';
import { Delete, LockKeyhole, ShieldCheck } from 'lucide-react';

interface KioskAuthScreenProps {
  onAuthenticated: () => void;
}

// Demonstration-only kiosk PIN. Production must validate a device credential server-side.
const DEMO_KIOSK_PIN = '2026';

export const KioskAuthScreen: React.FC<KioskAuthScreenProps> = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const submit = (value = pin) => {
    if (value === DEMO_KIOSK_PIN) {
      sessionStorage.setItem('png-tourism-kiosk-authenticated', '1');
      onAuthenticated();
      return;
    }
    setPin('');
    setError('Invalid kiosk PIN. Please try again.');
  };

  const press = (digit: string) => {
    setError('');
    const next = `${pin}${digit}`.slice(0, 4);
    setPin(next);
    if (next.length === 4) submit(next);
  };

  const remove = () => {
    setError('');
    setPin(value => value.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-7">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl">
          <LockKeyhole className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">PNG Tourism Digital Platform</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Kiosk Authentication</h1>
          <p className="text-sm text-slate-400">Enter the authorised kiosk PIN to start this touch terminal.</p>
        </div>

        <div className="flex justify-center gap-3" aria-label="Kiosk PIN entry">
          {[0, 1, 2, 3].map(index => (
            <div key={index} className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${pin.length > index ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-700 bg-slate-900'}`}>
              {pin.length > index ? '•' : ''}
            </div>
          ))}
        </div>

        {error && <p className="text-sm font-semibold text-rose-400" role="alert">{error}</p>}

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {['1','2','3','4','5','6','7','8','9'].map(digit => (
            <button key={digit} type="button" onClick={() => press(digit)} className="h-16 rounded-2xl bg-slate-900 border border-slate-700 text-xl font-bold hover:bg-slate-800 active:scale-95 transition-transform">{digit}</button>
          ))}
          <button type="button" onClick={() => setPin('')} className="h-16 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-400">Clear</button>
          <button type="button" onClick={() => press('0')} className="h-16 rounded-2xl bg-slate-900 border border-slate-700 text-xl font-bold hover:bg-slate-800 active:scale-95 transition-transform">0</button>
          <button type="button" onClick={remove} className="h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300"><Delete className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Demonstration device authentication</span>
        </div>
        <p className="text-[10px] text-slate-600">Demo PIN: 2026 • Production authentication must use a server-validated kiosk credential.</p>
      </div>
    </div>
  );
};
