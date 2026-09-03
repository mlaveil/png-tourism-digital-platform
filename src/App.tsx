/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  AuditLog,
  DashboardAnalytics,
  Province,
  TourismCategory,
  DemoUser,
  NotificationItem,
  RegistrationStatus,
  LicenseStatus,
  MembershipStatus
} from './types';
import { api } from './services/api';
import { DEMO_USERS } from './server/data';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { AuthScreen } from './components/auth/AuthScreen';
import { DemoHeader } from './components/common/DemoHeader';
import { DemoScenarioModal } from './components/common/DemoScenarioModal';
import { AddOperatorModal } from './components/admin/AddOperatorModal';
import { OperatorDetailModal } from './components/admin/OperatorDetailModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { OperatorPortalLayout } from './components/operator/OperatorPortalLayout';
import { PublicPortalLayout } from './components/public/PublicPortalLayout';
import { ProvincialPortalLayout } from './components/province/ProvincialPortalLayout';
import { KioskView } from './components/kiosk/KioskView';
import { SuperAppView } from './components/app/SuperAppView';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  // Firebase Authentication State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Demo State
  const [currentUser, setCurrentUser] = useState<DemoUser>(DEMO_USERS[0]); // Grace Pakur (Staff) by default
  const [activeChannel, setActiveChannel] = useState<'admin' | 'operator' | 'public' | 'province' | 'kiosk' | 'app'>('admin');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAddOperatorModalOpen, setIsAddOperatorModalOpen] = useState(false);
  const [selectedOperatorForModal, setSelectedOperatorForModal] = useState<TourismOperator | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setFirebaseUser(user);
        setActiveChannel('admin');
      } else {
        setFirebaseUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Platform Data
  const [operators, setOperators] = useState<TourismOperator[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationApplication[]>([]);
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [categories, setCategories] = useState<TourismCategory[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync API Client with Current User
  useEffect(() => {
    api.setCurrentUser(currentUser.name, currentUser.role);
  }, [currentUser]);

  // Load All Central Platform Data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [ops, regs, mems, lics, logs, dash, provs, cats] = await Promise.all([
        api.getOperators(),
        api.getRegistrations(),
        api.getMemberships(),
        api.getLicenses(),
        api.getAuditLogs(),
        api.getDashboard(),
        api.getProvinces(),
        api.getCategories()
      ]);

      setOperators(ops);
      setRegistrations(regs);
      setMemberships(mems);
      setLicenses(lics);
      setAuditLogs(logs);
      setAnalytics(dash);
      setProvinces(provs);
      setCategories(cats);
    } catch (err: any) {
      console.error('Data load failure:', err);
      setError(err.message || 'Failed to connect to central platform API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Push local notification helper
  const addNotification = (
    title: string,
    message: string,
    type: 'workflow' | 'licensing' | 'compliance' | 'system' = 'system'
  ) => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Reset database to clean seed state
  const handleResetSeed = async () => {
    try {
      setLoading(true);
      await api.resetSeed();
      await loadAllData();
      addNotification('System Database Reset', 'All records have been reset to pristine seed demonstration state.');
    } catch (err: any) {
      alert(err.message || 'Failed to reset seed');
    } finally {
      setLoading(false);
    }
  };

  // Create Operator Handler
  const handleCreateOperator = async (opData: Partial<TourismOperator>) => {
    const created = await api.createOperator(opData);
    await loadAllData();
    addNotification('New Operator Enrolled', `Created "${created.businessName}" in National Tourism Registry.`);
    // Automatically open the inspector for the newly created operator to streamline review!
    setSelectedOperatorForModal(created);
  };

  // Status Handlers
  const handleUpdateRegistrationStatus = async (regId: string, status: RegistrationStatus, notes?: string) => {
    await api.updateRegistrationStatus(regId, status, notes);
    await loadAllData();
    addNotification('Registration Status Updated', `Application status transitioned to ${status}.`);
  };

  const handleUpdateLicenseStatus = async (licId: string, status: LicenseStatus) => {
    await api.updateLicenseStatus(licId, status);
    await loadAllData();
    addNotification('Licence Status Changed', `Operating Licence updated to ${status}.`);
  };

  const handleUpdateMembershipStatus = async (memId: string, status: MembershipStatus) => {
    await api.updateMembershipStatus(memId, status);
    await loadAllData();
    addNotification('Membership Status Changed', `Industry Membership updated to ${status}.`);
  };

  // If Firebase Auth is checking session state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-3 font-['Inter']">
        <RefreshCw className="w-8 h-8 text-[#D9A100] animate-spin" />
        <p className="text-sm font-semibold text-slate-200">Initializing Papua New Guinea Tourism Authority Platform...</p>
      </div>
    );
  }

  // If not authenticated, render the Firebase Auth Screen
  if (!firebaseUser) {
    return (
      <AuthScreen
        onAuthSuccess={() => {
          setActiveChannel('admin');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-['Inter'] selection:bg-emerald-500 selection:text-white">
      {/* Global Demo & Role Navigation Bar */}
      <DemoHeader
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onResetSeed={handleResetSeed}
        onOpenDemoGuide={() => setIsDemoModalOpen(true)}
        authUser={firebaseUser}
        onLogout={handleLogout}
      />

      {/* Error Alert Banner */}
      {error && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Connection Warning: {error}</span>
            <button
              onClick={loadAllData}
              className="ml-auto underline text-white hover:text-slate-200"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Main Channel View Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {loading && !operators.length ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Connecting to National Tourism Digital Platform...</p>
            <p className="text-xs text-slate-400">Papua New Guinea Tourism Promotion Authority</p>
          </div>
        ) : (
          <>
            {/* CHANNEL 1: TPA Regulatory Admin Portal */}
            {activeChannel === 'admin' && (
              <AdminLayout
                operators={operators}
                registrations={registrations}
                memberships={memberships}
                licenses={licenses}
                auditLogs={auditLogs}
                analytics={analytics}
                provinces={provinces}
                categories={categories}
                currentUser={currentUser}
                onSelectOperator={op => setSelectedOperatorForModal(op)}
                onSelectOperatorById={id => {
                  const found = operators.find(o => o.id === id);
                  if (found) setSelectedOperatorForModal(found);
                }}
                onOpenCreateOperator={() => setIsAddOperatorModalOpen(true)}
                onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
                onUpdateLicenseStatus={handleUpdateLicenseStatus}
                onUpdateMembershipStatus={handleUpdateMembershipStatus}
                loading={loading}
              />
            )}

            {/* CHANNEL 2: Tourism Operator Self-Service Portal */}
            {activeChannel === 'operator' && (
              <OperatorPortalLayout
                operators={operators}
                currentUser={currentUser}
                onOperatorUpdated={loadAllData}
                onSelectOperatorModal={op => setSelectedOperatorForModal(op)}
              />
            )}

            {/* CHANNEL 3: Public Tourism Web Portal */}
            {activeChannel === 'public' && (
              <PublicPortalLayout
                operators={operators}
                provinces={provinces}
                categories={categories}
                onSelectOperator={op => setSelectedOperatorForModal(op)}
              />
            )}

            {/* CHANNEL 4: Provincial Tourism Bureau Portal */}
            {activeChannel === 'province' && (
              <ProvincialPortalLayout
                provinces={provinces}
                operators={operators}
                categories={categories}
              />
            )}

            {/* CHANNEL 5: Touchscreen Kiosk Terminal */}
            {activeChannel === 'kiosk' && (
              <KioskView
                operators={operators}
                categories={categories}
              />
            )}

            {/* CHANNEL 6: Official Mobile Super App */}
            {activeChannel === 'app' && (
              <SuperAppView
                operators={operators}
                categories={categories}
                onSelectOperator={op => setSelectedOperatorForModal(op)}
              />
            )}
          </>
        )}
      </main>

      {/* Global 360° Operator Inspector Modal */}
      {selectedOperatorForModal && (
        <OperatorDetailModal
          operatorId={selectedOperatorForModal.id}
          isOpen={Boolean(selectedOperatorForModal)}
          onClose={() => setSelectedOperatorForModal(null)}
          currentUser={currentUser}
          onOperatorUpdated={loadAllData}
        />
      )}

      {/* Add Operator Enrolment Modal */}
      <AddOperatorModal
        isOpen={isAddOperatorModalOpen}
        onClose={() => setIsAddOperatorModalOpen(false)}
        onSubmit={handleCreateOperator}
        provinces={provinces}
        categories={categories}
      />

      {/* Demo Scenario Acceptance Guide Modal */}
      <DemoScenarioModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectRole={setCurrentUser}
        onSelectChannel={setActiveChannel}
        onOpenCreateOperator={() => {
          setIsAddOperatorModalOpen(true);
        }}
        onResetSeed={handleResetSeed}
      />

      {/* Footer */}
      <footer className="bg-[#003624] border-t-2 border-[#D9A100] text-emerald-200/80 text-xs py-6 px-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-white font-['Outfit']">Papua New Guinea Tourism Promotion Authority (PNG TPA)</span>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">
              National Tourism Digital Platform Prototype • Prepared 7 August 2026
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white">REST Central API v1.0</span>
            <span className="text-[#D9A100]">•</span>
            <span className="hover:text-white">GIS Integration</span>
            <span className="text-[#D9A100]">•</span>
            <span className="hover:text-white">Statutory Compliance Assurance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
