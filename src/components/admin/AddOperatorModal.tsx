/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Building2, MapPin, Mail, Phone, Globe, User, PlusCircle } from 'lucide-react';
import { TourismOperator, Province, TourismCategory } from '../../types';

interface AddOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TourismOperator>) => Promise<void>;
  provinces: Province[];
  categories: TourismCategory[];
}

export const AddOperatorModal: React.FC<AddOperatorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  provinces,
  categories
}) => {
  const [businessName, setBusinessName] = useState('PNG Paradise Tours Ltd');
  const [tradingName, setTradingName] = useState('PNG Paradise Adventures');
  const [operatorType, setOperatorType] = useState('Tour Operator & Expeditions');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-trekking');
  const [province, setProvince] = useState('National Capital District');
  const [district, setDistrict] = useState('Moresby South');
  const [address, setAddress] = useState('Harbourside West, Stanley Esplanade, Port Moresby');
  const [contactPerson, setContactPerson] = useState('John Wari');
  const [email, setEmail] = useState('info@pngparadisetours.com.pg');
  const [phone, setPhone] = useState('+675 321 4455');
  const [website, setWebsite] = useState('https://www.pngparadisetours.com.pg');
  const [description, setDescription] = useState(
    'Premier eco-adventure outfitter offering guided Kokoda Track treks, birding expeditions in Varirata National Park, and cultural excursions across Papua New Guinea.'
  );
  const [latitude, setLatitude] = useState('-9.4790');
  const [longitude, setLongitude] = useState('147.1494');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProvinceChange = (provName: string) => {
    setProvince(provName);
    const p = provinces.find(x => x.name === provName);
    if (p) {
      setLatitude(String(p.coordinates.lat));
      setLongitude(String(p.coordinates.lng));
      setDistrict(p.capital);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Business name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        businessName,
        tradingName: tradingName || businessName,
        operatorType,
        categoryId,
        province,
        district,
        address,
        contactPerson,
        email,
        phone,
        website,
        description,
        latitude: parseFloat(latitude) || -9.4438,
        longitude: parseFloat(longitude) || 147.1803,
        heroImage,
        registrationStatus: 'Draft',
        membershipStatus: 'None',
        licenseStatus: 'None',
        complianceStatus: 'Conditional'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create operator');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="add-operator-modal" className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Tourism Operator</h3>
              <p className="text-xs text-slate-300">National Tourism Registry Initial Enrolment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-add-op-modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Business Name *
              </label>
              <input
                id="input-op-business-name"
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. PNG Paradise Tours Ltd"
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trading / Brand Name
              </label>
              <input
                id="input-op-trading-name"
                type="text"
                value={tradingName}
                onChange={e => setTradingName(e.target.value)}
                placeholder="e.g. PNG Paradise Adventures"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tourism Category *
              </label>
              <select
                id="select-op-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operator Business Type
              </label>
              <input
                id="input-op-type"
                type="text"
                value={operatorType}
                onChange={e => setOperatorType(e.target.value)}
                placeholder="e.g. Tour Operator & Expeditions"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Province *
              </label>
              <select
                id="select-op-province"
                value={province}
                onChange={e => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 bg-white"
              >
                {provinces.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / Town
              </label>
              <input
                id="input-op-district"
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="e.g. Moresby South"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Location / Street Address
            </label>
            <input
              id="input-op-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. Suite 4B, Harbourside West, Stanley Esplanade"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                id="input-op-contact-person"
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="e.g. John Wari"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                id="input-op-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. info@pngparadisetours.com.pg"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                id="input-op-phone"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +675 321 4455"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude (GIS)</label>
              <input
                id="input-op-lat"
                type="text"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                placeholder="-9.4790"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude (GIS)</label>
              <input
                id="input-op-lng"
                type="text"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                placeholder="147.1494"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Public Description & Offerings
            </label>
            <textarea
              id="input-op-description"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Image URL</label>
            <input
              id="input-op-hero-image"
              type="text"
              value={heroImage}
              onChange={e => setHeroImage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-add-operator"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create in Registry (Draft)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
