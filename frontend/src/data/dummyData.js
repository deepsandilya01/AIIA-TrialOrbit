export const studies = [
  {
    id: 'AIIA-001',
    protocolId: 'AIIA/CT/2025/001',
    ctriNumber: 'CTRI/2025/01/072411',
    title: 'Effectiveness of Ayurvedic Formulation X in Metabolic Health',
    therapeuticArea: 'Metabolic & Lifestyle Disorders',
    phase: 'Phase II',
    type: 'Interventional, Randomized Controlled',
    pi: 'Dr. Anurag Sharma',
    sponsor: 'Ministry of Ayush',
    startDate: '2025-01-15',
    endDate: '2026-12-31',
    status: 'Ongoing',
    progress: 82,
    sites: 5,
    participants: 124,
    targetParticipants: 150,
    dataQualityScore: 97.4,
    unresolvedQueries: 3,
    openDeviations: 1
  },
  {
    id: 'AIIA-002',
    protocolId: 'AIIA/CT/2025/004',
    ctriNumber: 'CTRI/2025/02/073890',
    title: 'Management of Type 2 Diabetes with Classical Ayurvedic Protocols',
    therapeuticArea: 'Endocrinology',
    phase: 'Phase III',
    type: 'Interventional, Multi-Centre',
    pi: 'Dr. Priya Singh',
    sponsor: 'ICMR & AIIA Joint Grant',
    startDate: '2025-03-01',
    endDate: '2027-02-28',
    status: 'Ongoing',
    progress: 62,
    sites: 8,
    participants: 250,
    targetParticipants: 400,
    dataQualityScore: 94.8,
    unresolvedQueries: 7,
    openDeviations: 2
  },
  {
    id: 'AIIA-003',
    protocolId: 'AIIA/CT/2026/012',
    ctriNumber: 'CTRI/2026/01/079102',
    title: 'Immunomodulatory Effects of Standardized Herbal Formulations in Elderly',
    therapeuticArea: 'Geriatrics & Immunology',
    phase: 'Phase IIb',
    type: 'Interventional, Double-Blind',
    pi: 'Dr. Rohan Mehta',
    sponsor: 'AIIA Intramural Research Fund',
    startDate: '2026-01-10',
    endDate: '2027-06-30',
    status: 'Ongoing',
    progress: 35,
    sites: 3,
    participants: 45,
    targetParticipants: 130,
    dataQualityScore: 98.1,
    unresolvedQueries: 1,
    openDeviations: 0
  },
  {
    id: 'AIIA-004',
    protocolId: 'AIIA/CT/2025/009',
    ctriNumber: 'CTRI/2025/04/075421',
    title: 'Clinical Efficacy of Medhya Rasayana in Chronic Stress & Anxiety',
    therapeuticArea: 'Neuropsychiatry',
    phase: 'Phase II',
    type: 'Interventional',
    pi: 'Dr. Sneha Verma',
    sponsor: 'Ministry of Ayush',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    status: 'Ongoing',
    progress: 78,
    sites: 4,
    participants: 180,
    targetParticipants: 230,
    dataQualityScore: 96.0,
    unresolvedQueries: 4,
    openDeviations: 1
  },
  {
    id: 'AIIA-005',
    protocolId: 'AIIA/CT/2026/019',
    ctriNumber: 'CTRI/2026/03/081204',
    title: 'Multi-Modal Ayurvedic Protocol for Osteoarthritis of Knee',
    therapeuticArea: 'Rheumatology & Orthopaedics',
    phase: 'Phase III',
    type: 'Interventional, Comparative Active Control',
    pi: 'Dr. Rajesh Kumar',
    sponsor: 'National Ayush Mission',
    startDate: '2026-05-15',
    endDate: '2028-04-30',
    status: 'Ongoing',
    progress: 45,
    sites: 6,
    participants: 90,
    targetParticipants: 200,
    dataQualityScore: 95.2,
    unresolvedQueries: 5,
    openDeviations: 2
  }
];

