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
  const admin = await User.create({ email: 'admin@dq.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@dq.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'DQ-001', title: 'DQ Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 20 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId, name: 'DQ Site', location: 'Bangalore', status: 'Activated' });
  siteId = site._id.toString();

  const participant = await Participant.create({ studyId, siteId, age: 28, gender: 'Other', status: 'Enrolled', participantCode: 'SUB-123' });
  participantId = participant._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Data Quality Validation', () => {
  let queryId;

  it('should reject query creation with missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/data-quality/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId }); // Missing siteId, category, description
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject query creation with short description', async () => {
    const res = await request(app)
      .post('/api/v1/data-quality/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, category: 'Missing Data', description: 'A' }); // Too short
    expect(res.status).toBe(400);
  });

  it('should create a valid query', async () => {
    const res = await request(app)
      .post('/api/v1/data-quality/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, siteId, participantId, category: 'Missing Data', description: 'Blood pressure data is missing for this visit' });
    expect(res.status).toBe(201);
    queryId = res.body.data._id;
  });

  it('should GET all queries', async () => {
    const res = await request(app).get('/api/v1/data-quality/queries').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should resolve a query', async () => {
    if (!queryId) return;
    const res = await request(app)
      .patch(`/api/v1/data-quality/queries/${queryId}/resolve`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
  });
});
