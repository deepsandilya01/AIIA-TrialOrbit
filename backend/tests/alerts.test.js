import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Alert from '../src/models/Alert.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const admin = await User.create({ email: 'admin@alert.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@alert.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'ALT-001', title: 'Alert Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 10 });
  studyId = study._id.toString();

  // Create test alerts
  await Alert.create({ type: 'RECRUITMENT_LAG', severity: 'Warning', status: 'OPEN', studyId, text: 'Recruitment behind schedule', title: 'Lag Alert' });
  await Alert.create({ type: 'QUERY_AGING', severity: 'Info', status: 'OPEN', studyId, text: 'Open queries aging', title: 'Query Alert' });
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Alerts', () => {
  let alertId;

  it('should GET all alerts', async () => {
    const res = await request(app).get('/api/v1/alerts').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    alertId = res.body.data[0]?._id;
  });

  it('should GET active alerts', async () => {
    const res = await request(app).get('/api/v1/alerts/active').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should acknowledge an alert', async () => {
    if (!alertId) return;
    const res = await request(app)
      .patch(`/api/v1/alerts/${alertId}/acknowledge`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ACKNOWLEDGED');
  });

  it('should reject unauthenticated alert access', async () => {
    const res = await request(app).get('/api/v1/alerts');
    expect(res.status).toBe(401);
  });
});
