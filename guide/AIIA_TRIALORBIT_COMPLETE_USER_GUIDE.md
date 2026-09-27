# AIIA TRIALORBIT — COMPLETE USER GUIDE

Welcome to the ultimate user manual for **AIIA TrialOrbit**. Ye guide specifically un logo ke liye banayi gayi hai jo system ko pehli baar use kar rahe hain. Is guide me har cheez ko simple bhasha (English + easy Hinglish) me explain kiya gaya hai.

---

## 1. What is AIIA TrialOrbit?

**AIIA TrialOrbit is a Clinical Trial Management System (CTMS).**

Ye ek central website hai jahan clinical-trial ki important information ek hi jagah manage aur track ki jati hai, jaise:
- Studies
- Sites
- Participants
- Consent
- Recruitment
- Visits
- Data Queries
- Protocol Deviations
- Regulatory / Ethics
- Pharmacovigilance / AE / SAE
- Alerts
- Reports

*(Note: System me wahi modules dikhte hain jo actual me implement kiye gaye hain)*

---

## 2. Who Uses the Website? (The 7 Roles)

Website me exactly **7 application login roles** hain:

1. **ADMIN**
   - System/institution administration.
   - User management and administrative functions actually available in the system.
2. **PI (Principal Investigator)**
   - Study/clinical oversight.
   - Can monitor overall study progress, recruitment, and safety for assigned studies.
3. **COORDINATOR (Study Coordinator)**
   - Ground-level clinical operations.
   - Handles participant management, consent, visits, and operational data workflows actually available.
4. **MONITOR (Clinical Monitor / CRA)**
   - Quality control and monitoring.
   - Raises data queries, checks deviations, and performs data-quality workflows actually available.
5. **ETHICS (Ethics Committee)**
   - Regulatory and safety compliance.
   - Performs ethics/regulatory review functions actually available.
6. **PHARMACOVIGILANCE (PV Officer)**
   - Patient safety oversight.
   - Manages AE/SAE classification and safety workflows actually available.
7. **REGULATOR**
   - Regulatory/read-only oversight.
   - **Mutation/edit actions must not be available.** They only review compliance and audit information.

---

## 3. Authentication vs Authorization

**Authentication = "Who are you?"**
- User apne registered credentials se login karta hai.
- Backend verify karta hai ki details sahi hain ya nahi.
- Successful login ek secure session/JWT flow create karta hai jisse aap website use kar pate hain.

**Authorization = "What are you allowed to do?"**
- Login ke baad, Role-Based Access Control (RBAC) decide karta hai ki aap kya dekh sakte hain aur kya actions perform kar sakte hain.
- **Frontend permissions** check aapke UI experience ko better banati hain (jaise buttons chupana), but **backend authorization** asli security boundary hai jo invalid requests block karti hai.

---

## 4. Role × Feature Matrix

| Module / Feature | ADMIN | PI | COORDINATOR | MONITOR | ETHICS | PV | REGULATOR |
|---|---|---|---|---|---|---|---|
| **Dashboard** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | R |
| **Users** | ✓ | — | — | — | — | — | — |
| **Studies** | ✓ | ✓ | R | R | R | R | R |
| **Sites** | ✓ | R | R | R | R | R | R |
| **Participants** | ✓ | R | ✓ | R | R | R | R |
| **Consent** | ✓ | R | ✓ | R | R | R | R |
| **Recruitment** | ✓ | R | ✓ | R | R | R | R |
| **Visits** | ✓ | R | ✓ | R | R | R | R |
| **Data Queries** | ✓ | ✓ | ✓ | ✓ | — | — | R |
| **Deviations** | ✓ | ✓ | ✓ | ✓ | R | — | R |
| **Regulatory/Ethics**| ✓ | R | — | — | ✓ | — | R |
| **Pharmacovigilance**| ✓ | ✓ | ✓ | R | R | ✓ | R |
| **Alerts** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | R |
| **Reports** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | R |

*(✓ = Allowed Action, R = Read-only, — = Not Available)*

---

## 5. Website Tour

### Login Page
- **What it is:** Entry gate of the application.
- **What user enters:** Email and password.
- **What happens after successful login:** Backend verifies the identity and routes you to your specific Dashboard.

