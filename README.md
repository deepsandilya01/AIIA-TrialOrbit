# AIIA TrialOrbit

AIIA TrialOrbit is a centralized, role-based, real-time Clinical Trial Management System (CTMS) designed specifically for the clinical research environment of the All India Institute of Ayurveda (AIIA). It serves as a unified digital platform for tracking multi-site trials, participant recruitment, data quality, ethics compliance, and pharmacovigilance.

## Problem Statement
SIH 2026 PS 26046 (Ministry of Ayush / All India Institute of Ayurveda)

## What the Platform Does
TrialOrbit solves the fragmentation of clinical research tracking by providing a unified CTMS workflow with strict 7-role Role-Based Access Control (RBAC), real-time data synchronization via Socket.IO, and built-in regulatory countdown timers for Pharmacovigilance (e.g., automated 24-hour SAE deadlines). It acts as a single pane of glass for clinical oversight.

## Core Features
- Multi-site hierarchical study tracking
- Participant enrollment, consent tracking, and visit scheduling
- Discrepancy management & Protocol Deviation logging
- Real-Time Alerts via Socket.IO event emission
- Audit Logging for user actions and mutations

## User Roles
The system rigidly enforces 7 hierarchical roles at the Express API layer via JWT/RBAC middleware:
- **ADMIN**: Institutional oversight & User management
- **PI**: Principal Investigator (Study-level oversight)
- **COORDINATOR**: Site-level operations & Participant tracking
- **MONITOR**: Source Data Verification (SDV), Query management
- **ETHICS**: Institutional Ethics Committee (IEC) review
- **PHARMACOVIGILANCE**: AE/ADR/SAE tracking & reporting deadlines
- **REGULATOR**: Read-only compliance & milestone observation

## Architecture
Frontend:
React
Vite
React Router
Tailwind CSS
GSAP
Recharts

Backend:
Node.js
Express
MongoDB / Mongoose
Redis
Socket.IO

Real-time:
Socket.IO

AI:
Mistral / OpenAI abstraction (with deterministic risk engine fallback)

Security:
JWT
RBAC
Scope enforcement
Audit trail

Interoperability:
FHIR (Foundational prototype)
CDISC (Foundational prototype)

## Technology Stack
- **Frontend:** React (v19), Vite (v8), Tailwind CSS, GSAP
- **Backend:** Node.js, Express (v5), Mongoose (v9), Socket.IO (v4), Redis (v6)

## System Architecture
Frontend (React SPA)
↓
API Gateway (Express Router)
↓
Controller Layer
↓
Service Layer (Business Logic & AI/Export integrations)
↓
Repository / Data Models
↓
MongoDB (Source of Truth)
(Supported by Redis for token caching and Socket.IO for real-time emissions)

## Clinical Trial Lifecycle
1. Study Creation
2. Regulatory / Ethics Approvals
3. Site Setup
4. Participant Screening & Consent
5. Enrollment
6. Visits & CRF Tracking
7. Data Queries & Protocol Deviations
8. Safety Events (AE/SAE)
9. Regulatory Milestones
10. Monitoring
11. Reporting / Export
12. Closeout

## AI Intelligence
The AI service integrates a real-time Deterministic Risk Engine that computes live risks across 6 domains (Enrollment, Sites, Data Quality, Deviations, Safety, Regulatory). If enabled, it connects to Mistral AI / OpenAI to provide a natural language summary, key drivers, and recommended actions. It features strict IDOR security, RBAC checks, and does not perform medical diagnoses—serving solely as operational intelligence.

## Pharmacovigilance
Includes Adverse Event (AE) and Serious Adverse Event (SAE) workflows. Serious events trigger automated 24-Hour Reporting Due Date generation, routing directly to the PHARMACOVIGILANCE officer for review and compliance oversight.

## Compliance & Regulatory
The prototype incorporates principles from GCP-ASU and NDCT Rules 2019. It tracks institutional ethics committee (IEC) milestones, CTRI registration status, and ensures real-time compliance alerting. The REGULATOR role guarantees complete read-only transparency.

## Exports
- **FHIR**: Foundational prototype mapping internal models to FHIR R4 (`Patient`, `ResearchStudy`, `Encounter`).
- **CDISC**: Foundational prototype mapping MongoDB documents into representative JSON mimicking SDTM (DM, DS, AE, SV) and ADaM (ADSL) structures.
- **Custom Reports**: Native JSON/CSV representations of platform data.

## Security
- JWT-based authentication with explicit token invalidation using a Redis Blacklist.
- 7-Role RBAC enforced globally on API endpoints.
- IDOR Protection: Database queries strictly scoped to user authority (`userId`, `siteId`, `studyId`).
- Comprehensive Audit Trail logging critical mutations.

## Installation
```bash
npm install
```
(Run within `frontend` and `backend` directories respectively).

## Environment Variables
Names only (refer to `.env.example` in `backend`):
**Backend:**
`PORT`
`MONGODB_URI`
`JWT_SECRET`
`REDIS_URL`
`CLIENT_URL`
`AI_ENABLED`
`AI_PROVIDER`
`AI_MODEL`
`AI_API_KEY`

**Frontend (Vercel Production Variables):**
`VITE_API_URL`
`VITE_SOCKET_URL`

## Running Locally
**Backend command:**
```bash
cd backend
npm run dev
```
**Frontend command:**
```bash
cd frontend
npm run dev
```
**Database requirements:** MongoDB (local or Atlas) and Redis server running.

## Testing
**Backend:**
22 suites / 150 tests passed

**Playwright:**
57 passed / 1 skipped / 0 failed

## Build
```bash
cd frontend
npm run build
```

## Deployment
Configurable for standard cloud platforms: Frontend (Vercel/Netlify), Backend (Render/AWS), Database (MongoDB Atlas), Cache (Redis Cloud).

## Project Structure
```
AIIA-TrialOrbit/
├── backend/
│   ├── src/ (Controllers, Services, Models, Routes, Sockets)
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/ (Components, Features, Contexts)
│   ├── e2e/ (Playwright Tests)
│   └── package.json
├── guide/
│   └── (Documentation)
└── README.md
```

## Limitations
- **External Integration:** Live webhook connections to external hospital EMRs are not implemented.
- **Recruitment Trends:** Recruitment trend charts currently use participant creation timestamp as a proxy for enrollment date.
- **Missing Protocol Metrics:** Active in Protocol and Recruitment Lag are currently unavailable in MVP dashboard metrics.
- **Dictionary Lookups:** MedDRA and WHO Drug dictionaries are not loaded into the database due to licensing restrictions.
- **Interoperability Scope:** FHIR and CDISC features are foundational prototypes rather than complete enterprise implementations.

## Future Roadmap
- **Phase 1 (Current):** Unified CTMS, RBAC, Real-Time Safety & Alert Workflows.
- **Phase 2:** Advanced live EHR Integration via FHIR/ABDM.
- **Phase 3:** Fully validated CDISC XML Export Engine.
- **Phase 4:** Production deployment and security hardening.

## Team
Team AsyncOrbit
