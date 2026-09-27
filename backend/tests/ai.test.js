import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import jwt from 'jsonwebtoken';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('AI Intelligence API', () => {
  let adminToken;
  let piToken;
  let adminUserId;
  let piUserId;
  let studyId;
  let studyBId;

  beforeAll(async () => {
    await connectTestDB();
    await clearTestDB();
    
    // Create an Admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin.ai@trialorbit.com',
      passwordHash: 'password123',
      role: 'ADMIN',
      organization: 'TrialOrbit',
      permissions: ['ai:query']
    });
    adminUserId = adminUser._id;

    // Generate token
    adminToken = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    // Create a PI user (User A)
    const piUser = await User.create({
      name: 'PI User',
      email: 'pi.ai@trialorbit.com',
      passwordHash: 'password123',
      role: 'PI',
      organization: 'TrialOrbit',
      permissions: ['ai:query']
    });
    piUserId = piUser._id;

    // Generate PI token
    piToken = jwt.sign(
      { id: piUser._id, role: piUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    // Create a dummy study A (owned by admin for this test, or some other PI)
    const study = await Study.create({
      protocolId: 'AI-TEST-001',
      title: 'AI Intelligence Test Study A',
      phase: 'Phase III',
      pi_id: adminUserId, // PI user is NOT the PI for this study
      status: 'Recruiting',
      targetParticipants: 100
    });
    studyId = study._id;

    // Create a dummy study B (owned by PI user)
    const studyB = await Study.create({
      protocolId: 'AI-TEST-002',
      title: 'AI Intelligence Test Study B',
      phase: 'Phase III',
      pi_id: piUserId, 
      status: 'Recruiting',
      targetParticipants: 100
    });
    studyBId = studyB._id;
  }, 30000);

  afterAll(async () => {
    await clearTestDB();
    await closeTestDB();
  });

  it('GET /api/v1/ai/studies/:studyId/overview should return deterministic risk score', async () => {
    const res = await request(app)
      .get(`/api/v1/ai/studies/${studyId}/overview`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (res.statusCode !== 200) console.log('ERROR:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('overallRiskScore');
    expect(res.body.data).toHaveProperty('overallRiskLevel');
    expect(res.body.data).toHaveProperty('components');
  });

  it('POST /api/v1/ai/studies/:studyId/explanation should gracefully fallback if LLM not configured', async () => {
    const res = await request(app)
      .post(`/api/v1/ai/studies/${studyId}/explanation`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (res.statusCode !== 200) console.log('ERROR POST:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('aiAvailable');
    expect(res.body.data).toHaveProperty('explanationStatus');
  }, 40000);

  it('should deny access if token is missing', async () => {
    const res = await request(app)
      .get(`/api/v1/ai/studies/${studyId}/overview`);

    expect(res.statusCode).toBe(401);
  });

  it('IDOR TEST: GET /api/v1/ai/studies/:studyId/overview should return 403 when User A accesses Study B (out of scope)', async () => {
    // piToken is User A, studyId is Study B (owned by Admin, not User A)
    const res = await request(app)
      .get(`/api/v1/ai/studies/${studyId}/overview`)
      .set('Authorization', `Bearer ${piToken}`);

    expect(res.statusCode).toBe(403);
  });
});