### Header
- **Profile/name:** Shows logged-in user.
- **Role:** Shows your official system role.
- **Notifications:** Bell icon for alerts.
- **Logout:** Securely terminates your session.

### Sidebar
- **Navigation:** Main menu for the application.
- **Role-specific visibility:** Only shows links you are authorized to see.
- **Mobile hamburger behavior:** Toggles the menu on small screens.

### Dashboard
- **Cards:** High-level summary metrics.
- **Charts:** Visual progress of recruitment/compliance.
- **Alerts:** List of immediate issues.
- **Quick actions:** Available where implemented.

### Protected Routes
"If a role is not allowed to access a page, the system should show an access-restricted/forbidden state instead of allowing unauthorized actions."

---

## 6. Dashboard Guide

**What is a Dashboard?**
Dashboard ek single page summary hai jahan important clinical trial data graphs aur numbers me dikhta hai. Ye values real-time me database se aati hain.

- **ADMIN:** System/institution overview. Displays all active studies and sites across the system.
- **PI:** Study/clinical oversight. Displays specific study progress, recruitment rates, and pending safety alerts.
- **COORDINATOR:** Participant and visit operations. Displays today's visit workload and open queries.
- **MONITOR:** Monitoring/data-quality workload. Displays deviations and unresolved data queries per site.
- **ETHICS:** Ethics/compliance review. Displays pending regulatory milestones and deadlines.
- **PHARMACOVIGILANCE:** Safety/AE/SAE workload. Displays overdue safety reporting deadlines and new AE logs.
- **REGULATOR:** Read-only compliance/oversight. Displays overall safety and compliance statistics.

---

## 7. Feature-By-Feature User Instructions

### Studies
**What is it?** Clinical research projects.
**Why is it used?** To manage high-level protocol information and targets.
**Who can use it?** PI, Admin (Write) | All others (Read-Only where applicable)
**How to use it:**
1. Sidebar se `Studies` par click karein.
2. List me desired study par click karein.
3. Review study details.
4. If authorized, click `Edit` or `+ New Study`, fill the form, and `Save`.
**What happens after the action?** Backend validates the form and updates the database. The new study becomes available for site assignment.
**Important:** Only users with mutation permissions can save changes.

### Sites
**What is it?** Trial locations (hospitals/clinics).
**Why is it used?** To track site activity and assign users like Coordinators to specific locations.
**Who can use it?** Admin (Write) | PI, Monitor, Coordinator (Read)
**How to use it:**
1. Sidebar se `Sites` kholiye.
2. Search and click to open a site.
3. Review site compliance.
**What happens after the action?** Site information is displayed based on real-time data.

### Participants
**What is it?** Trial subjects enrolled in a study.
**Why is it used?** To securely manage patient clinical timelines without exposing identities.
**Who can use it?** Coordinator (Write) | PI, Monitor (Read)
**How to use it:**
1. Sidebar se `Participants` kholiye.
2. `+ Add Participant` par click karein (agar permission ho).
3. Data enter karein (Age, Gender, Code).
4. `Save` karein.
**What happens after the action?** The participant is instantly connected to the study and site, making them available for Visits and Consent tracking.
**Important:** Coordinators can only see participants at their assigned Site.

### Consent
**What is it?** Participant's recorded informed consent.
**Why is it used?** To legally and ethically ensure patient willingness.
**Who can use it?** Coordinator
**How to use it:**
1. Participant detail page par jayein.
2. `Consent` tab open karein.
3. Record new consent status and date.
4. `Save`.
**What happens after the action?** Participant's status formally updates to reflect consent clearance.

### Visits
**What is it?** Participant clinical visits.
**Why is it used?** To schedule and complete required check-ups.
**Who can use it?** Coordinator
**How to use it:**
1. Sidebar se `Visits` kholiye.
2. View pending visits.
3. Click on a visit to update details.
4. Mark as `Completed` and save.
**What happens after the action?** Visit compliance KPIs update on the dashboard.

