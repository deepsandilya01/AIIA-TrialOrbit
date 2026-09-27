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
  const admin = await User.create({ email: 'admin@safety.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@safety.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'SAF-001', title: 'Safety Study', phase: 'Phase II', pi_id: admin._id, targetParticipants: 50 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId, name: 'Safety Site', location: 'Mumbai', status: 'Activated' });
  siteId = site._id.toString();

  const participant = await Participant.create({ studyId, siteId, age: 30, gender: 'Male', status: 'Enrolled', participantCode: 'SUB-123' });
  participantId = participant._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Safety / AE/SAE Validation', () => {
  let eventId;

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ siteId, participantId, event: 'Headache' }); // Missing studyId
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid ObjectId for siteId', async () => {
    const res = await request(app)
      .post('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId: 'not-an-objectid', participantId, event: 'Headache' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid enum for seriousness', async () => {
    const res = await request(app)
      .post('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, event: 'Headache', seriousness: 'INVALID_VALUE' });
    expect(res.status).toBe(400);
  });

  it('should create a valid AE', async () => {
    const res = await request(app)
      .post('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, event: 'Mild Headache', severity: 'MILD', seriousness: 'NON_SERIOUS', expectedness: 'EXPECTED' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    eventId = res.body.data._id;
  });

  it('should GET safety event by id', async () => {
    if (!eventId) return;
    const res = await request(app)
      .get(`/api/v1/safety/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(eventId);
  });

  it('should GET all safety events with pagination', async () => {
    const res = await request(app)
      .get('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should update PV review status', async () => {
    if (!eventId) return;
    const res = await request(app)
      .patch(`/api/v1/safety/events/${eventId}/pv-review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ pvReviewStatus: 'UNDER_REVIEW' });
    expect(res.status).toBe(200);
    expect(res.body.data.pvReviewStatus).toBe('UNDER_REVIEW');
  });

  it('should reject invalid pvReviewStatus enum', async () => {
    if (!eventId) return;
    const res = await request(app)
      .patch(`/api/v1/safety/events/${eventId}/pv-review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ pvReviewStatus: 'INVALID' });
    expect(res.status).toBe(400);
  });
});
