export const studies = [
  {
    id: 'AIIA-001',
    title: 'Effectiveness of Ayurvedic Formulation X',
    type: 'Interventional',
    pi: 'Dr. Anurag Sharma',
    sponsor: 'Ministry of Ayush',
    startDate: '2025-01-15',
    endDate: '2026-12-31',
    status: 'Ongoing',
    progress: 82,
    sites: 5,
    participants: 120,
    targetParticipants: 150
  },
  {
    id: 'AIIA-002',
    title: 'Management of Diabetes with Ayurveda',
    type: 'Observational',
    pi: 'Dr. Priya Singh',
    sponsor: 'ICMR',
    startDate: '2025-03-01',
    endDate: '2027-02-28',
    status: 'Ongoing',
    progress: 61,
    sites: 8,
    participants: 250,
    targetParticipants: 400
  },
  {
    id: 'AIIA-003',
    title: 'Immunomodulatory Effects of Herbal Medicine',
    type: 'Interventional',
    pi: 'Dr. Rohan Mehta',
    sponsor: 'AIIA Intramural',
    startDate: '2026-01-10',
    endDate: '2027-06-30',
    status: 'Ongoing',
    progress: 34,
    sites: 3,
    participants: 45,
    targetParticipants: 130
  },
  {
    id: 'AIIA-004',
    title: 'Anxiety and Stress Management',
    type: 'Interventional',
    pi: 'Dr. Sneha Verma',
    sponsor: 'Ministry of Ayush',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    status: 'Ongoing',
    progress: 78,
    sites: 4,
    participants: 180,
    targetParticipants: 230
  },
  {
    id: 'AIIA-005',
    title: 'Arthritis Treatment with Ayurveda',
    type: 'Interventional',
    pi: 'Dr. Rajesh Kumar',
    sponsor: 'Industry Partner',
    startDate: '2026-05-15',
    endDate: '2028-04-30',
    status: 'Ongoing',
    progress: 45,
    sites: 6,
    participants: 90,
    targetParticipants: 200
  }
];

export const sites = [
  { id: 'S-01', name: 'AIIA Main Campus, Delhi', location: 'Delhi', pi: 'Dr. Anurag Sharma', status: 'Active', enrolled: 120, target: 150 },
  { id: 'S-02', name: 'Ayurveda Regional Institute, Jaipur', location: 'Rajasthan', pi: 'Dr. Vikram Singh', status: 'Active', enrolled: 85, target: 100 },
  { id: 'S-03', name: 'National Institute of Ayurveda', location: 'Rajasthan', pi: 'Dr. Kavita Desai', status: 'Active', enrolled: 110, target: 120 },
  { id: 'S-04', name: 'Govt Ayurveda College, Kerala', location: 'Kerala', pi: 'Dr. Ramesh Nair', status: 'Active', enrolled: 45, target: 80 },
  { id: 'S-05', name: 'Ayush Hospital, Gujarat', location: 'Gujarat', pi: 'Dr. Meera Patel', status: 'Pending', enrolled: 0, target: 50 },
];

export const recentActivity = [
  { id: 1, text: 'Enrollment updated in Study AIIA-001', user: 'Dr. Anurag Sharma', time: '23 Sep 2026, 14:32' },
  { id: 2, text: 'New SAE reported (P-1024)', user: 'Dr. Priya Singh', time: '23 Sep 2026, 13:10' },
  { id: 3, text: 'Site B activated', user: 'Admin', time: '22 Sep 2026, 17:45' },
  { id: 4, text: 'Compliance document uploaded', user: 'Dr. Rohan Mehta', time: '22 Sep 2026, 12:20' },
  { id: 5, text: 'AE status updated (P-876)', user: 'Dr. Sneha Verma', time: '21 Sep 2026, 16:05' },
];

export const alerts = [
  { id: 1, type: 'Critical', text: 'SAE #204 requires review', study: 'AIIA-003', date: '23 Sep 2026' },
  { id: 2, type: 'Warning', text: 'Site B recruitment below expected rate', study: 'AIIA-002', date: '22 Sep 2026' },
  { id: 3, type: 'Critical', text: 'CTRI update due in 4 days', study: 'AIIA-005', date: '21 Sep 2026' },
  { id: 4, type: 'Warning', text: 'Monitoring visit overdue', study: 'AIIA-004', date: '20 Sep 2026' },
];

export const complianceData = [
  { id: 1, req: 'IEC Approval', status: 'Approved', date: '10 Jan 2026', days: null },
  { id: 2, req: 'CTRI Registration', status: 'Registered', date: '15 Jan 2026', days: null },
  { id: 3, req: 'Site Activation', status: 'Completed', date: '20 Jan 2026', days: null },
  { id: 4, req: 'Monitoring Visit', status: 'Due Soon', date: '30 Sep 2026', days: 7 },
  { id: 5, req: 'Protocol Amendment', status: 'Pending', date: '05 Oct 2026', days: 12 },
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
  { name: 'Sep', actual: 540, target: 450 },
];

export const auditLogs = [
  { id: 1, time: '23 Sep 2026 14:32', user: 'Coordinator01', action: 'UPDATE', entity: 'Enrollment', oldVal: '120', newVal: '137' },
  { id: 2, time: '23 Sep 2026 13:10', user: 'PV Officer', action: 'CREATE', entity: 'SAE', oldVal: '-', newVal: 'SAE #204' },
  { id: 3, time: '22 Sep 2026 17:45', user: 'Admin', action: 'UPDATE', entity: 'Site Status', oldVal: 'Pending', newVal: 'Active' },
  { id: 4, time: '22 Sep 2026 12:20', user: 'Dr. Rohan Mehta', action: 'UPLOAD', entity: 'Document', oldVal: '-', newVal: 'Protocol_v2.pdf' },
  { id: 5, time: '21 Sep 2026 16:05', user: 'Dr. Sneha Verma', action: 'UPDATE', entity: 'AE Status', oldVal: 'Open', newVal: 'Resolved' },
];

export const aesaeData = [
  { id: 'AE-101', study: 'AIIA-001', participant: 'P-045', event: 'Mild Headache', severity: 'Mild', serious: 'No', date: '15 Sep 2026', status: 'Resolved' },
  { id: 'SAE-204', study: 'AIIA-003', participant: 'P-1024', event: 'Hospitalization', severity: 'Severe', serious: 'Yes', date: '23 Sep 2026', status: 'Pending Review' },
  { id: 'AE-102', study: 'AIIA-002', participant: 'P-211', event: 'Nausea', severity: 'Moderate', serious: 'No', date: '18 Sep 2026', status: 'Ongoing' },
  { id: 'SAE-205', study: 'AIIA-004', participant: 'P-876', event: 'Elevated Liver Enzymes', severity: 'Severe', serious: 'Yes', date: '21 Sep 2026', status: 'Resolved' },
];
