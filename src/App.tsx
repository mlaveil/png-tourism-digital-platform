import React, { useState, useEffect, useCallback } from 'react';
import { TourismOperator, RegistrationApplication, MembershipRecord, LicenseRecord, AuditLog, DashboardAnalytics, Province, TourismCategory, DemoUser, NotificationItem, RegistrationStatus, LicenseStatus, MembershipStatus } from './types';
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
import { RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

const DEMO_SESSION_KEY = 'png-tourism-demo-session';
type Channel = 'admin' | 'operator' | 'public' | 'province' | 'kiosk' | 'app';

const channelFromUrl = (): Channel => {
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'kiosk' || mode === 'app' || mode === 'public' || mode === 'province' || mode === 'operator' || mode === 'admin') return mode;
  return 'admin';
};

const isStandaloneChannel = (channel: Channel) => channel === 'kiosk' || channel === 'app';

export default function App() {
  const initialChannel = channelFromUrl();
  const [firebaseUser,setFirebaseUser]=useState<FirebaseUser|null>(null),[authLoading,setAuthLoading]=useState(true);
  const [demoSession,setDemoSession]=useState(()=>isStandaloneChannel(initialChannel)||localStorage.getItem(DEMO_SESSION_KEY)==='1');
  const [currentUser,setCurrentUser]=useState<DemoUser>(DEMO_USERS[0]);
  const [activeChannel,setActiveChannel]=useState<Channel>(initialChannel);
  const [isDemoModalOpen,setIsDemoModalOpen]=useState(false),[isAddOperatorModalOpen,setIsAddOperatorModalOpen]=useState(false),[selectedOperatorForModal,setSelectedOperatorForModal]=useState<TourismOperator|null>(null);
  const [operators,setOperators]=useState<TourismOperator[]>([]),[registrations,setRegistrations]=useState<RegistrationApplication[]>([]),[memberships,setMemberships]=useState<MembershipRecord[]>([]),[licenses,setLicenses]=useState<LicenseRecord[]>([]),[auditLogs,setAuditLogs]=useState<AuditLog[]>([]),[analytics,setAnalytics]=useState<DashboardAnalytics|null>(null),[provinces,setProvinces]=useState<Province[]>([]),[categories,setCategories]=useState<TourismCategory[]>([]),[notifications,setNotifications]=useState<NotificationItem[]>([]);
  const [loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);

  useEffect(()=>{const unsubscribe=onAuthStateChanged(auth,user=>{if(user&&user.emailVerified){setFirebaseUser(user);if(!isStandaloneChannel(channelFromUrl()))setDemoSession(false)}else setFirebaseUser(null);setAuthLoading(false)});return()=>unsubscribe()},[]);
  useEffect(()=>{api.setCurrentUser(currentUser.name,currentUser.role)},[currentUser]);

  const loadAllData=useCallback(async()=>{try{setLoading(true);setError(null);const [ops,regs,mems,lics,logs,dash,provs,cats,notifs]=await Promise.all([api.getOperators(),api.getRegistrations(),api.getMemberships(),api.getLicenses(),api.getAuditLogs(),api.getDashboard(),api.getProvinces(),api.getCategories(),api.getNotifications(currentUser.role,currentUser.operatorId)]);setOperators(ops);setRegistrations(regs);setMemberships(mems);setLicenses(lics);setAuditLogs(logs);setAnalytics(dash);setProvinces(provs);setCategories(cats);setNotifications(notifs)}catch(err:any){console.error('Data load failure:',err);setError(err.message||'Failed to connect to central platform API')}finally{setLoading(false)}},[currentUser.role,currentUser.operatorId]);
  useEffect(()=>{if(firebaseUser||demoSession)loadAllData()},[firebaseUser,demoSession,loadAllData]);

  const enterDemo=()=>{localStorage.setItem(DEMO_SESSION_KEY,'1');setDemoSession(true);setCurrentUser(DEMO_USERS[0]);setActiveChannel('admin');window.history.replaceState({},'',window.location.pathname)};
  const handleChannelChange=(channel:Channel)=>{setActiveChannel(channel);const url=new URL(window.location.href);if(channel==='admin')url.searchParams.delete('mode');else url.searchParams.set('mode',channel);window.history.replaceState({},'',`${url.pathname}${url.search}${url.hash}`)};
  const handleLogout=async()=>{localStorage.removeItem(DEMO_SESSION_KEY);setDemoSession(false);if(firebaseUser)await signOut(auth)};
  const addNotification=(title:string,message:string,type:'workflow'|'licensing'|'compliance'|'system'='system')=>setNotifications(prev=>[{id:`notif-${Date.now()}`,title,message,type,timestamp:new Date().toISOString(),read:false},...prev]);
  const handleMarkNotificationRead=async(id:string)=>{setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));await api.markNotificationRead(id)};
  const handleResetSeed=async()=>{try{setLoading(true);await api.resetSeed();await loadAllData();addNotification('Demo dataset reset','Records restored to the prepared demonstration state.')}catch(err:any){alert(err.message||'Failed to reset seed')}finally{setLoading(false)}};
  const handleCreateOperator=async(data:Partial<TourismOperator>)=>{const created=await api.createOperator(data);await loadAllData();addNotification('Operator record created',`Created "${created.businessName}" as a demonstration registry record.`);setSelectedOperatorForModal(created)};
  const handleUpdateRegistrationStatus=async(id:string,status:RegistrationStatus,notes?:string)=>{await api.updateRegistrationStatus(id,status,notes);await loadAllData();addNotification('Registration updated',`Application status changed to ${status}.`,'workflow')};
  const handleUpdateLicenseStatus=async(id:string,status:LicenseStatus)=>{await api.updateLicenseStatus(id,status);await loadAllData();addNotification('Licence updated',`Licence status changed to ${status}.`,'licensing')};
  const handleUpdateMembershipStatus=async(id:string,status:MembershipStatus)=>{await api.updateMembershipStatus(id,status);await loadAllData();addNotification('Membership updated',`Membership status changed to ${status}.`,'workflow')};

  if(authLoading)return <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-3"><RefreshCw className="w-8 h-8 text-[#D9A100] animate-spin"/><p className="text-sm font-semibold">Initializing PNG Tourism Digital Platform…</p></div>;
  if(!firebaseUser&&!demoSession)return <AuthScreen onAuthSuccess={()=>handleChannelChange('admin')} onDemoAccess={enterDemo}/>;

  const standalone=isStandaloneChannel(activeChannel);
  return <div className={standalone?'min-h-screen bg-slate-950 text-slate-900 flex flex-col':'min-h-screen bg-slate-100 text-slate-900 flex flex-col font-[\'Inter\'] selection:bg-emerald-500 selection:text-white'}>
    {!standalone&&<DemoHeader currentUser={currentUser} onSelectUser={setCurrentUser} activeChannel={activeChannel} onSelectChannel={handleChannelChange} notifications={notifications} onMarkNotificationRead={handleMarkNotificationRead} onResetSeed={handleResetSeed} onOpenDemoGuide={()=>setIsDemoModalOpen(true)} authUser={firebaseUser} onLogout={handleLogout}/>} 
    <div className="demo-data-banner px-4 py-2 text-[11px] font-bold tracking-wide text-center border-b border-red-950" role="status"><div className="max-w-7xl mx-auto flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4 shrink-0"/><span>DEMONSTRATION SYSTEM — DATA, LICENCES, MEMBERSHIPS AND VERIFICATION STATUSES ARE ILLUSTRATIVE ONLY — NOT AN OFFICIAL TOURISM REGISTRY</span></div></div>
    {error&&<div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md"><div className="flex items-center gap-2 max-w-7xl mx-auto w-full"><AlertCircle className="w-4 h-4 shrink-0"/><span>Connection warning: {error}</span><button onClick={loadAllData} className="ml-auto underline">Retry connection</button></div></div>}
    <main className={standalone?'flex-1 w-full':'flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8'}>
      {loading&&!operators.length?<div className="flex flex-col items-center justify-center h-96 space-y-3"><RefreshCw className="w-8 h-8 text-emerald-600 animate-spin"/><p className="text-sm font-semibold text-slate-700">Connecting to the national tourism platform…</p><p className="text-xs text-slate-400">Demonstration environment</p></div>:<>
        {activeChannel==='admin'&&<AdminLayout operators={operators} registrations={registrations} memberships={memberships} licenses={licenses} auditLogs={auditLogs} analytics={analytics} provinces={provinces} categories={categories} currentUser={currentUser} onSelectOperator={op=>setSelectedOperatorForModal(op)} onSelectOperatorById={id=>{const found=operators.find(o=>o.id===id);if(found)setSelectedOperatorForModal(found)}} onOpenCreateOperator={()=>setIsAddOperatorModalOpen(true)} onUpdateRegistrationStatus={handleUpdateRegistrationStatus} onUpdateLicenseStatus={handleUpdateLicenseStatus} onUpdateMembershipStatus={handleUpdateMembershipStatus} loading={loading}/>} 
        {activeChannel==='operator'&&<OperatorPortalLayout operators={operators} currentUser={currentUser} onOperatorUpdated={loadAllData} onSelectOperatorModal={op=>setSelectedOperatorForModal(op)}/>} 
        {activeChannel==='public'&&<PublicPortalLayout operators={operators} provinces={provinces} categories={categories} onSelectOperator={op=>setSelectedOperatorForModal(op)}/>} 
        {activeChannel==='province'&&<ProvincialPortalLayout provinces={provinces} operators={operators} categories={categories}/>} 
        {activeChannel==='kiosk'&&<KioskView operators={operators} categories={categories}/>} 
        {activeChannel==='app'&&<SuperAppView operators={operators} categories={categories} onSelectOperator={op=>setSelectedOperatorForModal(op)}/>} 
      </>}
    </main>
    {!standalone&&selectedOperatorForModal&&<OperatorDetailModal operatorId={selectedOperatorForModal.id} isOpen={true} onClose={()=>setSelectedOperatorForModal(null)} currentUser={currentUser} onOperatorUpdated={loadAllData}/>} 
    {!standalone&&<AddOperatorModal isOpen={isAddOperatorModalOpen} onClose={()=>setIsAddOperatorModalOpen(false)} onSubmit={handleCreateOperator} provinces={provinces} categories={categories}/>} 
    {!standalone&&<DemoScenarioModal isOpen={isDemoModalOpen} onClose={()=>setIsDemoModalOpen(false)} onSelectRole={setCurrentUser} onSelectChannel={handleChannelChange} onOpenCreateOperator={()=>setIsAddOperatorModalOpen(true)} onResetSeed={handleResetSeed}/>} 
    <footer className={standalone?'bg-slate-950 border-t border-slate-800 text-slate-500 text-[10px] py-3 px-4':'bg-[#003624] border-t-2 border-[#D9A100] text-emerald-200/80 text-xs py-5 px-4'}><div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left"><div><span className="font-bold text-white">Papua New Guinea Tourism Promotion Authority (PNG TPA)</span><p className="text-[10px] text-emerald-300/70 mt-0.5">National Tourism Digital Platform • Demonstration environment • August 2026 baseline</p></div><div className="text-[10px]">{standalone?'Touch-enabled public experience • Internet accessible prototype':'Prototype • REST API • GIS • Compliance workflow'}</div></div></footer>
  </div>;
}
