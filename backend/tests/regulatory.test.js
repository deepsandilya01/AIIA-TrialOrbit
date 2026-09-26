import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const admin = await User.create({ email: 'admin@reg.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@reg.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'REG-001', title: 'Regulatory Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 20 });
  studyId = study._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Regulatory Milestones Validation', () => {
  let milestoneId;

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/regulatory/milestones')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId }); // Missing type, title, dueDate
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject invalid type enum', async () => {
    const res = await request(app)
      .post('/api/v1/regulatory/milestones')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, type: 'UNKNOWN_TYPE', title: 'Milestone', dueDate: new Date().toISOString() });
    expect(res.status).toBe(400);
  });

  it('should create a valid regulatory milestone', async () => {
    const res = await request(app)
      .post('/api/v1/regulatory/milestones')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, type: 'IEC_REVIEW', title: 'Annual IEC Review', dueDate: new Date().toISOString() });
    expect(res.status).toBe(201);
    milestoneId = res.body.data._id;
  });

  it('should GET milestone by ID', async () => {
    if (!milestoneId) return;
    const res = await request(app).get(`/api/v1/regulatory/milestones/${milestoneId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should GET all milestones', async () => {
    const res = await request(app).get('/api/v1/regulatory/milestones').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
