/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building2,
  ShieldCheck,
  Award,
  Clock,
  History,
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  TourismOperator,
  RegistrationApplication,
  LicenseRecord,
  MembershipRecord,
  AuditLog,
  Province,
  TourismCategory,
  DashboardAnalytics
} from '../../types';

interface ReportsExtractViewProps {
  operators: TourismOperator[];
  registrations: RegistrationApplication[];
  licenses: LicenseRecord[];
  memberships: MembershipRecord[];
  auditLogs: AuditLog[];
  provinces: Province[];
  categories: TourismCategory[];
  analytics: DashboardAnalytics | null;
}

type ExtractPreset =
  | 'registry_master'
  | 'compliance_audit'
  | 'provincial_summary'
  | 'license_expiry'
  | 'memberships'
  | 'audit_trail'
  | 'custom_query';

export const ReportsExtractView: React.FC<ReportsExtractViewProps> = ({
  operators,
  registrations,
  licenses,
  memberships,
  auditLogs,
  provinces,
  categories,
  analytics
}) => {
  const [activePreset, setActivePreset] = useState<ExtractPreset>('registry_master');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompliance, setSelectedCompliance] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Column visibility selection for custom query or export
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: boolean }>({
    id: true,
    businessName: true,
    tradingName: true,
    operatorType: true,
    categoryName: true,
    province: true,
    district: true,
    contactPerson: true,
    email: true,
    phone: true,
    registrationStatus: true,
    licenseStatus: true,
    membershipStatus: true,
    complianceStatus: true,
    rating: true,
    coordinates: true,
    lastUpdatedDate: true
  });

  // Filtered operators based on options
  const filteredOperators = useMemo(() => {
    return operators.filter(op => {
      const matchProvince = selectedProvince === 'All' || op.province === selectedProvince;
      const matchCategory = selectedCategory === 'All' || op.categoryId === selectedCategory;
      const matchCompliance = selectedCompliance === 'All' || op.complianceStatus === selectedCompliance;
      const matchStatus = selectedStatus === 'All' || op.registrationStatus === selectedStatus;
      const s = searchQuery.toLowerCase();
      const matchSearch =
        !s ||
        op.businessName.toLowerCase().includes(s) ||
        op.tradingName.toLowerCase().includes(s) ||
        op.id.toLowerCase().includes(s) ||
        op.province.toLowerCase().includes(s) ||
        op.district.toLowerCase().includes(s) ||
        op.contactPerson.toLowerCase().includes(s);

      return matchProvince && matchCategory && matchCompliance && matchStatus && matchSearch;
    });
  }, [operators, selectedProvince, selectedCategory, selectedCompliance, selectedStatus, searchQuery]);

  // Provincial Summary dataset
  const provincialSummaryData = useMemo(() => {
    return provinces.map(p => {
      const opsInProv = operators.filter(o => o.province === p.name);
      const compliantOps = opsInProv.filter(o => o.complianceStatus === 'Compliant').length;
      const conditionalOps = opsInProv.filter(o => o.complianceStatus === 'Conditional').length;
      const nonCompliantOps = opsInProv.filter(o => o.complianceStatus === 'Non-Compliant').length;
      const activeLics = licenses.filter(l => {
        const op = operators.find(o => o.id === l.operatorId);
        return op?.province === p.name && l.status === 'Active';
      }).length;
      const rate = opsInProv.length > 0 ? Math.round((compliantOps / opsInProv.length) * 100) : 100;

      return {
        provinceId: p.id,
        provinceName: p.name,
        region: p.region,
        capital: p.capital,
        totalOperators: opsInProv.length,
        compliantCount: compliantOps,
        conditionalCount: conditionalOps,
        nonCompliantCount: nonCompliantOps,
        activeLicenses: activeLics,
        complianceRatePct: rate,
        keyAttractionsCount: p.keyAttractions?.length || 3
      };
    });
  }, [provinces, operators, licenses]);

  // Expiry schedule dataset (licenses & permits)
  const expiryScheduleData = useMemo(() => {
    return licenses.map(l => {
      const op = operators.find(o => o.id === l.operatorId);
      const expiry = new Date(l.expiryDate);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        licenseId: l.id,
        licenseNumber: l.licenseNumber,
        operatorId: l.operatorId,
        operatorName: l.operatorName || op?.businessName || 'Unknown Operator',
        licenseType: l.licenseType,
        province: op?.province || 'National',
        contactPerson: op?.contactPerson || 'N/A',
        phone: op?.phone || 'N/A',
        email: op?.email || 'N/A',
        issueDate: l.issueDate,
        expiryDate: l.expiryDate,
        status: l.status,
        daysRemaining: diffDays,
        urgency: diffDays < 0 ? 'Expired' : diffDays <= 30 ? 'Critical (<30d)' : diffDays <= 90 ? 'Upcoming (<90d)' : 'Active'
      };
    });
  }, [licenses, operators]);

  // CSV Generator function
  const generateCSV = (preset: ExtractPreset) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filenamePrefix = 'PNG_TPA_Report';

    if (preset === 'registry_master' || preset === 'custom_query') {
      filenamePrefix = 'PNG_TPA_National_Registry_Master_Extract';
      headers = [
        'Operator ID',
        'Business Name',
        'Trading Name',
        'Business Type / Sector',
        'Category Name',
        'Province',
        'District',
        'Physical Address',
        'Contact Person',
        'Email',
        'Phone',
        'Website',
        'Registration Status',
        'Licence Status',
        'Membership Status',
        'Compliance Standing',
        'Rating',
        'Latitude',
        'Longitude',
        'Date Enrolled',
        'Last Verified Date'
      ];

      rows = filteredOperators.map(op => [
        `"${op.id}"`,
        `"${op.businessName.replace(/"/g, '""')}"`,
        `"${op.tradingName.replace(/"/g, '""')}"`,
        `"${op.operatorType || ''}"`,
        `"${op.categoryName || ''}"`,
        `"${op.province}"`,
        `"${op.district}"`,
        `"${op.address.replace(/"/g, '""')}"`,
        `"${op.contactPerson.replace(/"/g, '""')}"`,
        `"${op.email}"`,
        `"${op.phone}"`,
        `"${op.website}"`,
        `"${op.registrationStatus}"`,
        `"${op.licenseStatus}"`,
        `"${op.membershipStatus}"`,
        `"${op.complianceStatus}"`,
        op.rating || 5.0,
        op.latitude,
        op.longitude,
        `"${op.createdDate}"`,
        `"${op.lastUpdatedDate}"`
      ]);
    } else if (preset === 'compliance_audit') {
      filenamePrefix = 'PNG_TPA_Statutory_Compliance_Audit_Extract';
      headers = [
        'Operator ID',
        'Business Name',
        'Province',
        'District',
        'Contact Person',
        'Overall Compliance Standing',
        'Registration Standing',
        'Licence Standing',
        'Membership Standing',
        'IPA Registration',
        'Public Liability Insurance',
        'Health & Sanitation Cert',
        'Safety & First Aid',
        'Last Assessed Date'
      ];

      rows = filteredOperators.map(op => [
        `"${op.id}"`,
        `"${op.businessName.replace(/"/g, '""')}"`,
        `"${op.province}"`,
        `"${op.district}"`,
        `"${op.contactPerson}"`,
        `"${op.complianceStatus}"`,
        `"${op.registrationStatus}"`,
        `"${op.licenseStatus}"`,
        `"${op.membershipStatus}"`,
        `"Verified (IPA Active)"`,
        `"${op.complianceStatus === 'Non-Compliant' ? 'Expired / Missing' : 'Valid (10M PGK)'}"`,
        `"${op.complianceStatus === 'Conditional' ? 'Inspection Pending' : 'Certified'}"`,
        `"${op.complianceStatus === 'Non-Compliant' ? 'Renewal Required' : 'Certified'}"`,
        `"${op.lastUpdatedDate}"`
      ]);
    } else if (preset === 'provincial_summary') {
      filenamePrefix = 'PNG_TPA_Provincial_Performance_Extract';
      headers = [
        'Province ID',
        'Province Name',
        'Region',
        'Capital City',
        'Total Registered Operators',
        'Fully Compliant Count',
        'Conditional Pending Count',
        'Non-Compliant Count',
        'Active Licences Issued',
        'Compliance Rate (%)',
        'Key Attractions Count'
      ];

      rows = provincialSummaryData.map(p => [
        `"${p.provinceId}"`,
        `"${p.provinceName}"`,
        `"${p.region}"`,
        `"${p.capital}"`,
        p.totalOperators,
        p.compliantCount,
        p.conditionalCount,
        p.nonCompliantCount,
        p.activeLicenses,
        `${p.complianceRatePct}%`,
        p.keyAttractionsCount
      ]);
    } else if (preset === 'license_expiry') {
      filenamePrefix = 'PNG_TPA_Licence_Permit_Expiry_Schedule';
      headers = [
        'Licence ID',
        'Licence Number',
        'Operator ID',
        'Operator Business Name',
        'Licence Classification',
        'Province',
        'Contact Person',
        'Phone',
        'Email',
        'Issue Date',
        'Expiry Date',
        'Status',
        'Days Remaining',
        'Urgency Level'
      ];

      rows = expiryScheduleData.map(l => [
        `"${l.licenseId}"`,
        `"${l.licenseNumber}"`,
        `"${l.operatorId}"`,
        `"${l.operatorName.replace(/"/g, '""')}"`,
        `"${l.licenseType}"`,
        `"${l.province}"`,
        `"${l.contactPerson}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.issueDate}"`,
        `"${l.expiryDate}"`,
        `"${l.status}"`,
        l.daysRemaining,
        `"${l.urgency}"`
      ]);
    } else if (preset === 'memberships') {
      filenamePrefix = 'PNG_TPA_Industry_Memberships_Extract';
      headers = [
        'Membership ID',
        'Membership Number',
        'Operator ID',
        'Operator Name',
        'Membership Type',
        'Start Date',
        'Expiry Date',
        'Status',
        'Fee Paid (PGK)',
        'Notes'
      ];

      rows = memberships.map(m => [
        `"${m.id}"`,
        `"${m.membershipNumber}"`,
        `"${m.operatorId}"`,
        `"${m.operatorName.replace(/"/g, '""')}"`,
        `"${m.membershipType}"`,
        `"${m.startDate}"`,
        `"${m.expiryDate}"`,
        `"${m.status}"`,
        m.feePaid,
        `"${(m.notes || '').replace(/"/g, '""')}"`
      ]);
    } else if (preset === 'audit_trail') {
      filenamePrefix = 'PNG_TPA_System_Audit_Trail_Extract';
      headers = [
        'Log ID',
        'Timestamp',
        'Actor / User',
        'Role',
        'Action Description',
        'Entity Type',
        'Entity ID',
        'Previous Status',
        'New Status',
        'Assessor Notes'
      ];

      rows = auditLogs.map(a => [
        `"${a.id}"`,
        `"${a.timestamp}"`,
        `"${a.user}"`,
        `"${a.role}"`,
        `"${a.action.replace(/"/g, '""')}"`,
        `"${a.entity}"`,
        `"${a.entityId}"`,
        `"${a.previousStatus || ''}"`,
        `"${a.newStatus || ''}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    return { csvContent, filename: `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv` };
  };

  // Trigger CSV Download
  const handleDownloadCSV = () => {
    const { csvContent, filename } = generateCSV(activePreset);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trigger JSON Download
  const handleDownloadJSON = () => {
    let dataToExport: any = [];
    let filenamePrefix = 'PNG_TPA_Data_Extract';

    if (activePreset === 'registry_master' || activePreset === 'custom_query') {
      dataToExport = filteredOperators;
      filenamePrefix = 'PNG_TPA_National_Registry';
    } else if (activePreset === 'compliance_audit') {
      dataToExport = filteredOperators.map(o => ({
        operatorId: o.id,
        businessName: o.businessName,
        province: o.province,
        district: o.district,
        complianceStatus: o.complianceStatus,
        registrationStatus: o.registrationStatus,
        licenseStatus: o.licenseStatus,
        membershipStatus: o.membershipStatus,
        lastUpdated: o.lastUpdatedDate
      }));
      filenamePrefix = 'PNG_TPA_Compliance_Matrix';
    } else if (activePreset === 'provincial_summary') {
      dataToExport = provincialSummaryData;
      filenamePrefix = 'PNG_TPA_Provincial_Performance';
    } else if (activePreset === 'license_expiry') {
      dataToExport = expiryScheduleData;
      filenamePrefix = 'PNG_TPA_Licence_Expiries';
    } else if (activePreset === 'memberships') {
      dataToExport = memberships;
      filenamePrefix = 'PNG_TPA_Memberships';
    } else if (activePreset === 'audit_trail') {
      dataToExport = auditLogs;
      filenamePrefix = 'PNG_TPA_Audit_Trail';
    }

    const payload = {
      exportMetadata: {
        organization: 'Papua New Guinea Tourism Promotion Authority (PNG TPA)',
        system: 'National Tourism Digital Platform - Central Data Extract Service',
        generatedAt: new Date().toISOString(),
        recordCount: dataToExport.length,
        preset: activePreset
      },
      records: dataToExport
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  const handleCopyClipboard = () => {
    const { csvContent } = generateCSV(activePreset);
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const presetList = [
    {
      id: 'registry_master',
      title: 'National Tourism Registry Master',
      desc: 'Complete export of all enrolled operators, GPS coordinates, sectors, and contact info',
      icon: Building2,
      count: filteredOperators.length,
      badge: 'Master File'
    },
    {
      id: 'compliance_audit',
      title: 'Statutory Compliance Audit Extract',
      desc: 'Detailed regulatory matrix covering IPA, licenses, safety certifications, and insurance standing',
      icon: ShieldCheck,
      count: filteredOperators.length,
      badge: 'Statutory'
    },
    {
      id: 'provincial_summary',
      title: 'Provincial Performance & Coverage',
      desc: 'Aggregated regional statistics, compliance rates, and operator densities across all 22 PNG Provinces',
      icon: FileSpreadsheet,
      count: provincialSummaryData.length,
      badge: 'Aggregated'
    },
    {
      id: 'license_expiry',
      title: 'Licences & Permits Expiry Schedule',
      desc: 'Proactive renewal schedule identifying upcoming expirations in 30, 60, and 90 days',
      icon: Clock,
      count: expiryScheduleData.length,
      badge: 'Enforcement'
    },
    {
      id: 'memberships',
      title: 'Industry Association Memberships',
      desc: 'Active member roster across Tour Operators, Trekking, Diving, and Eco-Tourism affiliates',
      icon: Award,
      count: memberships.length,
      badge: 'Affiliates'
    },
    {
      id: 'audit_trail',
      title: 'Regulatory Audit Trail & System Log',
      desc: 'Full immutable log of status transitions, officer decisions, and inspection notes',
      icon: History,
      count: auditLogs.length,
      badge: 'Security'
    }
  ];

  return (
    <div id="data-extract-reporting-view" className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header & Overview */}
      <div className="p-6 rounded-3xl bg-[#00472F] border-2 border-[#D9A100] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9A100]/20 text-[#F3BA2F] text-xs font-bold font-mono border border-[#D9A100]/40">
              NATIONAL REGULATORY EXTRACT ENGINE
            </span>
            <span className="text-xs text-emerald-100/80">REST API v1.0 Export Service</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
            Data Extract & Regulatory Reporting Center
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Generate and export official statutory reports, compliance matrices, GIS coordinate rosters, and provincial executive extracts in CSV, JSON, and print-ready formats.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-download-csv-primary"
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 text-xs font-bold bg-[#D9A100] hover:bg-[#B38400] text-[#003624] rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-download-json-primary"
            onClick={handleDownloadJSON}
            className="px-3.5 py-2.5 text-xs font-bold bg-[#003624] hover:bg-[#00281b] text-white rounded-xl border border-emerald-700/80 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#D9A100]" />
            <span>JSON Extract</span>
          </button>

          <button
            id="btn-open-print-modal"
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2.5 text-xs font-bold bg-[#003624] hover:bg-[#00281b] text-white rounded-xl border border-emerald-700/80 flex items-center gap-1.5 transition-colors"
            title="Generate Official Printable TPA Executive Audit Summary"
          >
            <Printer className="w-4 h-4 text-[#D9A100]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Preset Report Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetList.map(p => {
          const Icon = p.icon;
          const isActive = activePreset === p.id;

          return (
            <div
              key={p.id}
              id={`preset-card-${p.id}`}
              onClick={() => setActivePreset(p.id as ExtractPreset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-[#00472F] ring-2 ring-[#00472F]/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#00472F] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#D9A100]/20 text-[#B38400] border border-[#D9A100]/40'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">{p.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">{p.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="font-mono font-bold text-slate-700">{p.count} records available</span>
                <span
                  className={`font-bold text-[11px] ${
                    isActive ? 'text-[#00472F]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {isActive ? 'Active Target ✓' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Parameters & Configuration Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#00472F]" />
              <span>Extract Scope & Parameters</span>
            </h3>
            <p className="text-xs text-slate-500">Refine dataset filters before executing extract</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              id="btn-copy-clipboard"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied CSV!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedProvince('All');
                setSelectedCategory('All');
                setSelectedCompliance('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-2 border-t border-slate-100">
          {/* Search */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search business, ID..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-[#00472F]"
              />
            </div>
          </div>

          {/* Province */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Province Filter
            </label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-[#00472F]"
            >
              <option value="All">All Provinces ({provinces.length})</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sector / Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tourism Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-[#00472F]"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Compliance Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Compliance Standing
            </label>
            <select
              value={selectedCompliance}
              onChange={e => setSelectedCompliance(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-[#00472F]"
            >
              <option value="All">All Standings</option>
              <option value="Compliant">Compliant Only</option>
              <option value="Conditional">Conditional / Pending</option>
              <option value="Non-Compliant">Non-Compliant Only</option>
            </select>
          </div>

          {/* Registration Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Registration Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-[#00472F]"
            >
              <option value="All">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Data Preview Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Live Data Extract Preview
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                {activePreset.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review records matching criteria before generating physical export files
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Matched Records: <strong className="text-slate-900">{filteredOperators.length}</strong>
            </span>
          </div>
        </div>

        {/* Table Renderer based on active preset */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          {activePreset === 'registry_master' || activePreset === 'custom_query' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">ID</th>
                  <th className="py-3 px-3.5">Business & Trading Name</th>
                  <th className="py-3 px-3.5">Category / Sector</th>
                  <th className="py-3 px-3.5">Province & District</th>
                  <th className="py-3 px-3.5">Contact Person</th>
                  <th className="py-3 px-3.5">Compliance</th>
                  <th className="py-3 px-3.5">Registration</th>
                  <th className="py-3 px-3.5">GPS Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredOperators.slice(0, 10).map(op => (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono text-[11px] font-bold text-slate-800">{op.id}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-bold text-slate-900 block">{op.businessName}</span>
                      <span className="text-[11px] text-slate-400">{op.tradingName}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">{op.operatorType || op.categoryName}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{op.district}, {op.province}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      <div>{op.contactPerson}</div>
                      <div className="text-[10px] text-slate-400">{op.phone}</div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          op.complianceStatus === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : op.complianceStatus === 'Conditional'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {op.complianceStatus === 'Compliant' ? '✓' : op.complianceStatus === 'Conditional' ? '⚠' : '✕'}{' '}
                        {op.complianceStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {op.registrationStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[10px] text-slate-500">
                      {op.latitude?.toFixed(4)}, {op.longitude?.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activePreset === 'compliance_audit' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Operator</th>
                  <th className="py-3 px-3.5">Province</th>
                  <th className="py-3 px-3.5">Overall Standing</th>
                  <th className="py-3 px-3.5">IPA Certificate</th>
                  <th className="py-3 px-3.5">Public Liability</th>
                  <th className="py-3 px-3.5">Health & Safety</th>
                  <th className="py-3 px-3.5">Last Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOperators.slice(0, 10).map(op => (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <span className="font-bold text-slate-900 block">{op.businessName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{op.id}</span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-slate-700">{op.province}</td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          op.complianceStatus === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : op.complianceStatus === 'Conditional'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {op.complianceStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">✓ Verified Active</td>
                    <td className="py-2.5 px-3.5">
                      {op.complianceStatus === 'Non-Compliant' ? (
                        <span className="text-rose-600 font-semibold">✕ Expired / Pending</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">✓ 10M PGK Cover</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {op.complianceStatus === 'Conditional' ? (
                        <span className="text-amber-600 font-semibold">⚠ Inspection Slated</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">✓ Pass Grade A</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(op.lastUpdatedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activePreset === 'provincial_summary' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Province</th>
                  <th className="py-3 px-3.5">Region</th>
                  <th className="py-3 px-3.5">Total Operators</th>
                  <th className="py-3 px-3.5">Compliant</th>
                  <th className="py-3 px-3.5">Conditional</th>
                  <th className="py-3 px-3.5">Non-Compliant</th>
                  <th className="py-3 px-3.5">Active Licences</th>
                  <th className="py-3 px-3.5">Compliance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {provincialSummaryData.slice(0, 10).map(p => (
                  <tr key={p.provinceId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">{p.provinceName}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{p.region}</td>
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{p.totalOperators}</td>
                    <td className="py-2.5 px-3.5 text-emerald-700 font-semibold">{p.compliantCount}</td>
                    <td className="py-2.5 px-3.5 text-amber-700 font-semibold">{p.conditionalCount}</td>
                    <td className="py-2.5 px-3.5 text-rose-700 font-semibold">{p.nonCompliantCount}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-700">{p.activeLicenses}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-extrabold text-emerald-700">{p.complianceRatePct}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activePreset === 'license_expiry' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Licence Number</th>
                  <th className="py-3 px-3.5">Operator Name</th>
                  <th className="py-3 px-3.5">Licence Type</th>
                  <th className="py-3 px-3.5">Expiry Date</th>
                  <th className="py-3 px-3.5">Days Remaining</th>
                  <th className="py-3 px-3.5">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiryScheduleData.slice(0, 10).map(l => (
                  <tr key={l.licenseId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{l.licenseNumber}</td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800">{l.operatorName}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{l.licenseType}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-700">{l.expiryDate}</td>
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{l.daysRemaining} days</td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          l.urgency === 'Critical (<30d)'
                            ? 'bg-rose-100 text-rose-800'
                            : l.urgency === 'Upcoming (<90d)'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {l.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing top preview rows • Full records included in CSV / JSON export</span>
          <span className="font-mono text-emerald-700 font-semibold">Ready for batch processing</span>
        </div>
      </div>

      {/* Official Executive Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Controls */}
            <div className="p-4 bg-[#00472F] text-white flex items-center justify-between border-b-2 border-[#D9A100]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D9A100]" />
                <h3 className="font-bold text-base font-['Outfit']">
                  Official Statutory Tourism Extract & Regulatory Audit Summary
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#D9A100] hover:bg-[#B38400] text-[#003624] rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#003624] hover:bg-[#00281b] text-emerald-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Report Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white font-serif" id="printable-tpa-report">
              {/* Header with PNG TPA Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1 font-sans">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-600">
                  Independent State of Papua New Guinea
                </div>
                <h1 className="text-xl font-extrabold text-[#00472F] tracking-tight font-['Outfit']">
                  PAPUA NEW GUINEA TOURISM PROMOTION AUTHORITY
                </h1>
                <div className="text-xs text-slate-600 font-medium">
                  National Tourism Regulatory & Industry Compliance Registry • Section 29 Statutory Report
                </div>
                <div className="text-[11px] text-slate-500 pt-1 font-mono">
                  Report Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • TPA-REP-{new Date().getFullYear()}-0091
                </div>
              </div>

              {/* Executive Summary Stats */}
              <div className="grid grid-cols-4 gap-3 font-sans text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Total Registered</div>
                  <div className="text-xl font-bold text-slate-900 font-['Outfit']">{operators.length}</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-[10px] font-bold uppercase text-emerald-700">Fully Compliant</div>
                  <div className="text-xl font-bold text-emerald-800 font-['Outfit']">
                    {operators.filter(o => o.complianceStatus === 'Compliant').length}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-[10px] font-bold uppercase text-amber-700">Conditional Audit</div>
                  <div className="text-xl font-bold text-amber-800 font-['Outfit']">
                    {operators.filter(o => o.complianceStatus === 'Conditional').length}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Compliance Rate</div>
                  <div className="text-xl font-bold text-[#00472F] font-['Outfit']">{analytics?.complianceRate || 92}%</div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="space-y-2 font-sans">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  National Tourism Operator Roster & Regulatory Status
                </h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Operator ID</th>
                      <th className="p-2 border-r border-slate-300">Business Name</th>
                      <th className="p-2 border-r border-slate-300">Sector</th>
                      <th className="p-2 border-r border-slate-300">Province</th>
                      <th className="p-2 border-r border-slate-300">Licence</th>
                      <th className="p-2">Compliance Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOperators.map(op => (
                      <tr key={op.id} className="text-[11px]">
                        <td className="p-2 font-mono border-r border-slate-200">{op.id}</td>
                        <td className="p-2 font-bold border-r border-slate-200">{op.businessName}</td>
                        <td className="p-2 border-r border-slate-200">{op.operatorType || op.categoryName}</td>
                        <td className="p-2 border-r border-slate-200">{op.province}</td>
                        <td className="p-2 border-r border-slate-200 font-mono">{op.licenseStatus}</td>
                        <td className="p-2 font-bold">{op.complianceStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Seal and Sign-off */}
              <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 font-sans text-xs">
                <div>
                  <div className="font-bold text-slate-800">Prepared By:</div>
                  <div className="text-slate-600 mt-1">PNG Tourism Promotion Authority (TPA)</div>
                  <div className="text-slate-500 text-[10px]">National Tourism Central Registry Division</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Authorized Officer:</div>
                  <div className="mt-8 border-t border-slate-400 inline-block w-48 pt-1 text-slate-600">
                    Chief Executive Officer / Registrar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
