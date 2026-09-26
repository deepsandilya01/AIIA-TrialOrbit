import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import Participant from '../src/models/Participant.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';
let siteId = '';
let participantId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const pi = await User.create({ email: 'pi@part.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'pi@part.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'PAR-001', title: 'Participant Study', phase: 'Phase II', pi_id: pi._id, targetParticipants: 40 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId, name: 'Part Site', location: 'Pune', status: 'Activated' });
  siteId = site._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Participant Validation', () => {
  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/participants')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId }); // Missing age, gender
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject age above 120', async () => {
    const res = await request(app)
      .post('/api/v1/participants')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, age: 150, gender: 'Male' });
    expect(res.status).toBe(400);
  });

  it('should reject invalid gender enum', async () => {
    const res = await request(app)
      .post('/api/v1/participants')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, age: 30, gender: 'Bot' });
    expect(res.status).toBe(400);
  });

  it('should create a valid participant', async () => {
    const res = await request(app)
      .post('/api/v1/participants')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, age: 35, gender: 'Female', participantCode: 'SUB-TEST-001' });
    expect(res.status).toBe(201);
    participantId = res.body.data._id;
  });

  it('should GET participant by ID', async () => {
    if (!participantId) return;
    const res = await request(app).get(`/api/v1/participants/${participantId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should update participant status', async () => {
    if (!participantId) return;
    const res = await request(app)
      .patch(`/api/v1/participants/${participantId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Enrolled', participantCode: 'SUB-123' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Enrolled');
  });

  it('should reject invalid status enum', async () => {
    if (!participantId) return;
    const res = await request(app)
      .patch(`/api/v1/participants/${participantId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'WHATEVER' });
    expect(res.status).toBe(400);
  });
});
