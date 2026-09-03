/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Play, Sparkles, RefreshCw, X, ExternalLink } from 'lucide-react';
import { DemoUser } from '../../types';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (roleUser: DemoUser) => void;
  onSelectChannel: (channel: 'admin' | 'operator' | 'public' | 'province' | 'kiosk' | 'app') => void;
  onOpenCreateOperator?: () => void;
  onResetSeed?: () => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onSelectChannel,
  onOpenCreateOperator,
  onResetSeed
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Login as TPA Staff',
      desc: 'Switch role to Grace Pakur (Senior Registry & Compliance Officer).',
      actionLabel: 'Switch to Staff',
      action: () => {
        onSelectRole({
          id: 'user-staff-1',
          name: 'Grace Pakur',
          role: 'staff',
          title: 'Senior Registry & Compliance Officer',
          department: 'PNG TPA Operations Division',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        });
        onSelectChannel('admin');
      }
    },
    {
      step: 2,
      title: 'Open Tourism Registry & Create Operator',
      desc: 'Navigate to Registry and create a new operator "PNG Paradise Tours" in National Capital District.',
      actionLabel: 'Open Add Operator',
      action: () => {
        onSelectChannel('admin');
        if (onOpenCreateOperator) onOpenCreateOperator();
      }
    },
    {
      step: 3,
      title: 'Submit Registration Application',
      desc: 'Submit application for formal regulatory review and initial documentation audit.',
      actionLabel: 'Go to Workflows',
      action: () => {
        onSelectChannel('admin');
      }
    },
    {
      step: 4,
      title: 'Switch to TPA Administrator & Review',
      desc: 'Switch role to Markus Kaumu (Director of Policy & Licensing) to review and approve.',
      actionLabel: 'Switch to Admin',
      action: () => {
        onSelectRole({
          id: 'user-admin-1',
          name: 'Markus Kaumu',
          role: 'admin',
          title: 'Director of Policy & Licensing',
          department: 'PNG Tourism Promotion Authority (PNG TPA)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        });
        onSelectChannel('admin');
      }
    },
    {
      step: 5,
      title: 'Issue Active Membership & Tourism Licence',
      desc: 'Associate official TPA Tour Operator Membership and Commercial Operating Licence.',
      actionLabel: 'View Registry Licences',
      action: () => {
        onSelectChannel('admin');
      }
    },
    {
      step: 6,
      title: 'Verify Compliance Status',
      desc: 'Verify statutory IPA, insurance, and safety requirements to calculate COMPLIANT status.',
      actionLabel: 'Check Compliance',
      action: () => {
        onSelectChannel('admin');
      }
    },
    {
      step: 7,
      title: 'Open Public Tourism Directory',
      desc: 'Verify the newly registered and compliant operator appears on public channels with sensitive data hidden.',
      actionLabel: 'Go to Public Portal',
      action: () => {
        onSelectChannel('public');
      }
    },
    {
      step: 8,
      title: 'View on Interactive Map & Provincial Portal',
      desc: 'Confirm the same operator pin is active on GIS map, NCD Provincial Portal, and Airport Kiosk.',
      actionLabel: 'Open Provincial Portal',
      action: () => {
        onSelectChannel('province');
      }
    },
    {
      step: 9,
      title: 'Open Airport Kiosk & Super App',
      desc: 'Confirm real-time unified data propagation to touch kiosk mode and mobile Super App view.',
      actionLabel: 'Open Kiosk Mode',
      action: () => {
        onSelectChannel('kiosk');
      }
    }
  ];

  return (
    <div id="demo-scenario-modal" className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00472F] border-b-2 border-[#D9A100] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9A100]/20 border border-[#D9A100]/40 flex items-center justify-center text-[#F3BA2F]">
              <Sparkles className="w-5 h-5 text-[#D9A100]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">End-to-End Demonstration Scenario</h3>
              <p className="text-xs text-emerald-100/80">Section 29 Prototype Acceptance & Validation Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onResetSeed && (
              <button
                onClick={onResetSeed}
                id="btn-modal-reset-seed"
                className="px-3 py-1.5 text-xs font-semibold bg-[#003624] hover:bg-[#00281b] text-emerald-100 rounded-lg border border-emerald-800/60 flex items-center gap-1.5 transition-colors"
                title="Reset database to clean seed state"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D9A100]" />
                Reset Data
              </button>
            )}
            <button
              onClick={onClose}
              id="btn-close-demo-modal"
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#003624] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-1">
            <p className="font-bold text-[#00472F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00472F]"></span>
              Single Unified Central Data Source
            </p>
            <p className="text-slate-700 leading-relaxed">
              All channels (TPA Admin, Operator Portal, Public Website, Provincial Portal, Kiosk & Super App) share the live REST API and National Tourism Registry backend. Any status change updates immediately across all interfaces.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {steps.map(s => (
              <div
                key={s.step}
                className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00472F] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-['Outfit']">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    s.action();
                    onClose();
                  }}
                  id={`btn-demo-step-${s.step}`}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-[#00472F] hover:bg-[#003624] text-white rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>{s.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-[#D9A100]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Prepared for PNG Tourism Promotion Authority (PNG TPA)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#00472F] hover:bg-[#003624] text-white rounded-lg transition-colors"
          >
            Close Guide & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
