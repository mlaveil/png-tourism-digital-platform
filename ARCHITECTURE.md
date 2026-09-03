# Papua New Guinea Tourism Digital Platform
## Technical Architecture & Single-Source-of-Truth Specification

**Document Version:** 1.0 (MVP Prototype)  
**Authority:** Papua New Guinea Tourism Promotion Authority (PNG TPA)  
**System Architecture:** Centralized Platform API with Multi-Channel Consumption  

---

## 1. Architectural Philosophy: The Single Source of Truth

The core architectural requirement mandated by the PNG TPA Source Document is that **no front-end channel operates on an isolated or mocked dataset**. 

All user interfaces:
- TPA Regulatory Admin Portal (`/admin`)
- Operator Self-Service Portal (`/operator`)
- Public Tourism Directory (`/public`)
- Provincial Tourism Bureau Portals (`/province`)
- Jacksons Airport Touch Kiosk (`/kiosk`)
- Official Mobile Super App (`/app`)

communicate directly with the central **Platform REST API** (`/api/*`) and query the unified **Tourism Data Store**. When a TPA administrator approves a registration, updates a compliance requirement, or issues a licence in Port Moresby, that state is immediately reflected on public search indexes, provincial dashboards, and visitor airport kiosks.

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 PNG TPA CENTRAL PLATFORM                │
                  │             REST API Layer (Express / Node)             │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    ▼                                                     ▼
      ┌───────────────────────────┐                         ┌───────────────────────────┐
      │  Administrative Services  │                         │     Public Services       │
      │  • Operator Registration  │                         │  • GIS & Spatial Queries  │
      │  • Licensing Subsystem    │                         │  • Certified Directory    │
      │  • Membership Subsystem   │                         │  • Experience Categories  │
      │  • Compliance Engine      │                         │  • Verified Verification  │
      │  • Immutable Audit Trail  │                         │  • Provincial Aggregations│
      └─────────────┬─────────────┘                         └─────────────┬─────────────┘
                    │                                                     │
    ┌───────────────┴───────────────┐                     ┌───────────────┴───────────────┐
    ▼                               ▼                     ▼                               ▼
┌──────────────┐            ┌──────────────┐      ┌──────────────┐                ┌──────────────┐
│  TPA Staff   │            │   Operator   │      │ Public Web & │                │ Touch Kiosks │
│ Admin Portal │            │ Self-Service │      │  Mobile App  │                │  & Provinces │
└──────────────┘            └──────────────┘      └──────────────┘                └──────────────┘
```

---

## 2. Relational Domain Entity Model

The relational architecture supports the five statutory pillars of PNG tourism regulation:

### 1. TourismOperator (Core Entity)
Represents a commercial tourism enterprise in Papua New Guinea.
- `id`: Unique identifier (`OP-001`, `OP-002`, etc.)
- `businessName`, `tradingName`, `operatorType`, `categoryId`
- `province`, `district`, `address`, `latitude`, `longitude`
- `contactPerson`, `email`, `phone`, `website`, `description`, `heroImage`
- `registrationStatus`: Enum (`Draft` | `Submitted` | `Under Review` | `Approved` | `Registered` | `Rejected` | `Suspended`)
- `membershipStatus`: Enum (`Active` | `Pending` | `Expired` | `Suspended` | `None`)
- `licenseStatus`: Enum (`Active` | `Pending` | `Expired` | `Suspended` | `Cancelled` | `None`)
- `complianceStatus`: Enum (`Compliant` | `Conditional` | `Non-Compliant`)

### 2. RegistrationApplication (Workflow Entity)
Tracks statutory enrollment lifecycle.
- `id`, `operatorId`, `applicationNumber`, `submittedDate`
- `status`, `reviewer`, `reviewerNotes`, `approvalDate`
- `history`: Array of state transitions `[{ fromStatus, toStatus, timestamp, actor, role, notes }]`

### 3. LicenseRecord (Statutory Permit)
Operating authority under the PNG Tourism Promotion Authority Act.
- `id`, `operatorId`, `licenseNumber`, `licenseType`, `issueDate`, `expiryDate`
- `status`: (`Active` | `Pending` | `Expired` | `Suspended` | `Cancelled`)
- `conditions`: String array of specific statutory requirements

### 4. MembershipRecord (Industry Association)
Association affiliation and annual subscription tier.
- `id`, `operatorId`, `membershipNumber`, `membershipType`, `feePaid`, `issueDate`, `expiryDate`
- `status`: (`Active` | `Pending` | `Expired` | `Suspended`)

### 5. OperatorCompliance (Regulatory Engine)
Automated multi-factor compliance aggregator.
- `operatorId`, `overallStatus`, `lastAssessedDate`
- `requirements`: Array of statutory checklist items:
  - IPA Business / Company Registration
  - PNG Tourism Operating Licence
  - Public Liability & Marine Insurance
  - Guide & Wilderness First Aid Safety Certification
  - IRC Tax Clearance
  - Conservation & Environmental Return

---

## 3. Role-Based Access Control (RBAC) & Security Boundaries

| Operation | `admin` | `staff` | `operator` | `public` |
|---|:---:|:---:|:---:|:---:|
| View Public Registry & Map | Yes | Yes | Yes | Yes |
| View Operator Contact Information | Yes | Yes | Yes | Yes |
| View Internal Compliance Audit Notes | Yes | Yes | Self Only | No |
| Enrol Draft Operator | Yes | Yes | Yes | No |
| Submit Registration Application | Yes | Yes | Self Only | No |
| Change Status to `Under Review` | Yes | Yes | No | No |
| Approve / Reject Application | Yes | No (Admin only) | No | No |
| Issue / Cancel Licences | Yes | Yes (Staff/Admin) | No | No |
| Toggle Compliance Checklist Item | Yes | Yes | No (Upload only) | No |
| View Full System Audit Trail | Yes | Yes | No | No |

---

## 4. API Endpoints Catalog

- `GET /api/operators`: Returns all operators (with filtering by province, category, status, compliance).
- `GET /api/operators/:id`: Returns detailed single operator record.
- `POST /api/operators`: Enrols a new operator in the Registry.
- `PUT /api/operators/:id`: Updates an operator record.
- `GET /api/registrations`: Returns all registration workflow records.
- `POST /api/registrations`: Creates a new registration application.
- `PUT /api/registrations/:id/status`: Transitions registration workflow state.
- `GET /api/licenses`: Returns operating licence register.
- `POST /api/licenses`: Issues a new licence.
- `PUT /api/licenses/:id/status`: Updates licence status (Activate, Suspend, Cancel).
- `GET /api/memberships`: Returns industry membership roster.
- `POST /api/memberships`: Creates a membership record.
- `PUT /api/memberships/:id/status`: Updates membership status.
- `GET /api/compliance/:operatorId`: Fetches compliance scorecard for operator.
- `PUT /api/compliance/:operatorId/requirements/:requirementId`: Updates a statutory requirement and recalculates overall standing.
- `GET /api/audit-logs`: Fetches system audit trail.
- `GET /api/dashboard`: Fetches platform KPI metrics and provincial distributions.
- `POST /api/reset-seed`: Resets platform database to pristine demonstration seed.
