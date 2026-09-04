import { TourismOperator, RegistrationApplication, MembershipRecord, LicenseRecord, OperatorCompliance, AuditLog, NotificationItem, DashboardAnalytics, Province, TourismCategory, DemoUser, RegistrationStatus, MembershipStatus, LicenseStatus } from '../types';

let currentUser: DemoUser = { id:'user-admin-1', name:'Markus Kaumu', role:'admin', title:'Director of Policy & Licensing', department:'PNG Tourism Promotion Authority (PNG TPA)', avatar:'' };
export const setCurrentUser=(user:DemoUser)=>{currentUser=user};
export const getCurrentUser=()=>currentUser;
const getHeaders=()=>({'Content-Type':'application/json','x-user-name':currentUser.name,'x-user-role':currentUser.role});
const request=async<T>(url:string,options?:RequestInit):Promise<T>=>{const res=await fetch(url,options);if(!res.ok){let message=`Request failed (${res.status})`;try{const body=await res.json();message=body.error||message}catch{}throw new Error(message)}return res.json()};

export const api={
  setCurrentUser(name:string,role:string){currentUser={...currentUser,name,role:role as any}},
  async getOperators(filters?:{search?:string;province?:string;category?:string;status?:string;compliance?:string}){const p=new URLSearchParams();Object.entries(filters||{}).forEach(([k,v])=>v&&p.set(k,v));return request<TourismOperator[]>(`/api/operators?${p}`)},
  async getOperatorById(id:string){return request<TourismOperator>(`/api/operators/${id}`)},
  async createOperator(data:Partial<TourismOperator>){return request<TourismOperator>('/api/operators',{method:'POST',headers:getHeaders(),body:JSON.stringify(data)})},
  async updateOperator(id:string,data:Partial<TourismOperator>){return request<TourismOperator>(`/api/operators/${id}`,{method:'PUT',headers:getHeaders(),body:JSON.stringify(data)})},
  async getPublicOperators(filters?:{search?:string;province?:string;category?:string}){const p=new URLSearchParams();Object.entries(filters||{}).forEach(([k,v])=>v&&p.set(k,v));return request<any[]>(`/api/public/operators?${p}`)},
  async getPublicOperatorById(id:string){return request<any>(`/api/public/operators/${id}`)},
  async getRegistrations(){return request<RegistrationApplication[]>('/api/registrations')},
  async createRegistration(operatorId:string,notes?:string){return request<RegistrationApplication>('/api/registrations',{method:'POST',headers:getHeaders(),body:JSON.stringify({operatorId,notes})})},
  async updateRegistrationStatus(id:string,status:RegistrationStatus,notes?:string){return request<RegistrationApplication>(`/api/registrations/${id}/status`,{method:'PUT',headers:getHeaders(),body:JSON.stringify({status,notes})})},
  async getMemberships(){return request<MembershipRecord[]>('/api/memberships')},
  async createMembership(data:Partial<MembershipRecord>){return request<MembershipRecord>('/api/memberships',{method:'POST',headers:getHeaders(),body:JSON.stringify(data)})},
  async updateMembershipStatus(id:string,status:MembershipStatus,notes?:string){return request<MembershipRecord>(`/api/memberships/${id}/status`,{method:'PUT',headers:getHeaders(),body:JSON.stringify({status,notes})})},
  async getLicenses(){return request<LicenseRecord[]>('/api/licenses')},
  async createLicense(data:Partial<LicenseRecord>){return request<LicenseRecord>('/api/licenses',{method:'POST',headers:getHeaders(),body:JSON.stringify(data)})},
  async updateLicenseStatus(id:string,status:LicenseStatus,notes?:string){return request<LicenseRecord>(`/api/licenses/${id}/status`,{method:'PUT',headers:getHeaders(),body:JSON.stringify({status,notes})})},
  async getCompliance(operatorId:string){return request<OperatorCompliance>(`/api/compliance/${operatorId}`)},
  async updateComplianceRequirement(operatorId:string,requirementId:string,status:'Compliant'|'Pending'|'Non-Compliant'|'Expired',notes?:string){return request<OperatorCompliance>(`/api/compliance/${operatorId}/requirement`,{method:'PUT',headers:getHeaders(),body:JSON.stringify({requirementId,status,notes})})},
  async getProvinces(){return request<Province[]>('/api/provinces')},
  async getCategories(){return request<TourismCategory[]>('/api/categories')},
  async getDashboard(){return request<DashboardAnalytics>('/api/dashboard')},
  async getAuditLogs(){return request<AuditLog[]>('/api/audit-logs')},
  async getNotifications(role?:string,operatorId?:string){const p=new URLSearchParams();if(role)p.set('role',role);if(operatorId)p.set('operatorId',operatorId);return request<NotificationItem[]>(`/api/notifications?${p}`)},
  async markNotificationRead(id:string){await request(`/api/notifications/${id}/read`,{method:'POST',headers:getHeaders()})},
  async resetSeed(){await request('/api/seed/reset',{method:'POST',headers:getHeaders()})}
};
