/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  Compass,
  Map,
  Grid,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TourismOperator, Province, TourismCategory } from '../../types';
import { LeafletMap } from '../common/LeafletMap';

interface PublicPortalLayoutProps {
  operators: TourismOperator[];
  provinces: Province[];
  categories: TourismCategory[];
  onSelectOperator?: (op: TourismOperator) => void;
}

export const PublicPortalLayout: React.FC<PublicPortalLayoutProps> = ({
  operators,
  provinces,
  categories,
  onSelectOperator
}) => {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [profileOperator, setProfileOperator] = useState<TourismOperator | null>(null);
  const [bookingSent, setBookingSent] = useState(false);

  // Filter only operators that are visible to the public (e.g. Registered or Approved)
  // For prototype demonstration, include all non-draft or registered to showcase real-time propagation!
  const publicOperators = operators.filter(op => {
    const isPubliclyVisible = op.registrationStatus === 'Registered' || op.registrationStatus === 'Approved';
    const matchesSearch =
      !search ||
      op.businessName.toLowerCase().includes(search.toLowerCase()) ||
      op.tradingName.toLowerCase().includes(search.toLowerCase()) ||
      op.province.toLowerCase().includes(search.toLowerCase()) ||
      op.description.toLowerCase().includes(search.toLowerCase());

    const matchesProvince = selectedProvince === 'All' || op.province === selectedProvince;
    const matchesCategory = selectedCategory === 'All' || op.categoryId === selectedCategory;

    return isPubliclyVisible && matchesSearch && matchesProvince && matchesCategory;
  });

  return (
    <div id="public-tourism-portal" className="space-y-8 animate-in fade-in pb-12">
      {/* Hero Destination Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl min-h-[380px] flex flex-col justify-between p-6 sm:p-10 text-white">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-0" />

        {/* Top Tag */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Papua New Guinea Official Tourism Directory</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% PNG TPA Verified Operators</span>
          </div>
        </div>

        {/* Hero Title & Mission */}
        <div className="relative z-10 max-w-2xl my-auto py-6 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] leading-tight">
            Discover a Million Different Journeys
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Explore authentic Kokoda treks, untouched coral reefs in Kimbe Bay, vibrant tribal singsings in Mt Hagen, and certified eco-lodges across Papua New Guinea.
          </p>
        </div>

        {/* Integrated Search & Filter Island */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md text-slate-900 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/40">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-public-search"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Kokoda, diving, lodges, festivals..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-emerald-600 font-medium"
              />
            </div>

            {/* Province Selector */}
            <div className="sm:col-span-3">
              <select
                id="select-public-province"
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-emerald-600 font-medium"
              >
                <option value="All">All 22 Provinces</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="sm:col-span-2">
              <select
                id="select-public-category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-emerald-600 font-medium"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="sm:col-span-2 flex items-center gap-1">
              <button
                id="btn-public-grid-view"
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                id="btn-public-map-view"
                onClick={() => setViewMode('map')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>GIS Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Experiences ({publicOperators.length})
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Content Area: Map View OR Grid View */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold">
              Interactive National GIS Tourism Map • Click any pin to inspect operator credentials
            </span>
            <span className="font-mono">{publicOperators.length} Mapped Listings</span>
          </div>

          <LeafletMap
            operators={publicOperators}
            selectedOperator={profileOperator}
            onSelectOperator={op => setProfileOperator(op)}
            height="560px"
          />
        </div>
      ) : (
        /* Grid Cards View */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Showing <strong>{publicOperators.length}</strong> official verified tourism listings
            </span>
            {selectedProvince !== 'All' && (
              <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                Province: {selectedProvince}
              </span>
            )}
          </div>

          {publicOperators.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No tourism operators matched your criteria</h3>
              <p className="text-xs text-slate-400">Try clearing search keywords or selecting All Provinces</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicOperators.map(op => (
                <div
                  key={op.id}
                  id={`public-card-${op.id}`}
                  onClick={() => setProfileOperator(op)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Hero Photo & Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={op.heroImage}
                        alt={op.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          TPA Verified
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm text-amber-300 text-xs font-bold flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          {op.rating || 5.0}
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                          {op.categoryName || 'Tourism Experience'}
                        </span>
                        <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                          {op.businessName}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{op.district}, {op.province}</span>
                      </div>

                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{op.description}</p>

                      {op.features && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {op.features.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                    <span className="text-slate-500 font-medium">{op.priceRange || 'Contact for rates'}</span>
                    <button className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Public Operator Detail Profile Modal */}
      {profileOperator && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Hero Image */}
            <div className="relative h-64 w-full bg-slate-900 shrink-0">
              <img
                src={profileOperator.heroImage}
                alt={profileOperator.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setProfileOperator(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Official TPA Accredited Operator
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    ★ {profileOperator.rating || 5.0} Verified Reviews
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white font-['Outfit']">{profileOperator.businessName}</h2>
                <p className="text-xs text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{profileOperator.address || `${profileOperator.district}, ${profileOperator.province}`}</span>
                </p>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About This Experience</h3>
                <p className="text-slate-700 leading-relaxed text-sm">{profileOperator.description}</p>
              </div>

              {profileOperator.features && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Services & Amenities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {profileOperator.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Contact Details */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Verified TPA Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Contact Officer:</span>
                    <span className="font-bold text-slate-900">{profileOperator.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Official Phone:</span>
                    <span className="font-bold text-slate-900">{profileOperator.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Official Email:</span>
                    <span className="font-bold text-slate-900 truncate block">{profileOperator.email}</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Simulation */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Book or Inquire Directly</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Secure direct communication with verified operator</p>
                </div>

                <button
                  onClick={() => {
                    setBookingSent(true);
                    setTimeout(() => setBookingSent(false), 4000);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-colors shrink-0"
                >
                  {bookingSent ? '✓ Inquiry Sent to Operator!' : 'Send Direct Travel Inquiry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
