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
  const pi = await User.create({ email: 'pi@study.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'pi@study.in', password: 'password123' });
  token = res.body.data.token;
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Studies Validation', () => {
  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ protocolId: 'S-001' }); // Missing title, phase, targetParticipants
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject invalid phase enum', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ protocolId: 'S-001', title: 'Study A', phase: 'Phase X', targetParticipants: 50 });
    expect(res.status).toBe(400);
  });

  it('should reject targetParticipants of 0', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ protocolId: 'S-001', title: 'Study A', phase: 'Phase I', targetParticipants: 0 });
    expect(res.status).toBe(400);
  });

  it('should create a valid study', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ protocolId: 'S-001', title: 'Valid Study', phase: 'Phase I', targetParticipants: 50 });
    expect(res.status).toBe(201);
    studyId = res.body.data._id;
  });

  it('should list all studies', async () => {
    const res = await request(app).get('/api/v1/studies').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get study by ID', async () => {
    const res = await request(app).get(`/api/v1/studies/${studyId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should reject invalid ObjectId for study GET', async () => {
    const res = await request(app).get('/api/v1/studies/notanid').set('Authorization', `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  it('should transition lifecycle to Protocol Ready', async () => {
    const res = await request(app)
      .post(`/api/v1/studies/${studyId}/lifecycle`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Protocol Ready' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Protocol Ready');
  });

  it('should reject invalid lifecycle status', async () => {
    const res = await request(app)
      .post(`/api/v1/studies/${studyId}/lifecycle`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'INVALID_STATUS' });
    expect(res.status).toBe(400);
  });
});
