# AIIA TrialOrbit — 5-Minute Quick Start

Ye ek quick guide hai jisse aap 5 minute me AIIA TrialOrbit system use karna start kar sakte hain.

---

## 1. What is TrialOrbit?
AIIA TrialOrbit is a Clinical Trial Management System (CTMS).
Ye ek central website hai jahan clinical-trial ki important information track ki jati hai, jaise: Studies, Sites, Participants, Consent, Recruitment, Visits, Data Queries, Protocol Deviations, Regulatory/Ethics, Pharmacovigilance / AE / SAE, Alerts, aur Reports.

## 2. Login Kaise Karein? (Login)
1. Website open karein.
2. Apna **Email** aur **Password** enter karein.
3. `Login` button par click karein.
4. Sahi details hone par aap turant apne Dashboard par pahunch jayenge.

## 3. Authentication vs Authorization
**Authentication (Who are you?):**
User apne registered credentials se login karta hai. Backend verify karta hai ki aap kaun hain. Successful login hone par system ek secure session (JWT) banata hai.

**Authorization (What are you allowed to do?):**
Login hone ke baad, Role-Based Access Control (RBAC) decide karta hai ki aap kaunse pages dekh sakte hain aur kaunse actions (save, edit) le sakte hain. Frontend permissions UI ko clean banate hain, par asli security backend check karta hai.

## 4. Identify Your Role
Top-right corner (Header) me aapko apna naam aur Role dikhega. System me strictly 7 roles hote hain: `ADMIN`, `PI`, `COORDINATOR`, `MONITOR`, `ETHICS`, `PHARMACOVIGILANCE`, `REGULATOR`.

## 5. Open Your Dashboard
Dashboard aapka home screen hai. Yahan aapko role ke hisaab se trial ki important summary (KPI cards, charts, aur alerts) milti hai. 

## 6. Understand Sidebar
Left side me ek navigation Sidebar hai. Aapko yahan sirf wahi modules dikhenge jinhe dekhne ki aapko permission (authorization) hai. Mobile par ye menu "Hamburger" (3-lines) icon click karne se khulta hai.

## 7. Main Modules
| Module | Simple Meaning | Typical Use |
|--------|----------------|-------------|
| **Studies** | Clinical research projects | View/manage study information |
| **Sites** | Trial locations | Track site activity |
| **Participants** | Trial subjects | Manage participant records |
| **Consent** | Participant consent | Record consent information |
| **Recruitment** | Enrollment progress | Track screening/enrollment |
| **Visits** | Participant visits | Schedule/complete visits |
| **Data Queries** | Data issues/questions | Raise/resolve data issues |
| **Deviations** | Protocol violations | Record/review deviations |
| **Regulatory/Ethics** | Approvals/milestones | Track regulatory/IEC items |
| **Pharmacovigilance** | Safety tracking | Manage AE/SAE |
| **Alerts** | Important warnings | Review pending/overdue issues |
| **Reports** | Trial information/reporting | View/export available reports |

## 8. Perform One Basic Task
*(Example if you are a Coordinator)*
1. Sidebar se **Participants** kholiye.
2. `+ Add Participant` button par click karein.
3. Required details bharein.
4. `Save` dabayein. Backend validation pass hone par patient list me add ho jayega.

## 9. Check Alerts
Dashboard par `Alerts` section me pending/overdue issues dikhte hain. Jab aap us alert ka underlying issue resolve kar dete hain, toh alert ki status automatically updated ho jati hai workflow ke zariye.

## 10. End-to-End Trial Flow
Study ↓ Regulatory / Ethics ↓ Site ↓ Participant ↓ Consent ↓ Recruitment ↓ Visits ↓ Queries / Deviations ↓ AE / SAE ↓ Alerts ↓ Monitoring / Review ↓ Reports / Closeout

## 11. Role-specific Quick Start
- **ADMIN:** Login → Dashboard → review system/study overview → manage users → review administrative information → logout.
- **PI:** Login → PI Dashboard → review assigned/accessible studies → check recruitment → review queries/deviations/safety → review study progress.
- **COORDINATOR:** Login → Coordinator Dashboard → check participant/visit workload → open Participants → perform allowed participant/consent/visit tasks → resolve assigned queries where permitted.
- **MONITOR:** Login → Monitor Dashboard → review assigned monitoring information → inspect queries/deviations/data quality → perform allowed monitoring actions.
- **ETHICS:** Login → Ethics Dashboard → review ethics/regulatory items → inspect relevant study information → review allowed approvals/compliance items.
- **PHARMACOVIGILANCE:** Login → PV Dashboard → review AE/SAE → check reporting deadlines → perform allowed safety review/actions.
- **REGULATOR:** Login → Regulator Dashboard → review compliance/milestones/safety/audit information → inspect records → understand that this role is READ-ONLY.

## 12. Logout
Top right profile menu se `Logout` par click karein taki aapka secure session safely close ho jaye.

## 13. Read Complete User Guide
Detailed step-by-step instructions ke liye, kripya `AIIA_TRIALORBIT_COMPLETE_USER_GUIDE.md` padhein.

## 14. Product Roadmap
The application's feature availability is categorized into the following statuses:
- **🟢 LIVE:** Features that are verified and active (e.g. 7-Role RBAC, Study Management, Safety Tracking, Dashboards).
- **🟡 PARTIAL:** Features with foundational implementation pending full compliance/certification (e.g. CDISC Export, FHIR Interoperability).
- **🔵 COMING SOON:** Planned high-priority features for MVP-2 (e.g. CRF/eCRF, Structured Vitals, MedDRA integration).
- **⚪ FUTURE:** Long-term enhancements for MVP-3 and beyond (e.g. ADaM, ABDM Interoperability).

For a complete breakdown, please visit the public [Product Roadmap](/roadmap) page in the application.

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
