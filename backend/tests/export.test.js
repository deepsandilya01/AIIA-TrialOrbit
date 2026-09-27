import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import AdverseEvent from '../src/models/AdverseEvent.js';
import Participant from '../src/models/Participant.js';
import bcrypt from 'bcryptjs';

let adminToken, piToken, coordTokenA, coordTokenB, monitorTokenB, regulatorToken;
let studyIdA, studyIdB;
let siteIdA, siteIdB;

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const piA = await User.create({ email: 'pia_exp@s.in', passwordHash, name: 'PIA', role: 'PI', isActive: true });
  const piB = await User.create({ email: 'pib_exp@s.in', passwordHash, name: 'PIB', role: 'PI', isActive: true });

  const studyA = await Study.create({ protocolId: 'EXP-001', title: 'Study A', phase: 'Phase II', pi_id: piA._id, targetParticipants: 100 });
  const studyB = await Study.create({ protocolId: 'EXP-002', title: 'Study B', phase: 'Phase III', pi_id: piB._id, targetParticipants: 200 });
  studyIdA = studyA._id.toString();
  studyIdB = studyB._id.toString();

  const siteA = await Site.create({ name: 'Site A', studyId: studyA._id, status: 'Activated', location: 'City A', enrolledCount: 5 });
  const siteB = await Site.create({ name: 'Site B', studyId: studyB._id, status: 'Activated', location: 'City B', enrolledCount: 10 });
  siteIdA = siteA._id.toString();
  siteIdB = siteB._id.toString();

  const pA = await Participant.create({ participantCode: 'PA', subjectId: 'P001', studyId: studyA._id, siteId: siteA._id, status: 'Enrolled', gender: 'Male', age: 30 });
  const pB = await Participant.create({ participantCode: 'PB', subjectId: 'P002', studyId: studyB._id, siteId: siteB._id, status: 'Enrolled', gender: 'Female', age: 40 });

  await AdverseEvent.create({ studyId: studyA._id, siteId: siteA._id, participantId: pA._id, eventType: 'AE', event: 'Headache', severity: 'MILD', seriousness: 'NON_SERIOUS', pvReviewStatus: 'PENDING', reportedDate: new Date() });
  await AdverseEvent.create({ studyId: studyB._id, siteId: siteB._id, participantId: pB._id, eventType: 'SAE', event: 'Fever', severity: 'SEVERE', seriousness: 'SERIOUS', pvReviewStatus: 'APPROVED', reportedDate: new Date() });

  const coordA = await User.create({ email: 'coorda_exp@s.in', passwordHash, name: 'Coord A', role: 'COORDINATOR', siteId: siteA._id, isActive: true });
  const coordB = await User.create({ email: 'coordb_exp@s.in', passwordHash, name: 'Coord B', role: 'COORDINATOR', siteId: siteB._id, isActive: true });
  const monitorB = await User.create({ email: 'monb_exp@s.in', passwordHash, name: 'Mon B', role: 'MONITOR', siteId: siteB._id, isActive: true });
  const regulator = await User.create({ email: 'reg_exp@s.in', passwordHash, name: 'Regulator', role: 'REGULATOR', isActive: true });

  const getT = async (email) => (await request(app).post('/api/v1/auth/login').send({ email, password: 'password123' })).body.data.token;
  
  piToken = await getT('pia_exp@s.in');
  coordTokenA = await getT('coorda_exp@s.in');
  coordTokenB = await getT('coordb_exp@s.in');
  monitorTokenB = await getT('monb_exp@s.in');
  regulatorToken = await getT('reg_exp@s.in');
});

afterAll(async () => {
  await closeTestDB();
});

describe('Export Report Scope/IDOR Tests', () => {

  test('PI Study A can only see Site A in Site Performance Metrics', async () => {
    const res = await request(app)
      .get('/api/v1/export/report?title=Site Performance Metrics&format=CSV')
      .set('Authorization', `Bearer ${piToken}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(res.text).toContain('Site A');
    expect(res.text).not.toContain('Site B');
  });

  test('Coordinator Site A can only see Site A in AE Line Listing', async () => {
    const res = await request(app)
      .get('/api/v1/export/report?title=Adverse Event Line Listing&format=CSV')
      .set('Authorization', `Bearer ${coordTokenA}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Headache');
    expect(res.text).not.toContain('Fever');
  });

  test('Monitor Site B can only see Site B in AE Line Listing', async () => {
    const res = await request(app)
      .get('/api/v1/export/report?title=Adverse Event Line Listing&format=CSV')
      .set('Authorization', `Bearer ${monitorTokenB}`);
    expect(res.status).toBe(200);
    expect(res.text).not.toContain('Headache');
    expect(res.text).toContain('Fever');
  });

  test('Regulator sees all Data', async () => {
    const res = await request(app)
      .get('/api/v1/export/report?title=Site Performance Metrics&format=CSV')
      .set('Authorization', `Bearer ${regulatorToken}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Site A');
    expect(res.text).toContain('Site B');
  });

  test('Unsupported Report gives 400', async () => {
    const res = await request(app)
      .get('/api/v1/export/report?title=Clinical Study Report (CSR)&format=PDF')
      .set('Authorization', `Bearer ${piToken}`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
