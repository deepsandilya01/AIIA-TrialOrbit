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
  const pi = await User.create({ email: 'pi@visit.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'pi@visit.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'VIS-001', title: 'Visit Study', phase: 'Phase I', pi_id: pi._id, targetParticipants: 30 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId, name: 'Visit Site', location: 'Delhi', status: 'Activated' });
  siteId = site._id.toString();

  const participant = await Participant.create({ studyId, siteId, age: 25, gender: 'Female', status: 'Enrolled', participantCode: 'SUB-123' });
  participantId = participant._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Visits Validation', () => {
  let visitId;

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/visits')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, participantId }); // Missing siteId, visitName, scheduledDate
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject invalid ISO date for scheduledDate', async () => {
    const res = await request(app)
      .post('/api/v1/visits')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, visitName: 'Baseline', scheduledDate: 'not-a-date' });
    expect(res.status).toBe(400);
  });

  it('should create a valid visit', async () => {
    const res = await request(app)
      .post('/api/v1/visits')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, visitName: 'Baseline', scheduledDate: new Date().toISOString() });
    expect(res.status).toBe(201);
    visitId = res.body.data._id;
  });

  it('should GET visit by ID', async () => {
    if (!visitId) return;
    const res = await request(app).get(`/api/v1/visits/${visitId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should update visit status to Completed', async () => {
    if (!visitId) return;
    const res = await request(app)
      .patch(`/api/v1/visits/${visitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Completed' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Completed');
  });

  it('should reject invalid status enum', async () => {
    if (!visitId) return;
    const res = await request(app)
      .patch(`/api/v1/visits/${visitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'WRONG_STATUS' });
    expect(res.status).toBe(400);
  });
});
