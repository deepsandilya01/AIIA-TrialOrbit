import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import bcrypt from 'bcryptjs';

let adminToken = '';
let piToken = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  await User.create({ email: 'admin@user.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  await User.create({ email: 'pi@user.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@user.in', password: 'password123' });
  adminToken = adminRes.body.data.token;

  const piRes = await request(app).post('/api/v1/auth/login').send({ email: 'pi@user.in', password: 'password123' });
  piToken = piRes.body.data.token;
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('User Management (Admin Only)', () => {
  let userId;

  it('should list all users (admin)', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('should reject user creation with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'new@user.in' }); // missing password, name, role
    expect(res.status).toBe(400);
  });

  it('should reject user creation with invalid role', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'new@user.in', password: 'password123', name: 'New User', role: 'SUPERUSER' });
    expect(res.status).toBe(400);
  });

  it('should create a new user (admin)', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'newcoord@user.in', password: 'password123', name: 'New Coordinator', role: 'COORDINATOR' });
    expect(res.status).toBe(201);
    userId = res.body.data._id;
  });

  it('should update user role (admin)', async () => {
    if (!userId) return;
    const res = await request(app)
      .patch(`/api/v1/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'MONITOR' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('MONITOR');
  });

  it('should update user status (admin)', async () => {
    if (!userId) return;
    const res = await request(app)
      .patch(`/api/v1/users/${userId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it('should prevent PI from listing users', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${piToken}`);
    expect(res.status).toBe(403);
  });
});
