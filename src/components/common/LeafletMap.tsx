/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TourismOperator } from '../../types';

interface LeafletMapProps {
  operators: TourismOperator[];
  selectedOperator?: TourismOperator | null;
  onSelectOperator?: (operator: TourismOperator) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  id?: string;
  showLegend?: boolean;
}

function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  operators,
  selectedOperator,
  onSelectOperator,
  center = [-6.314993, 147.2798] as [number, number],
  zoom = 6,
  height = '500px',
  className = '',
  id = 'tourism-leaflet-map',
  showLegend = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center[0], center[1]] as L.LatLngTuple,
        zoom,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | PNG TPA GIS',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance or destroy on unmount
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Update Markers & Hover Preview Cards
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    operators.forEach(op => {
      if (!op.latitude || !op.longitude) return;

      const isSelected = selectedOperator?.id === op.id;

      // Color based on compliance standing
      let markerBg = '#00472F'; // TPA Deep Green
      let markerBorder = '#ffffff';
      let complianceBadgeBg = '#ecfdf5';
      let complianceBadgeText = '#065f46';
      let complianceBadgeBorder = '#a7f3d0';
      let complianceIconSymbol = '✓';

      if (op.complianceStatus === 'Conditional') {
        markerBg = '#d97706'; // Amber
        complianceBadgeBg = '#fffbeb';
        complianceBadgeText = '#92400e';
        complianceBadgeBorder = '#fde68a';
        complianceIconSymbol = '⚠';
      } else if (op.complianceStatus === 'Non-Compliant') {
        markerBg = '#e11d48'; // Crimson Rose
        complianceBadgeBg = '#fff1f2';
        complianceBadgeText = '#9f1239';
        complianceBadgeBorder = '#fecdd3';
        complianceIconSymbol = '✕';
      } else {
        // Compliant
        markerBg = '#059669'; // Emerald
        complianceBadgeBg = '#ecfdf5';
        complianceBadgeText = '#065f46';
        complianceBadgeBorder = '#a7f3d0';
        complianceIconSymbol = '✓';
      }

      if (isSelected) {
        markerBorder = '#D9A100'; // Gold border when active
      }

      const markerSize = isSelected ? 38 : 30;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-tpa-marker',
        html: `
          <div style="
            background-color: ${markerBg};
            width: ${markerSize}px;
            height: ${markerSize}px;
            border-radius: 50%;
            border: ${isSelected ? '3.5px solid #D9A100' : '2.5px solid #ffffff'};
            box-shadow: ${isSelected ? '0 0 0 4px rgba(217, 161, 0, 0.4), 0 8px 16px rgba(0,0,0,0.35)' : '0 4px 10px rgba(0,0,0,0.25)'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: ${isSelected ? '12px' : '10px'};
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          ">
            <svg width="${isSelected ? '16' : '13'}" height="${isSelected ? '16' : '13'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -(markerSize / 2 + 4)]
      });

      const marker = L.marker([op.latitude, op.longitude], { icon: customIcon });

      // 1. Hover-state Preview Card (Tooltip)
      const businessTypeLabel = op.operatorType || op.categoryName || 'Tourism Operator';
      const tooltipHtml = `
        <div class="tpa-preview-card" style="
          width: 260px;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.2), 0 6px 12px -4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        ">
          <!-- Top Bar: Business Type & ID -->
          <div style="
            background: #00472F;
            padding: 7px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #D9A100;
          ">
            <span style="
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #F3BA2F;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 170px;
            ">
              ${escapeHtml(businessTypeLabel)}
            </span>
            <span style="
              font-size: 9px;
              font-family: monospace;
              color: #a7f3d0;
              font-weight: 700;
            ">
              ${escapeHtml(op.id)}
            </span>
          </div>

          <!-- Body Info -->
          <div style="padding: 10px 12px;">
            <h4 style="
              margin: 0 0 6px 0;
              font-size: 13px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.25;
              font-family: 'Outfit', sans-serif;
            ">
              ${escapeHtml(op.businessName)}
            </h4>

            <!-- Badges Row: Business Type / Category & Overall Compliance Status -->
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
              <!-- Overall Compliance Status Badge -->
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 3px;
                font-size: 10px;
                font-weight: 700;
                padding: 2.5px 7px;
                border-radius: 6px;
                background: ${complianceBadgeBg};
                color: ${complianceBadgeText};
                border: 1px solid ${complianceBadgeBorder};
              ">
                <span>${complianceIconSymbol}</span>
                <span>${escapeHtml(op.complianceStatus)}</span>
              </span>

              <!-- Registration Status Badge -->
              <span style="
                display: inline-flex;
                align-items: center;
                font-size: 10px;
                font-weight: 600;
                padding: 2.5px 6px;
                border-radius: 6px;
                background: #f8fafc;
                color: #475569;
                border: 1px solid #e2e8f0;
              ">
                ${escapeHtml(op.registrationStatus)}
              </span>
            </div>

            <!-- Location -->
            <div style="
              font-size: 11px;
              color: #475569;
              display: flex;
              align-items: center;
              gap: 4px;
              margin-bottom: 6px;
            ">
              <span style="color: #00472F; font-size: 12px;">📍</span>
              <span style="font-weight: 600;">${escapeHtml(op.district)}, ${escapeHtml(op.province)}</span>
            </div>

            <!-- Bottom Row -->
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 11px;
              padding-top: 6px;
              border-top: 1px solid #f1f5f9;
            ">
              <span style="font-weight: 700; color: #d97706;">★ ${op.rating || 5.0}</span>
              <span style="font-size: 10px; font-weight: 700; color: #00472F; text-decoration: underline;">
                Click for 360° details →
              </span>
            </div>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipHtml, {
        direction: 'top',
        offset: [0, -(markerSize / 2 + 6)],
        className: 'leaflet-tooltip-tpa',
        opacity: 1,
        sticky: false
      });

      // 2. Click Popup with Image and Action
      const popupHtml = `
        <div style="width: 250px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <img src="${op.heroImage}" alt="${escapeHtml(op.businessName)}" style="width: 100%; height: 115px; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px;" />
          <div style="padding: 10px 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #00472F;">${escapeHtml(businessTypeLabel)}</span>
              <span style="font-size: 9px; font-weight: 700; padding: 1.5px 5px; border-radius: 4px; background: ${complianceBadgeBg}; color: ${complianceBadgeText}; border: 1px solid ${complianceBadgeBorder};">
                ${complianceIconSymbol} ${escapeHtml(op.complianceStatus)}
              </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3; font-family: 'Outfit', sans-serif;">${escapeHtml(op.businessName)}</h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">📍 ${escapeHtml(op.district)}, ${escapeHtml(op.province)}</p>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f1f5f9;">
              <span style="font-size: 11px; font-weight: 700; color: #059669;">★ ${op.rating || 5.0}</span>
              <button id="btn-popup-${op.id}" style="
                background: #00472F;
                color: #ffffff;
                border: 1px solid #D9A100;
                padding: 4px 10px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
              ">View Inspector</button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${op.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectOperator) onSelectOperator(op);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectOperator) onSelectOperator(op);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
      bounds.extend([op.latitude, op.longitude]);
    });

    if (selectedOperator?.latitude && selectedOperator?.longitude) {
      map.setView([selectedOperator.latitude, selectedOperator.longitude], 10, { animate: true });
    }
  }, [operators, selectedOperator]);

  return (
    <div
      id={id}
      className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Right Active Count Pill */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm z-[500] text-xs font-semibold text-slate-800 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00472F] animate-pulse"></span>
        <span>{operators.length} Mapped Operators</span>
      </div>

      {/* Bottom Left Compliance Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md z-[500] text-[11px] font-medium text-slate-700 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Compliance Map Legend
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span className="font-semibold text-slate-800">Compliant</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="font-semibold text-slate-800">Conditional</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="font-semibold text-slate-800">Non-Compliant</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Hover marker for business type & status</p>
        </div>
      )}
    </div>
  );
};
