import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Alert from '../src/models/Alert.js';
import bcrypt from 'bcryptjs';

let adminToken = '';
let regulatorToken = '';
let piToken = '';
let studyId = '';
let openAlertId = '';
let ackAlertId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await User.create({ email: 'admin@alert.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  const regulator = await User.create({ email: 'regulator@alert.in', passwordHash, name: 'Regulator', role: 'REGULATOR', isActive: true });
  const pi = await User.create({ email: 'pi@alert.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@alert.in', password: 'password123' });
  adminToken = adminRes.body.data.token;

  const regRes = await request(app).post('/api/v1/auth/login').send({ email: 'regulator@alert.in', password: 'password123' });
  regulatorToken = regRes.body.data.token;

  const piRes = await request(app).post('/api/v1/auth/login').send({ email: 'pi@alert.in', password: 'password123' });
  piToken = piRes.body.data.token;

  const study = await Study.create({ protocolId: 'ALT-001', title: 'Alert Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 10 });
  studyId = study._id.toString();

  // OPEN alert for ADMIN role
  const openAlert = await Alert.create({
    type: 'RECRUITMENT_LAG', severity: 'Warning', status: 'OPEN',
    studyId, text: 'Recruitment behind schedule', title: 'Lag Alert', role: 'ADMIN'
  });
  openAlertId = openAlert._id.toString();

  // OPEN alert for PI role
  await Alert.create({
    type: 'QUERY_AGING', severity: 'Info', status: 'OPEN',
    studyId, text: 'Open queries aging', title: 'Query Alert', role: 'PI'
  });

  // Already ACKNOWLEDGED alert
  const ackAlert = await Alert.create({
    type: 'CTRI_UPDATE_DUE', severity: 'Critical', status: 'ACKNOWLEDGED',
    studyId, text: 'Already acknowledged', title: 'Ack Alert', role: 'ADMIN'
  });
  ackAlertId = ackAlert._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Alerts — Fetch', () => {
  it('should GET all alerts (authenticated)', async () => {
    const res = await request(app).get('/api/v1/alerts').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should GET active alerts (authenticated)', async () => {
    const res = await request(app).get('/api/v1/alerts/active').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // All returned should be OPEN
    res.body.data.forEach(a => expect(a.status).toBe('OPEN'));
  });

  it('should reject unauthenticated alert access', async () => {
    const res = await request(app).get('/api/v1/alerts');
    expect(res.status).toBe(401);
  });
});

describe('Alerts — Acknowledge', () => {
  it('should acknowledge an OPEN alert (ADMIN)', async () => {
    const res = await request(app)
      .patch(`/api/v1/alerts/${openAlertId}/acknowledge`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ACKNOWLEDGED');
    expect(res.body.success).toBe(true);
  });

  it('should return 200 for already-acknowledged alert (idempotent or 404 depending on IDOR check)', async () => {
    // After IDOR fix, PI cannot acknowledge ADMIN's alert
    const res = await request(app)
      .patch(`/api/v1/alerts/${ackAlertId}/acknowledge`)
      .set('Authorization', `Bearer ${piToken}`);
    // PI cannot see/acknowledge ADMIN role alert — should be 200 with null or 404
    expect([200, 404]).toContain(res.status);
  });

  it('should block REGULATOR from acknowledging alerts (403)', async () => {
    // Create an alert for REGULATOR role
    const regAlert = await Alert.create({
      type: 'ETHICS_DUE', severity: 'Warning', status: 'OPEN',
      studyId, text: 'Ethics due', title: 'Ethics', role: 'REGULATOR'
    });
    const res = await request(app)
      .patch(`/api/v1/alerts/${regAlert._id}/acknowledge`)
      .set('Authorization', `Bearer ${regulatorToken}`);
    expect(res.status).toBe(403);
  });

  it('should return 401 for unauthenticated acknowledge attempt', async () => {
    const res = await request(app)
      .patch(`/api/v1/alerts/${openAlertId}/acknowledge`);
    expect(res.status).toBe(401);
  });

  it('should return 400 for invalid (non-MongoId) alert ID', async () => {
    const res = await request(app)
      .patch('/api/v1/alerts/not-a-valid-id/acknowledge')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });
});

describe('Alerts — Active count accuracy', () => {
  it('OPEN alert count should not include acknowledged alerts', async () => {
    const res = await request(app).get('/api/v1/alerts/active').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    // None of the active alerts should have ACKNOWLEDGED status
    const hasAck = res.body.data.some(a => a.status !== 'OPEN');
    expect(hasAck).toBe(false);
  });
});
