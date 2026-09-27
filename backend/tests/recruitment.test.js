import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import Participant from '../src/models/Participant.js';
import bcrypt from 'bcryptjs';

let adminToken, piToken, coordTokenA, coordTokenB, monitorTokenA, monitorTokenB, regulatorToken, ethicsToken, pvToken;
let studyIdA, studyIdB;
let siteIdA, siteIdB;

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await User.create({ email: 'admin@r.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  const piA = await User.create({ email: 'pia@r.in', passwordHash, name: 'PIA', role: 'PI', isActive: true });
  const piB = await User.create({ email: 'pib@r.in', passwordHash, name: 'PIB', role: 'PI', isActive: true });
  const regulator = await User.create({ email: 'reg@r.in', passwordHash, name: 'Reg', role: 'REGULATOR', isActive: true });
  const ethics = await User.create({ email: 'eth@r.in', passwordHash, name: 'Eth', role: 'ETHICS', isActive: true });
  const pv = await User.create({ email: 'pv@r.in', passwordHash, name: 'PV', role: 'PHARMACOVIGILANCE', isActive: true });

  const getT = async (email) => (await request(app).post('/api/v1/auth/login').send({ email, password: 'password123' })).body.data.token;
  
  adminToken = await getT('admin@r.in');
  piToken = await getT('pia@r.in');
  regulatorToken = await getT('reg@r.in');
  ethicsToken = await getT('eth@r.in');
  pvToken = await getT('pv@r.in');

  const studyA = await Study.create({ protocolId: 'R-001', title: 'Study A', phase: 'Phase II', pi_id: piA._id, targetParticipants: 100 });
  const studyB = await Study.create({ protocolId: 'R-002', title: 'Study B', phase: 'Phase III', pi_id: piB._id, targetParticipants: 200 });
  studyIdA = studyA._id.toString();
  studyIdB = studyB._id.toString();

  const siteA = await Site.create({ siteId: 'SA', name: 'Site A', location: 'Location A', studyId: studyIdA, targetEnrollment: 50 });
  const siteB = await Site.create({ siteId: 'SB', name: 'Site B', location: 'Location B', studyId: studyIdB, targetEnrollment: 50 });
  siteIdA = siteA._id.toString();
  siteIdB = siteB._id.toString();

  const coordA = await User.create({ email: 'coorda@r.in', passwordHash, name: 'CA', role: 'COORDINATOR', siteId: siteIdA, isActive: true });
  const coordB = await User.create({ email: 'coordb@r.in', passwordHash, name: 'CB', role: 'COORDINATOR', siteId: siteIdB, isActive: true });
  const monitorA = await User.create({ email: 'mona@r.in', passwordHash, name: 'MA', role: 'MONITOR', siteId: siteIdA, isActive: true });
  const monitorB = await User.create({ email: 'monb@r.in', passwordHash, name: 'MB', role: 'MONITOR', siteId: siteIdB, isActive: true });

  coordTokenA = await getT('coorda@r.in');
  coordTokenB = await getT('coordb@r.in');
  monitorTokenA = await getT('mona@r.in');
  monitorTokenB = await getT('monb@r.in');

}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Recruitment Summary API Tests', () => {
  it('A. Empty database - all supported metrics = 0, unavailable metrics = null', async () => {
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.totalScreened).toBe(0);
    expect(data.totalEnrolled).toBe(0);
    expect(data.lostToFollowUp).toBe(0);
    expect(data.withdrawn).toBe(0);
    expect(data.completed).toBe(0);
    expect(data.activeInProtocol).toBe(null);
    expect(data.recruitmentLag).toBe(null);
  });

  it('B. One Screened participant', async () => {
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-001', age: 30, gender: 'Male', status: 'Screened' });
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.totalScreened).toBe(1);
    expect(res.body.data.totalEnrolled).toBe(0);
  });

  it('C. One Enrolled participant', async () => {
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-002', age: 30, gender: 'Male', status: 'Enrolled' });
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.totalScreened).toBe(1);
    expect(res.body.data.totalEnrolled).toBe(1);
  });

  it('D/E. Multiple statuses independently verify counts', async () => {
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-003', age: 30, gender: 'Male', status: 'Lost-to-follow-up' });
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-004', age: 30, gender: 'Male', status: 'Completed' });
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-005', age: 30, gender: 'Male', status: 'Withdrawn' });
    // unsupported status for these KPIs
    await Participant.create({ studyId: studyIdA, siteId: siteIdA, participantCode: 'P-006', age: 30, gender: 'Male', status: 'Ineligible' });

    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.totalScreened).toBe(1);
    expect(res.body.data.totalEnrolled).toBe(1);
    expect(res.body.data.lostToFollowUp).toBe(1);
    expect(res.body.data.completed).toBe(1);
    expect(res.body.data.withdrawn).toBe(1);
  });
});

describe('Recruitment Trend Test', () => {
  it('Verify enrolled included, screened/withdrawn excluded', async () => {
    const res = await request(app).get('/api/v1/dashboard/recruitment-trend').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const data = res.body.data;
    // We added 1 enrolled above in studyA
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[data.length - 1].actual).toBe(1); // Since actual accumulates to total enrolled
  });
});

describe('IDOR / Scope / RBAC Tests', () => {
  beforeAll(async () => {
    // Add some data to Site B
    await Participant.create({ studyId: studyIdB, siteId: siteIdB, participantCode: 'PB-001', age: 30, gender: 'Male', status: 'Enrolled' });
    await Participant.create({ studyId: studyIdB, siteId: siteIdB, participantCode: 'PB-002', age: 30, gender: 'Male', status: 'Screened' });
  });

  it('Coordinator A cannot see Site B data', async () => {
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${coordTokenA}`);
    expect(res.body.data.totalEnrolled).toBe(1); // From Site A
    expect(res.body.data.totalScreened).toBe(1);
  });

  it('Monitor A cannot see Site B data', async () => {
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${monitorTokenA}`);
    expect(res.body.data.totalEnrolled).toBe(1);
  });

  it('PI cannot access unauthorized study (Study B)', async () => {
    const res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${piToken}`); // PI of Study A
    expect(res.body.data.totalEnrolled).toBe(1);
  });

  it('Query Override Test - Coordinator A attempting to view Site B', async () => {
    const res = await request(app).get(`/api/v1/dashboard/recruitment-summary?siteId=${siteIdB}`).set('Authorization', `Bearer ${coordTokenA}`);
    expect(res.body.data.totalEnrolled).toBe(1); // Still returns 1 (ignores override)
  });

  it('Regulator, PV, Ethics have correct canonical access (all studies in this simplified mockup)', async () => {
    let res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${regulatorToken}`);
    expect(res.body.data.totalEnrolled).toBe(2); // Site A (1) + Site B (1)
    
    res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${pvToken}`);
    expect(res.body.data.totalEnrolled).toBe(2);

    res = await request(app).get('/api/v1/dashboard/recruitment-summary').set('Authorization', `Bearer ${ethicsToken}`);
    expect(res.body.data.totalEnrolled).toBe(2);
  });
});
