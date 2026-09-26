import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

let adminToken = '';
let piToken = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  await User.create({ email: 'admin@test.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  await User.create({ email: 'pi@test.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.in', password: 'password123' });
  adminToken = adminRes.body.data.token;

  const piRes = await request(app).post('/api/v1/auth/login').send({ email: 'pi@test.in', password: 'password123' });
  piToken = piRes.body.data.token;
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('AUTH Validation', () => {
  it('should reject login with missing email', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors[0].field).toBe('email');
  });

  it('should reject login with invalid email format', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'notanemail', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject login with short password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.com', password: '12' });
    expect(res.status).toBe(400);
  });

  it('should return token on valid login', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.in', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.in', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('should reject access to protected route without token', async () => {
    const res = await request(app).get('/api/v1/studies');
    expect(res.status).toBe(401);
  });

  it('should allow access to protected route with valid token', async () => {
    const res = await request(app).get('/api/v1/studies').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