### Data Queries
**What is it?** Data issues or questions raised by a Monitor.
**Why is it used?** To enforce data quality and fix errors.
**Who can use it?** Monitor (Raise) | Coordinator (Resolve)
**How to use it:**
1. Monitor selects a participant and clicks `New Query`.
2. Fills issue description and severity.
3. Coordinator later opens the query, fixes the data, and marks it `RESOLVED`.
**What happens after the action?** Query status changes and alert counts update on dashboards.

### Protocol Deviations
**What is it?** Violations of the trial protocol rules.
**Why is it used?** To track compliance issues (like missed visit windows).
**Who can use it?** PI, Coordinator, Monitor
**How to use it:**
1. `Deviations` menu open karein.
2. Click `New Deviation`.
3. Provide details and severity.
4. Save.
**What happens after the action?** Deviation is logged and permanently tied to the participant/site.

### Pharmacovigilance / AE / SAE
**What is it?** Safety tracking for Adverse Events.
**Why is it used?** To ensure patient safety and meet strict regulatory reporting deadlines.
**Who can use it?** PV Officer, PI, Coordinator
**How to use it:**
1. Navigate to `Adverse Events`.
2. Log a new AE with exact seriousness details.
3. PV Officer reviews and updates the `PV Review` status.
**What happens after the action?** If marked SAE, a 24-hour reporting alert is automatically generated for oversight.

### Alerts
**What is it?** Important warnings from the system.
**Why is it used?** To prevent missed deadlines (overdue SAEs, overdue visits).
**Who can use it?** All applicable roles.
**How to use it:**
1. Click the bell icon or view the Dashboard alerts section.
2. Click the alert to view the issue.
3. Resolve the underlying issue in the respective module.
**What happens after the action?** The alert status is updated through the implemented workflow in the backend.

### Reports
**What is it?** Trial information exports.
**Why is it used?** To extract data for external review.
**Who can use it?** Admin, PI, Ethics, PV, Regulator
**How to use it:**
1. Open `Reports`.
2. Apply available filters.
3. Generate or export the report.
**What happens after the action?** The system compiles the requested data securely.
**Important:** CDISC and FHIR functionality is currently **Partial / Prototype / Currently Implemented Scope**.

### AI Intelligence (TrialOrbit AI)
**What is it?** Automated study risk analysis and explanatory intelligence.
**Why is it used?** To rapidly identify trial delays, recruitment lags, safety signals, and provide natural language explanations.
**Who can use it?** PI, Admin, and other authorized roles.
**How to use it:**
1. Open a Study details page.
2. Click on the `Intelligence` or `TrialOrbit AI` tab.
3. Review the deterministic risk scores and LLM-generated explanations.
**What happens after the action?** The backend Risk Engine and AI provider (Mistral/OpenAI) evaluate the study's live metrics and return an analysis safely without exposing PII.
**Important:** AI is an advisory tool. It does not diagnose patients.

### Users/Admin Functionality
**What is it?** User administration.
**Why is it used?** To assign staff to specific roles and sites.
**Who can use it?** ADMIN only.
**How to use it:**
1. Navigate to `Users`.
2. Review staff records.
**Important:** Modifying access changes what that user can see instantly.

---

## 8. Alerts / Notifications
- **What generates alerts:** Overdue items (e.g., SAE deadlines) or critical safety signals.
- **Where users see alerts:** Dashboard panels and Header notification icons.
- **How alerts are opened:** By clicking directly on the alert text.
- **What actions are available:** Acknowledge or Navigate to the source.
- **Who can dismiss/update them:** Users with mutation access (Regulator cannot).
- **What happens after resolution:** The alert status is updated through the implemented workflow automatically when the backend detects the issue is closed.

---

## 9. End-to-End Clinical Trial Flow

Study (Project is created)
↓
Regulatory / Ethics (Approvals logged)
↓
Site (Hospitals assigned)
↓
Participant (Subjects added)
↓
Consent (Permissions verified)
↓
Recruitment (Targets met)
↓
Visits (Clinical check-ups happen)
↓
Queries / Deviations (Data is corrected)
↓
AE / SAE (Safety issues logged)
↓
Alerts (Deadlines flagged)
↓
Monitoring / Review / AI Intelligence (Oversight happens)
↓
Reports / Closeout (Data exported)

---

## 10. Practical "Day in the Life"

