/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Building2,
  Globe,
  MapPin,
  Tv,
  Smartphone,
  RefreshCw,
  Bell,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { DemoUser, NotificationItem } from '../../types';
import { DEMO_USERS } from '../../server/data';
import type { User as FirebaseUser } from 'firebase/auth';

interface DemoHeaderProps {
  currentUser: DemoUser;
  onSelectUser: (user: DemoUser) => void;
  activeChannel: 'admin' | 'operator' | 'public' | 'province' | 'kiosk' | 'app';
  onSelectChannel: (channel: 'admin' | 'operator' | 'public' | 'province' | 'kiosk' | 'app') => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onResetSeed: () => void;
  onOpenDemoGuide: () => void;
  authUser?: FirebaseUser | null;
  onLogout?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  currentUser,
  onSelectUser,
  activeChannel,
  onSelectChannel,
  notifications,
  onMarkNotificationRead,
  onResetSeed,
  onOpenDemoGuide,
  authUser,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReset = async () => {
    setIsResetting(true);
    await onResetSeed();
    setTimeout(() => setIsResetting(false), 500);
  };

  const channels = [
    { id: 'admin', label: 'TPA Admin Portal', icon: Shield, path: '/admin', roles: ['admin', 'staff'] },
    { id: 'operator', label: 'Operator Portal', icon: Building2, path: '/operator', roles: ['operator', 'admin', 'staff'] },
    { id: 'public', label: 'Public Tourism Directory', icon: Globe, path: '/public', roles: ['public', 'admin', 'staff', 'operator'] },
    { id: 'province', label: 'Provincial Portal', icon: MapPin, path: '/province', roles: ['public', 'admin', 'staff', 'operator'] },
    { id: 'kiosk', label: 'Touch Kiosk Mode', icon: Tv, path: '/kiosk', roles: ['public', 'admin', 'staff'] },
    { id: 'app', label: 'Super App View', icon: Smartphone, path: '/app', roles: ['public', 'admin', 'staff', 'operator'] }
  ] as const;

  return (
    <header id="demo-global-header" className="sticky top-0 z-[600] bg-[#00472F] border-b-2 border-[#D9A100] text-white select-none shadow-md">
      {/* Top Banner: Role Selection & Channel Switching Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand & TPA Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D9A100] text-[#003624] flex items-center justify-center font-extrabold shadow-sm text-xs font-mono tracking-wider">
              PNG
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-sm">
                <span className="font-['Outfit']">PNG Tourism Digital Platform</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D9A100]/20 text-[#F3BA2F] font-semibold border border-[#D9A100]/40">
                  MVP Prototype
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-normal">Papua New Guinea Tourism Promotion Authority</p>
            </div>
          </div>
        </div>

        {/* Action Controls: Walkthrough Scenario, Reset Data, Notifications, Role Switcher */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Demo Scenario Guide Button */}
          <button
            id="btn-open-demo-scenario"
            onClick={onOpenDemoGuide}
            className="px-3 py-1.5 rounded-lg bg-[#D9A100] hover:bg-[#B38400] text-[#003624] font-bold flex items-center gap-1.5 shadow-sm transition-all text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#003624]" />
            <span>Demo Acceptance Scenario</span>
          </button>

          {/* Reset Demo Data */}
          <button
            id="btn-reset-demo-data"
            onClick={handleReset}
            disabled={isResetting}
            className="px-2.5 py-1.5 rounded-lg bg-[#003624] hover:bg-[#00281b] text-emerald-100 hover:text-white border border-emerald-800/60 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Reset database to initial pristine state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#D9A100]' : ''}`} />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-1.5 rounded-lg bg-[#003624] hover:bg-[#00281b] text-emerald-100 hover:text-white border border-emerald-800/60 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Platform Notifications</span>
                  <span className="text-[11px] text-slate-500">{notifications.length} alerts</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No active alerts</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/50 font-medium' : 'text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-slate-900">{n.title}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#00472F]"></span>}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role / Demo User Selector */}
          <div className="relative">
            <button
              id="btn-role-switcher"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#003624] hover:bg-[#00281b] border border-emerald-800/60 text-white text-xs transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-[#D9A100]"
              />
              <div className="text-left hidden md:block">
                <span className="font-semibold block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-[#F3BA2F] block uppercase font-mono font-medium">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-900">Switch Demo Role</p>
                  <p className="text-[11px] text-slate-500">Test different persona permissions</p>
                </div>
                <div className="p-1 space-y-1">
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-emerald-50 text-[#00472F] border border-emerald-200 font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold truncate">{u.name}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{u.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Firebase Authentication Sign Out Button */}
          {onLogout && (
            <button
              id="btn-firebase-logout"
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 hover:text-white border border-rose-800/60 flex items-center gap-1.5 transition-colors text-xs font-semibold"
              title={authUser?.email ? `Sign out (${authUser.email})` : 'Sign out of Firebase'}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Channel Navigation Tabs */}
      <div className="bg-[#003624] border-t border-emerald-900/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="text-[11px] text-emerald-200/70 font-semibold uppercase tracking-wider px-2 shrink-0">
            Channels:
          </span>
          {channels.map(ch => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                id={`btn-channel-${ch.id}`}
                onClick={() => onSelectChannel(ch.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D9A100] text-[#003624] shadow-xs font-bold'
                    : 'text-emerald-100 hover:text-white hover:bg-[#00472F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
