# AIIA TrialOrbit

**Real-Time Clinical Trial Management & Monitoring Platform**

1. [Overview](#1-overview)
2. [Smart India Hackathon Problem Statement](#2-smart-india-hackathon-problem-statement)
3. [Problem](#3-problem)
4. [Solution](#4-solution)
5. [Current Implementation Scope](#5-current-implementation-scope)
6. [User Roles](#6-user-roles)
7. [Implemented Modules](#7-implemented-modules)
8. [Dashboard & KPI](#8-dashboard--kpi)
9. [Clinical Safety & Regulatory Workflow](#9-clinical-safety--regulatory-workflow)
10. [Real-Time Architecture](#10-real-time-architecture)
11. [System Architecture](#11-system-architecture)
12. [Tech Stack](#12-tech-stack)
13. [Data Model](#13-data-model)
14. [Security](#14-security)
15. [Clinical/Regulatory Alignment](#15-clinicalregulatory-alignment)
16. [CDISC Status](#16-cdisc-status)
17. [FHIR Status](#17-fhir-status)
18. [AI/Intelligence Status](#18-aiintelligence-status)
19. [Testing](#19-testing)
20. [Current Database / Demo Data](#20-current-database--demo-data)
21. [Local Setup](#21-local-setup)
22. [Deployment](#22-deployment)
23. [Known Limitations](#23-known-limitations)
24. [Future Roadmap](#24-future-roadmap)
25. [Project Status](#25-project-status)

---

## 1. Overview
AIIA TrialOrbit is a centralized, role-based, real-time Clinical Trial Management System (CTMS) designed specifically for the clinical research environment of the All India Institute of Ayurveda (AIIA). It serves as a unified digital platform for tracking multi-site trials, participant recruitment, data quality, ethics compliance, and pharmacovigilance.

## 2. Smart India Hackathon Problem Statement
**Problem Statement ID:** 26046 (Ministry of Ayush / All India Institute of Ayurveda)
**Theme:** MedTech / BioTech / HealthTech

## 3. Problem
Clinical research tracking typically relies on disconnected legacy systems, flat files, or manual spreadsheets. This fragmentation leads to delayed regulatory reporting, missed safety deadlines, opaque multi-site recruitment progress, and difficulty enforcing role-based clinical protocols. 

## 4. Solution
TrialOrbit solves this by providing a unified CTMS workflow with strict 7-role Role-Based Access Control (RBAC), real-time data synchronization via Socket.IO, and built-in regulatory countdown timers for Pharmacovigilance (e.g., automated 24-hour SAE deadlines). It acts as a single pane of glass for clinical oversight.

## 5. Current Implementation Scope
The current repository represents the functional prototype and architectural foundation for SIH 2026. The core CTMS workflow, real-time alerts, safety monitoring, and dashboard features are **verified and active** in the code. Interoperability features (CDISC/FHIR/AI) exist as foundational prototypes/data mapping endpoints.

## 6. User Roles
The system rigidly enforces 7 hierarchical roles at the Express API layer via JWT/RBAC middleware:

| Role | Purpose | Status |
|---|---|---|
| **ADMIN** | Institutional oversight & User management | ✅ IMPLEMENTED |
| **PI** | Principal Investigator (Study-level oversight) | ✅ IMPLEMENTED |
| **COORDINATOR** | Site-level operations & Participant tracking | ✅ IMPLEMENTED |
| **MONITOR** | Source Data Verification (SDV), Query management | ✅ IMPLEMENTED |
| **ETHICS** | Institutional Ethics Committee (IEC) review | ✅ IMPLEMENTED |
| **PHARMACOVIGILANCE** | AE/ADR/SAE tracking & reporting deadlines | ✅ IMPLEMENTED |
| **REGULATOR** | Read-only compliance & milestone observation | ✅ IMPLEMENTED |

*(Note: No arbitrary "User", "Doctor", or "Superadmin" roles exist in the code outside of these 7 strict scopes).*

## 7. Implemented Modules

| Module | Status | Details |
|---|---|---|
| **Authentication** | ✅ IMPLEMENTED | JWT, JTI, Redis token blacklist on logout |
| **Study & Site Management** | ✅ IMPLEMENTED | Multi-site hierarchical tracking |
| **Participant Management** | ✅ IMPLEMENTED | Enrollment, Consent tracking, Visit scheduling |
| **Data Queries & Deviations** | ✅ IMPLEMENTED | Discrepancy management & Protocol Deviation logging |
| **Pharmacovigilance (PV)** | ✅ IMPLEMENTED | AE/ADR/SAE workflows with severity & seriousness tracking |
| **Real-Time Alerts** | ✅ IMPLEMENTED | Socket.IO event emission coupled with Redis |
| **Audit Logging** | ✅ IMPLEMENTED | Tracking user actions and mutations |

## 8. Dashboard & KPI
Role-specific React dashboards are implemented and hydrated by the `dashboard.service.js` analytics engine.
**Implemented KPIs Include:** Active Studies, Total Sites, Enrolled Participants, Open Queries, Open Deviations, Active Alerts, Total SAEs, and Overdue SAE Reports. 
Widgets dynamically render based on the authenticated user's exact scope (e.g., PI sees their study, Coordinator sees their site).

## 9. Clinical Safety & Regulatory Workflow
**Verified and Active:**
- Adverse Event (AE) Logging
- Serious Adverse Event (SAE) Logging
- Automated 24-Hour Reporting Due Date generation for SERIOUS events (`safety.service.js`).
- PV Officer Review workflow.

## 10. Real-Time Architecture
**Implemented:** `Socket.IO` is integrated deeply into the Mongoose controller/service layer. When a data query is raised or a safety event is logged, an alert is saved to MongoDB and instantly emitted via WebSockets to authorized client rooms (e.g., `room:studyId` or `room:role:MONITOR`), enabling live dashboard updates without polling.

## 11. System Architecture
The application uses a separated client-server model:
- **Frontend:** React SPA consuming REST APIs and listening to WebSockets.
- **Backend:** Node.js API acting as the security and business logic gateway.
- **Database:** MongoDB acts as the absolute source of truth.
- **Cache/Layer:** Redis operates solely for rate-limiting and immediate JWT blacklisting.

## 12. Tech Stack
*(Derived directly from `package.json`)*
- **Frontend:** React (v19), Vite (v8), React Router (v7), Axios, GSAP, Recharts, Socket.IO Client.
- **Backend:** Node.js, Express (v5), Mongoose (v9), Joi, Socket.IO (v4), Redis (v6), JsonWebToken, Node-Cron, Helmet.
- **Testing:** Playwright (E2E), Jest (Backend).

## 13. 🗄️ Data Model

*Simplified Entity Relationship Mapping.*

![Entity Relationship Mapping](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBVW1VzZXJdIC0tPiBTW1N0dWR5XVxuICAgIFMgLS0+IFNJW1NpdGVdXG4gICAgUyAtLT4gUk1bUmVndWxhdG9yeSBNaWxlc3RvbmVdXG4gICAgU0kgLS0+IFBbUGFydGljaXBhbnRdXG4gICAgUCAtLT4gQ1tDb25zZW50XVxuICAgIFAgLS0+IFZbVmlzaXRdXG4gICAgUCAtLT4gRFFbRGF0YSBRdWVyeV1cbiAgICBQIC0tPiBQRFtQcm90b2NvbCBEZXZpYXRpb25dXG4gICAgUCAtLT4gQUVbQWR2ZXJzZSBFdmVudCAvIFNBRV0iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9fQ==)

**Key Collections:**
`Users`, `Studies`, `Sites`, `Participants`, `Visits`, `AdverseEvents`, `Alerts`, `DataQueries`, `ProtocolDeviations`, `AuditLogs`, `RegulatoryMilestones`, `Consents`.

## 14. Security
**Implemented Controls:**
- JWT-based authentication with explicit `jti` invalidation using a Redis Blacklist.
- 7-Role RBAC enforced globally on API endpoints.
- IDOR Protection: Database queries in services explicitly scope to `userId`, `siteId`, or `studyId` based on the requester's authority.
- `helmet` HTTP header protections and CORS.
- `rate-limit-redis` brute force protection.

## 15. Clinical/Regulatory Alignment
The prototype incorporates principles from GCP-ASU and NDCT Rules 2019 natively into its logic (e.g., distinct Ethics and PV roles, SAE countdown timers). 
*Note: The platform is a hackathon prototype and has not been formally audited or certified by CDSCO or the FDA.*

## 16. CDISC Status
⚠️ **PROTOTYPE / ARCHITECTURAL FOUNDATION**
The `export.service.js` module provides a foundational prototype mapping MongoDB documents into representative JSON arrays mimicking SDTM (DM, DS, AE, SV) and ADaM (ADSL) structures. CDISC — Partial / Foundational.

## 17. FHIR Status
⚠️ **PROTOTYPE / ARCHITECTURAL FOUNDATION**
The system implements a prototype FHIR R4 export mapping inside `export.service.js` (transforming internal models to `Patient`, `ResearchStudy`, `Encounter`). Live interoperability data transmission to an external EHR is not implemented.

## 18. AI/Intelligence Status
🟡 **ARCHITECTURAL FOUNDATION**
The `ai.service.js` module currently returns fallback analytics data (KPI calculations, recruitment risk math, zero-recruitment site anomaly detection). True LLM/Generative inference execution is not implemented in the current codebase.

## 19. Testing
Testing verified against current source code execution:
- **Backend (Jest):** `123 / 123` Tests Passed (100% Core Suite Success).
- **Frontend (Playwright):** `44 / 44` UI/RBAC Tests Passed across Desktop & Mobile viewports.
- **Responsive Integrity:** Verified down to `320px` width.

## 20. Current Database / Demo Data
The application connects to a MongoDB database pre-seeded with synthetic, de-identified demonstration data intended purely for SIH software testing. 
*Do not treat any dashboard statistics as real patient data.*

## 21. Local Setup
*(Requires Node.js 18+, MongoDB instance, Redis Server)*

**1. Clone the repository.**
**2. Configure Backend:**
Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aiia_trialorbit
JWT_SECRET=local_development_secret
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
```
```bash
cd backend
npm install
npm run seed  # Generates demo data
npm run dev
```
**3. Configure Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 22. Deployment
- **CURRENT DEPLOYMENT:** Configurable for standard cloud platforms.
- **PLANNED DEPLOYMENT:** Frontend (Vercel), Backend (Render/AWS), Database (MongoDB Atlas), Cache (Redis Cloud).
*(Production secrets and credentials are never stored in the repository.)*

## 23. Known Limitations
- **External Integration:** Live webhook connections to external hospital EMRs are not implemented.
- **Dictionary Lookups:** MedDRA and WHO Drug dictionaries are not loaded into the database due to licensing restrictions; fields rely on manual text inputs.
- **Compliance:** This is a software prototype and requires third-party penetration testing, DPDP Act compliance review, and institutional governance approval before managing real Protected Health Information (PHI).

## 24. Future Roadmap
- **Phase 1 (Current):** Unified CTMS, RBAC, Real-Time Safety & Alert Workflows.
- **Phase 2:** Advanced live EHR Integration via FHIR/ABDM.
- **Phase 3:** Fully validated CDISC XML Export Engine.
- **Phase 4:** Production deployment and security hardening.

## 25. Project Status
**COMPLETED FOR SIH 2026**
The repository is fully stabilized and passes all end-to-end integration verifications.