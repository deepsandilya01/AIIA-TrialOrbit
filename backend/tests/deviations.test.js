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
  const admin = await User.create({ email: 'admin@dev.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@dev.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'DEV-001', title: 'Deviation Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 20 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId, name: 'Dev Site', location: 'Jaipur', status: 'Activated' });
  siteId = site._id.toString();

  const participant = await Participant.create({ studyId, siteId, age: 32, gender: 'Male', status: 'Enrolled', participantCode: 'SUB-123' });
  participantId = participant._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Protocol Deviations Validation', () => {
  let deviationId;

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/deviations')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId }); // Missing siteId, category, description
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should create a valid deviation', async () => {
    const res = await request(app)
      .post('/api/v1/deviations')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, category: 'Visit out of window', description: 'Patient visited 5 days after allowed window', severity: 'Minor' });
    expect(res.status).toBe(201);
    deviationId = res.body.data._id;
  });

  it('should GET all deviations', async () => {
    const res = await request(app).get('/api/v1/deviations').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
