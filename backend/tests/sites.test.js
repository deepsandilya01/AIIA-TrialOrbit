import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const pi = await User.create({ email: 'pi@site.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'pi@site.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'SIT-001', title: 'Site Study', phase: 'Phase II', pi_id: pi._id, targetParticipants: 30 });
  studyId = study._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Sites Validation', () => {
  let siteId;

  it('should reject site creation with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId }); // Missing name, location
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should reject invalid ObjectId for studyId', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId: 'bad-id', name: 'Site', location: 'Delhi' });
    expect(res.status).toBe(400);
  });

  it('should create a valid site', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId, name: 'Test Site', location: 'Mumbai' });
    expect(res.status).toBe(201);
    siteId = res.body.data._id;
  });

  it('should GET all sites', async () => {
    const res = await request(app).get('/api/v1/sites').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should GET site by ID', async () => {
    if (!siteId) return;
    const res = await request(app).get(`/api/v1/sites/${siteId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should update site status', async () => {
    if (!siteId) return;
    const res = await request(app)
      .patch(`/api/v1/sites/${siteId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Activated' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Activated');
  });

  it('should reject invalid status enum', async () => {
    if (!siteId) return;
    const res = await request(app)
      .patch(`/api/v1/sites/${siteId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'WRONG' });
    expect(res.status).toBe(400);
  });
});
