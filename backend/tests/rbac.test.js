import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import bcrypt from 'bcryptjs';

let adminToken = '';
let piToken = '';
let monitorToken = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await User.create({ email: 'admin@rbac.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  const pi = await User.create({ email: 'pi@rbac.in', passwordHash, name: 'PI', role: 'PI', isActive: true });
  await User.create({ email: 'monitor@rbac.in', passwordHash, name: 'Monitor', role: 'MONITOR', isActive: true });

  const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@rbac.in', password: 'password123' });
  adminToken = adminRes.body.data.token;

  const piRes = await request(app).post('/api/v1/auth/login').send({ email: 'pi@rbac.in', password: 'password123' });
  piToken = piRes.body.data.token;

  const monitorRes = await request(app).post('/api/v1/auth/login').send({ email: 'monitor@rbac.in', password: 'password123' });
  monitorToken = monitorRes.body.data.token;

  const study = await Study.create({ protocolId: 'RBAC-001', title: 'RBAC Test Study', phase: 'Phase I', pi_id: pi._id, targetParticipants: 10 });
  studyId = study._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('RBAC — Role-Based Access Control', () => {
  it('MONITOR cannot create a study', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${monitorToken}`)
      .send({ protocolId: 'RBAC-002', title: 'Attempt', phase: 'Phase I', targetParticipants: 10 });
    expect(res.status).toBe(403);
  });

  it('MONITOR cannot create a site', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${monitorToken}`)
      .send({ studyId, name: 'Site A', location: 'Delhi' });
    expect([403, 401]).toContain(res.status);
  });

  it('PI can create a study', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${piToken}`)
      .send({ protocolId: 'RBAC-003', title: 'PI Study', phase: 'Phase II', targetParticipants: 20 });
    expect(res.status).toBe(201);
  });

  it('ADMIN can list users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('PI cannot list users (admin-only)', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${piToken}`);
    expect(res.status).toBe(403);
  });

  it('MONITOR cannot list users (admin-only)', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${monitorToken}`);
    expect(res.status).toBe(403);
  });

  it('unauthenticated user cannot access any protected route', async () => {
    const res = await request(app).get('/api/v1/studies');
    expect(res.status).toBe(401);
  });
});
