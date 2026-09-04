# Papua New Guinea Tourism Digital Platform (PNG TPA)

## National Tourism Platform Prototype

**Prepared for:** Papua New Guinea Tourism Promotion Authority (PNG TPA)  
**Status:** Demonstration prototype — not an official tourism registry  
**Architecture:** Centralized platform concept with multi-channel API  

> **DEMONSTRATION DATA — NOT AN OFFICIAL TOURISM REGISTRY**
>
> Operator records, licences, memberships, compliance results, ratings, statistics and other registry values in this prototype are synthetic demonstration data unless explicitly identified otherwise.

---

## 1. Product Vision

The PNG Tourism Digital Platform is a prototype for a future national tourism digital ecosystem connecting tourism discovery, industry administration and tourism intelligence.

The long-term product is organized around three connected pillars:

### Discover PNG

The public tourism experience for visitors and the tourism industry:

- Destinations
- Attractions
- Things to Do
- Experiences
- Events
- Accommodation
- Tourism Operators
- Interactive map discovery
- Trip planning

### Manage PNG Tourism

The institutional platform for TPA, provincial authorities and tourism operators:

- Operator registration
- Registration applications and workflows
- Membership
- Licensing
- Compliance
- Documents
- Provincial administration
- Audit and governance
- Notifications

### Understand PNG Tourism

The tourism intelligence layer:

- Registry and licensing metrics
- Geographic distribution
- Registration trends
- Compliance indicators
- Provincial activity
- Tourism opportunity analysis

These pillars should eventually operate from a shared authoritative data platform rather than independent applications.

---

## 2. Current Prototype Channels

The current prototype demonstrates six experience concepts:

1. **TPA Regulatory Admin Portal** — registry, workflow, licensing, membership, compliance and dashboard views.
2. **Tourism Operator Self-Service Portal** — business profile, documents and credential concepts.
3. **Public Tourism Web Portal** — tourism discovery, operator directory and GIS map.
4. **Provincial Tourism Portal** — province-oriented administration and discovery concepts.
5. **Touchscreen Kiosk** — visitor-facing airport/kiosk concept.
6. **Mobile Super App** — mobile visitor experience concept.

These channels currently use the prototype API and in-memory store. They are not yet a production national registry.

---

## 3. Domain Direction

The current prototype is operator-centric, but the national platform should treat tourism assets as first-class domain objects.

The target domain includes:

- Province
- Destination
- Attraction
- Experience
- Event
- Accommodation
- Tourism Operator
- Cultural Site
- Heritage Site
- Wildlife Site
- Trail
- Transport Service
- Community Tourism Project
- Travel Advisory
- Media Asset
- Itinerary

Authoritative regulatory records must remain separate from public editorial content and visitor-generated information such as reviews and ratings.

---

## 4. PNG Geography

The target platform is national in scope and should cover Papua New Guinea's provinces and National Capital District.

The current seed dataset is a demonstration subset and should not be represented as a complete official national tourism registry.

The intended geographic hierarchy is:

**PNG → Region → Province/NCD → Destination → Tourism Asset → Operator/Service**

Future production implementation should use authoritative geographic and tourism datasets rather than synthetic seed content.

---

## 5. Security and Authentication Boundary

Firebase authentication is present in the prototype, but the current demo role-switching mechanism is intentionally simplified for stakeholder demonstrations.

It must not be treated as production authorization.

Production implementation should:

- verify Firebase ID tokens server-side;
- derive the authenticated UID from the verified token;
- obtain roles and permissions from trusted server-side data;
- enforce authorization on the backend;
- never trust client-provided role/name headers for authorization;
- record authenticated UID and actor context in audit events.

---

## 6. Persistence Boundary

The current backend uses an in-memory store and resets to seed data on startup/reset.

For production, the intended architecture is:

**React web application → API/service layer → PostgreSQL → object storage/search/GIS/auth/analytics/notifications**

The in-memory store is retained because it makes the stakeholder demonstration portable and easy to reset.

---

## 7. Demonstration Walkthrough

The application includes a **Demo Acceptance Scenario** control in the header. It demonstrates the intended end-to-end relationship between:

1. TPA staff registration activity
2. Registration review
3. Administrative approval
4. Licence and membership concepts
5. Compliance assessment
6. Public operator discovery
7. Provincial visibility
8. Kiosk/mobile distribution

The walkthrough is a prototype demonstration, not a representation of a live statutory approval process.

---

## 8. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Leaflet.
- **Backend:** Node.js, Express REST API.
- **Prototype persistence:** In-memory relational-style store.
- **Authentication:** Firebase Authentication prototype integration.
- **Build:** Vite with TypeScript/tsx and esbuild.

---

## 9. Roadmap

### Phase 1 — Client Demonstration

- Public Discover PNG experience
- National geography structure
- Destination and tourism asset discovery
- Search and GIS exploration
- Operator profiles and verification presentation
- Accurate expiry indicators
- Demonstration-data safeguards
- Responsive/mobile polish
- Accessibility improvements

### Phase 2 — Platform Foundation

- PostgreSQL persistence
- Server-side authentication/RBAC
- Document and media storage
- Registration workflow engine
- Immutable audit architecture
- Notification service
- CMS/editorial workflow
- Search infrastructure

### Phase 3 — National Platform

- Complete authoritative geography
- Destinations and attractions
- Experiences and events
- Accommodation
- Cultural/heritage/wildlife assets
- Provincial portals
- GIS data services
- National tourism intelligence

### Phase 4 — Visitor Experience

- Trip planner
- Saved itineraries
- PWA/offline capability
- QR credential verification
- Near-me discovery
- Travel information
- Multilingual content
- AI tourism concierge

### Phase 5 — Ecosystem Integration

Potential future integrations include airlines, airports, accommodation, transport, booking services, provincial systems, maritime services, weather and other approved tourism ecosystem partners.

---

## 10. Important Prototype Limitation

This repository is a stakeholder prototype. It should not be deployed as a live government registry without implementing production authentication, authorization, persistent storage, data governance, audit controls, authoritative data sources, operational security, privacy controls and appropriate TPA governance.