export const sites = [
  { id: 'S-01', name: 'AIIA Main Campus Hospital, New Delhi', location: 'New Delhi', pi: 'Dr. Anurag Sharma', status: 'Active', enrolled: 120, target: 150, coordinator: 'Pooja Rawat', activationDate: '2025-01-10', complianceRate: 98 },
  { id: 'S-02', name: 'National Institute of Ayurveda (NIA), Jaipur', location: 'Rajasthan', pi: 'Dr. Vikram Singh', status: 'Active', enrolled: 85, target: 100, coordinator: 'Rakesh Sharma', activationDate: '2025-02-14', complianceRate: 94 },
  { id: 'S-03', name: 'Institute of Teaching & Research in Ayurveda (ITRA)', location: 'Gujarat', pi: 'Dr. Kavita Desai', status: 'Active', enrolled: 110, target: 120, coordinator: 'Amit Bhatt', activationDate: '2025-02-20', complianceRate: 96 },
  { id: 'S-04', name: 'Government Ayurveda College & Hospital, Thiruvananthapuram', location: 'Kerala', pi: 'Dr. Ramesh Nair', status: 'Active', enrolled: 45, target: 80, coordinator: 'Sujatha Pillai', activationDate: '2025-04-01', complianceRate: 91 },
  { id: 'S-05', name: 'All India Institute of Ayurveda Satellite Centre, Goa', location: 'Goa', pi: 'Dr. Meera Patel', status: 'Pending', enrolled: 0, target: 50, coordinator: 'TBD', activationDate: 'Pending IEC Clearance', complianceRate: 0 }
];

export const recentActivity = [
  { id: 1, text: 'Enrollment updated in Study AIIA-001 (+4 patients)', user: 'Dr. Anurag Sharma (PI)', time: '23 Sep 2026, 14:32' },
  { id: 2, text: 'New SAE reported and routed to PV Officer (P-1024)', user: 'Dr. Priya Singh (Co-PI)', time: '23 Sep 2026, 13:10' },
  { id: 3, text: 'Site S-03 monitoring visit report approved', user: 'Clinical Monitor (CRA)', time: '22 Sep 2026, 17:45' },
  { id: 4, text: 'Protocol Amendment v2.2 uploaded for IEC Review', user: 'Dr. Rohan Mehta (PI)', time: '22 Sep 2026, 12:20' },
  { id: 5, text: 'AE status marked Resolved following 14-day check (P-876)', user: 'Dr. Sneha Verma (PI)', time: '21 Sep 2026, 16:05' }
];

export const alerts = [
  { id: 1, type: 'Critical', text: 'SAE #204 requires Pharmacovigilance review within 24h', study: 'AIIA-003', date: '23 Sep 2026', resolved: false, category: 'Safety' },
  { id: 2, type: 'Warning', text: 'Site S-05 recruitment trajectory 28% below protocol curve', study: 'AIIA-002', date: '22 Sep 2026', resolved: false, category: 'Recruitment' },
  { id: 3, type: 'Critical', text: 'CTRI 6-month progress report upload due in 4 days', study: 'AIIA-005', date: '21 Sep 2026', resolved: false, category: 'Regulatory' },
  { id: 4, type: 'Warning', text: 'Interim monitoring visit overdue at Thiruvananthapuram site', study: 'AIIA-004', date: '20 Sep 2026', resolved: false, category: 'Monitoring' },
  { id: 5, type: 'Info', text: 'Ethics Committee approval renewed for Study AIIA-001', study: 'AIIA-001', date: '19 Sep 2026', resolved: true, category: 'Compliance' }
];

