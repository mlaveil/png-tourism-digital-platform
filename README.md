# Papua New Guinea Tourism Digital Platform (PNG TPA)
## Minimum Viable Product (MVP) Prototype

**Prepared for:** Papua New Guinea Tourism Promotion Authority (PNG TPA)  
**Date:** August 2026  
**Architecture:** Centralized Single Source-of-Truth Platform & Multi-Channel API  

---

## 1. Executive Overview

The **PNG Tourism Digital Platform** is an enterprise-grade prototype built to modernise and unify Papua New Guinea’s national tourism registry, statutory licensing, industry memberships, compliance assurance, and citizen/visitor distribution channels.

Rather than maintaining siloed websites and paper-based registries, all digital channels—**TPA Regulatory Administration**, **Tourism Operator Self-Service Portal**, **Public Tourism Web Directory**, **Provincial Tourism Bureaus**, **Airport Touch Kiosks**, and the **Mobile Super App**—consume the same underlying REST API and relational tourism data model.

---

## 2. Supported User Roles & Personas

Switch between personas dynamically using the top header role selector:

| Persona | Role | Organization / Title | Primary Capabilities |
|---|---|---|---|
| **Grace Pakur** | `staff` | Senior Registry & Compliance Officer, TPA | Enrol operators, review submissions, conduct compliance audits, update status. |
| **Markus Kaumu** | `admin` | Director of Policy & Licensing, TPA | Approve/reject registrations, issue official commercial operating licences, assess statutory sanctions. |
| **Elijah Vagi** | `operator` | Managing Director, Kokoda Trail Expeditions | Manage business listing, upload compliance renewals, display verified QR credentials. |
| **Sarah Jenkins** | `public` | International Tourist (Australia / Global) | Search verified tour operators, view interactive GIS maps, inspect certified credentials, send direct booking inquiries. |

---

## 3. Multi-Channel Experience

1. **TPA Regulatory Admin Portal (`/admin`)**
   - Platform analytics KPI metrics (Operators, Pending Queue, Active Licences, Compliance Rate).
   - National Tourism Registry table with multi-criteria filtering (Province, Category, Registration Status, Compliance Status) and CSV export.
   - Kanban and List workflow engine for registration applications.
   - Operating Licence and Membership registers.
   - Comprehensive 360° Operator Inspector with live statutory compliance calculation and immutable audit logging.

2. **Operator Self-Service Portal (`/operator`)**
   - Business profile management and public directory preview.
   - Live digital operating certificate with verifiable QR verification codes.
   - Document upload simulator for IPA registrations, liability insurance, and guide certifications.

3. **Public Tourism Directory (`/public`)**
   - High-impact destination portal with live OpenStreetMap/Leaflet integration.
   - Search by experience type (Trekking, Diving, Culture, Wildlife, Lodges) and province.
   - Public operator profiles showing verified credentials while keeping internal compliance audit notes private.

4. **Provincial Tourism Portal (`/province`)**
   - Dedicated views for all 22 Papua New Guinea provinces (East New Britain, National Capital District, Milne Bay, Morobe, Madang, Western Highlands, etc.).
   - Local economic and compliance statistics, provincial attractions, and targeted GIS mapping.

5. **Jacksons Airport Touch Kiosk (`/kiosk`)**
   - High-contrast touchscreen interface for arriving international visitors.
   - Rapid tactile filtering, offline-ready mapping, and mobile QR handoff.

6. **Official Mobile Super App (`/app`)**
   - Simulated smartphone experience with bottom navigation (Explore, GIS Map, Licences, Saved).

---

## 4. End-to-End Acceptance Test Walkthrough (Section 29)

Click the **"Demo Acceptance Scenario"** button in the top navigation to follow the interactive guide:

1. **Login as TPA Staff:** Select Grace Pakur (`staff`).
2. **Open Tourism Registry:** Go to the National Registry tab.
3. **Create Operator:** Click "Add Operator" and input `PNG Paradise Tours Ltd` in National Capital District.
4. **Submit Application:** Open the 360° Inspector, switch to the "Registration Workflow" tab, and submit the application.
5. **Switch to TPA Administrator:** Switch role to Markus Kaumu (`admin`).
6. **Review & Approve:** Review the application and click **Approve Application**, then **Finalize & Enrol in National Registry**.
7. **Issue Active Licences & Memberships:** In the same inspector, issue a *Standard Tourism Commercial Licence* and a *Tour Operator Corporate Membership*.
8. **Verify Compliance:** Switch to the "Compliance Engine" tab and ensure all statutory requirements (IPA, Insurance, Safety) are marked Compliant. The overall standing recalculates instantly to **COMPLIANT**.
9. **Verify Public Directory:** Switch channel to **Public Tourism Directory**. Search for `PNG Paradise Tours` and verify the verified operator card appears with its exact coordinates.
10. **Verify Provincial & Kiosk Channels:** Switch channel to **Provincial Portal** (NCD) and **Touch Kiosk Mode** to confirm the newly registered operator appears across all channels simultaneously.

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Leaflet Maps, Framer Motion.
- **Backend:** Node.js, Express REST API, in-memory relational store with audit trail engine.
- **Build System:** Vite 6 with tsx full-stack dev server and esbuild bundler.