- **Coordinator:** Login → Coordinator Dashboard → check participant/visit workload → open Participants → perform allowed visit tasks → resolve assigned queries.
- **Monitor:** Login → Monitor Dashboard → review assigned monitoring information → inspect queries/deviations/data quality → perform allowed monitoring actions.
- **PV Officer:** Login → PV Dashboard → review AE/SAE → check reporting deadlines → perform allowed safety review/actions.
- **PI:** Login → PI Dashboard → review accessible studies → check recruitment → review deviations/safety.
- **Ethics:** Login → Ethics Dashboard → review ethics/regulatory items → inspect relevant study information.
- **Regulator:** Login → Regulator Dashboard → review compliance/milestones/safety/audit information → understand that this role is READ-ONLY.
- **Admin:** Login → Dashboard → review system/study overview → manage users → review administrative information.

---

## 11. Security / Access Explanation For Beginners

**Why can't I see some pages?**
Because TrialOrbit uses role-based access control (RBAC).
*Example:* A Coordinator does not get Admin-only pages to prevent accidental changes.

**What if I manually type an unauthorized URL?**
The backend should still enforce authorization and redirect you or show an access denied message.

**Why is Regulator read-only?**
Because the Regulator role is intended for oversight/review and should not mutate system data.

---

## 12. Troubleshooting

- **Login not working** → Incorrect credentials or inactive account. → Check email/password or contact Admin.
- **Access Restricted / 403** → Your role does not have permission. → Expected behavior. Proceed to allowed pages.
- **Alert issue** → Alert still showing. → The underlying record (like a missing date) is not fixed yet. Fix the record first.
- **Mobile sidebar** → Can't see menu. → Click the hamburger (3 lines) icon on top.
- **Empty state / no data** → Filters are applied or no data assigned to your site. → Clear filters or check with PI.
- **Session/logout issue** → JWT expired. → Simply login again.
- **Network/backend unavailable** → Server down. → Retry after a few minutes or report to IT.

---

## 13. Best Practices
- Check correct Study/Site before entering data.
- Never share password.
- Enter accurate information.
- Resolve queries promptly.
- Review alerts.
- Use correct role/account.
- Logout after work.
- Follow actual organization/trial procedures.

---

## 14. Glossary
- **CTMS:** Clinical Trial Management System.
- **PI:** Principal Investigator (Lead researcher).
- **IEC:** Institutional Ethics Committee.
- **CTRI:** Clinical Trials Registry India.
- **AE/ADR/SAE:** Adverse Event / Adverse Drug Reaction / Serious Adverse Event (Safety issues).
- **RBAC:** Role-Based Access Control (Security).
- **JWT:** JSON Web Token (Login session).
- **Audit Trail:** Permanent history of who changed what.
- **SDV:** Source Data Verification.
- **Protocol Deviation:** Breaking a trial rule.
- **Data Query:** A question raised on doubtful data.
- **CDISC / FHIR:** Data standardization protocols.

## 15. Product Roadmap

The application's feature availability is actively categorized to ensure transparent communication regarding current capabilities and future enhancements.

- **🟢 LIVE:** Features that are verified and active in the current release. Examples include 7-Role RBAC, Study Management, Site Management, Safety Tracking, Dashboards, and Real-Time Alerts.
- **🟡 PARTIAL:** Functionality where core foundations exist, but full implementation or compliance certification is pending. Examples include CDISC export mappings and foundational FHIR interoperability.
- **🔵 COMING SOON:** Planned high-priority features scheduled for MVP-2. Examples include structured CRF/eCRF, laboratory data capture, MedDRA / WHO Drug dictionary integration, and visit window validation.
- **⚪ FUTURE:** Long-term enhancements planned for future releases. Examples include ADaM exports, Define-XML generation, advanced safety signal detection, and ABDM integration.

To see the complete, up-to-date roadmap and what is planned for upcoming releases, please navigate to the public **[Product Roadmap](https://aiia-trialorbit.vercel.app/roadmap)** page accessible from the application.

---

### Documentation Verification

- Roles verified: 7/7
- Major modules verified against implementation
- Role permissions verified against implementation
- Authentication flow verified
- Authorization/RBAC verified
- Regulator read-only behavior verified
- Feature workflows verified
- Reports/export status verified
- Documentation consistency checked