export const complianceData = [
  { id: 1, req: 'Institutional Ethics Committee (IEC) Clearance', status: 'Approved', date: '10 Jan 2026', days: null, authority: 'AIIA IEC-Human Studies' },
  { id: 2, req: 'CTRI Clinical Trial Registry Filing', status: 'Registered', date: '15 Jan 2026', days: null, authority: 'ICMR CTRI Registry' },
  { id: 3, req: 'Good Clinical Practice (GCP) Site Activation', status: 'Completed', date: '20 Jan 2026', days: null, authority: 'QA / Audit Committee' },
  { id: 4, req: 'Routine On-Site Source Data Verification (SDV)', status: 'Due Soon', date: '30 Sep 2026', days: 7, authority: 'Assigned Clinical CRA' },
  { id: 5, req: 'Annual Safety Report (ASR) to CDSCO', status: 'Pending', date: '05 Oct 2026', days: 12, authority: 'CDSCO / Ayush Drug Controller' }
];

export const recruitmentTrend = [
  { name: 'Jan', actual: 40, target: 50 },
  { name: 'Feb', actual: 85, target: 100 },
  { name: 'Mar', actual: 150, target: 150 },
  { name: 'Apr', actual: 210, target: 200 },
  { name: 'May', actual: 280, target: 250 },
  { name: 'Jun', actual: 360, target: 300 },
  { name: 'Jul', actual: 420, target: 350 },
  { name: 'Aug', actual: 490, target: 400 },
  { name: 'Sep', actual: 540, target: 450 }
];

export const auditLogs = [
  { id: 1, time: '23 Sep 2026 14:32:10 IST', user: 'Dr. Anurag Sharma', role: 'Principal Investigator', action: 'UPDATE', entity: 'Participant Cohort', oldVal: '120 Enrolled', newVal: '124 Enrolled', ip: '10.24.1.42' },
  { id: 2, time: '23 Sep 2026 13:10:05 IST', user: 'Dr. Priya Singh', role: 'Pharmacovigilance Officer', action: 'CREATE', entity: 'SAE Case File', oldVal: '-', newVal: 'SAE-204 (Hospitalization)', ip: '10.24.2.18' },
  { id: 3, time: '22 Sep 2026 17:45:33 IST', user: 'Dr. Vikram Singh', role: 'Site Investigator', action: 'UPDATE', entity: 'Site S-02 Readiness', oldVal: 'Inspection Pending', newVal: 'Inspection Cleared', ip: '14.139.224.12' },
  { id: 4, time: '22 Sep 2026 12:20:19 IST', user: 'Dr. Rohan Mehta', role: 'Principal Investigator', action: 'UPLOAD', entity: 'Regulatory Document', oldVal: '-', newVal: 'Protocol_AIIA_003_v2.1.pdf', ip: '10.24.1.88' },
  { id: 5, time: '21 Sep 2026 16:05:44 IST', user: 'Dr. Sneha Verma', role: 'Study Coordinator', action: 'UPDATE', entity: 'AE-101 Outcome', oldVal: 'Ongoing Grade 1', newVal: 'Resolved Grade 0', ip: '10.24.3.05' }
];

export const aesaeData = [
  {
    id: 'SAE-204',
    study: 'AIIA-003',
    participant: 'P-1024',
    site: 'S-01',
    event: 'Acute Gastroenteritis requiring Hospitalization',
    severity: 'Grade 3 (Severe)',
    serious: 'Yes',
    causality: 'Unlikely Related to Investigational Herb',
    date: '23 Sep 2026',
    status: 'Pending Review',
    reportedBy: 'Dr. Rohan Mehta'
  },
  {
    id: 'AE-102',
    study: 'AIIA-002',
    participant: 'P-211',
    site: 'S-02',
    event: 'Mild Transient Nausea',
    severity: 'Grade 1 (Mild)',
    serious: 'No',
    causality: 'Possible',
    date: '18 Sep 2026',
    status: 'Ongoing',
    reportedBy: 'Dr. Priya Singh'
  },
  {
    id: 'SAE-205',
    study: 'AIIA-004',
    participant: 'P-876',
    site: 'S-04',
    event: 'Elevated Serum Transaminases (ALT > 3x ULN)',
    severity: 'Grade 3 (Severe)',
    serious: 'Yes',
    causality: 'Probable',
    date: '21 Sep 2026',
    status: 'Resolved',
    reportedBy: 'Dr. Sneha Verma'
  },
  {
    id: 'AE-101',
    study: 'AIIA-001',
    participant: 'P-045',
    site: 'S-01',
    event: 'Intermittent Headache',
    severity: 'Grade 1 (Mild)',
    serious: 'No',
    causality: 'Unlikely',
    date: '15 Sep 2026',
    status: 'Resolved',
    reportedBy: 'Dr. Anurag Sharma'
  }
];

