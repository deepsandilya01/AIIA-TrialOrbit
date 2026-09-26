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

describe('AUTH Validation — Login', () => {
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
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
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

describe('AUTH Registration', () => {
  it('should register a valid PI user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. New PI',
      email: 'newpi_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'PI'
    });
    if (res.status !== 201) console.log('REGISTER_FAIL_BODY:', JSON.stringify(res.body));
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('newpi_reg@trialorbit.com');
    expect(res.body.data.user.role).toBe('PI');
  });

  it('should never return passwordHash in registration response', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Another',
      email: 'another_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'COORDINATOR'
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject duplicate email registration', async () => {
    // First registration
    await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Duplicate',
      email: 'duplicate_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'PI'
    });
    // Second registration with same email
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Duplicate 2',
      email: 'duplicate_reg@trialorbit.com',
      password: 'AnotherPass@123',
      role: 'PI'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject registration with short password (< 8 chars)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Short',
      email: 'shortpass_reg@trialorbit.com',
      password: '1234567',
      role: 'PI'
    });
    expect(res.status).toBe(400);
  });

  it('should reject registration with invalid email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Bad Email',
      email: 'not-an-email',
      password: 'SecurePass@123',
      role: 'PI'
    });
    expect(res.status).toBe(400);
  });

  it('should reject registration with missing name', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'noname@trialorbit.test',
      password: 'SecurePass@123',
      role: 'PI'
    });
    expect(res.status).toBe(400);
  });

  it('should block ADMIN role self-registration (rejected by validator)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Fake Admin',
      email: 'fakeadmin_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'ADMIN'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should block REGULATOR role self-registration', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Fake Regulator',
      email: 'fakeregulator_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'REGULATOR'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should normalize email to lowercase', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Dr. Uppercase',
      email: 'UpperCase_reg@trialorbit.com',
      password: 'SecurePass@123',
      role: 'MONITOR'
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('uppercase_reg@trialorbit.com');
  });
});