export const protocolDeviations = [
  { id: 'DEV-012', study: 'AIIA-002', site: 'S-02', participant: 'P-189', deviationType: 'Visit Window', description: 'Day 28 Follow-up Visit conducted on Day 34 (+6 days out of window)', classification: 'Minor', date: '21 Sep 2026', status: 'Approved by PI' },
  { id: 'DEV-011', study: 'AIIA-001', site: 'S-01', participant: 'P-092', deviationType: 'Lab Procedure', description: 'Fasting lipid panel repeated due to sample hemolysis', classification: 'Minor', date: '19 Sep 2026', status: 'Resolved' },
  { id: 'DEV-010', study: 'AIIA-005', site: 'S-03', participant: 'P-340', deviationType: 'Investigational Product', description: 'Subject missed 3 evening doses of trial formulation', classification: 'Moderate', date: '16 Sep 2026', status: 'Corrective Action Taken' }
];

export const reportsCatalog = [
  { id: 'REP-01', title: 'Recruitment & Cohort Velocity Report', description: 'Screening ratio, target vs actual enrollment, site contribution curves', format: 'PDF / CSV', lastGenerated: '23 Sep 2026' },
  { id: 'REP-02', title: 'Safety & Pharmacovigilance Line Listing (CIOMS Form)', description: 'Adverse event breakdown by severity, causality, and seriousness criteria', format: 'PDF / XML', lastGenerated: '22 Sep 2026' },
  { id: 'REP-03', title: 'Site Inspection Readiness & GCP Compliance Index', description: 'Regulatory binders, informed consent versions, monitoring visit logs', format: 'PDF', lastGenerated: '20 Sep 2026' },
  { id: 'REP-04', title: 'CFR 21 Part 11 Audit Trail Full Export', description: 'Chronological electronic record signatures and data modification trail', format: 'CSV / Encrypted ZIP', lastGenerated: '23 Sep 2026' }
];

export const userRolesList = [
  { id: 'pi', name: 'Dr. Anurag Sharma', role: 'Principal Investigator', permissions: 'Full Study Protocol, Participant Screening, Medical Review, AE Approvals' },
  { id: 'coord', name: 'Dr. Sneha Verma', role: 'Study Coordinator', permissions: 'Visit Scheduling, CRF Data Entry, Subject Follow-up, Document Management' },
  { id: 'pv', name: 'Dr. Priya Singh', role: 'Pharmacovigilance Officer', permissions: 'SAE Review, MedDRA Coding, Causality Review, CDSCO Expedited Submission' },
  { id: 'cra', name: 'R. K. Meena', role: 'Clinical Research Associate (Monitor)', permissions: 'Source Data Verification (SDV), Monitoring Visits, Protocol Deviations' },
  { id: 'admin', name: 'IT Admin AIIA', role: 'System Administrator', permissions: 'User Provisioning, Role Assignments, System Audit Logs, Platform Config' },
  { id: 'regulator', name: 'Ayush Drug Inspector', role: 'Read-only Auditor / Regulator', permissions: 'Read-Only Study Data, Regulatory Binder, Audit Trail Inspection' }
];
