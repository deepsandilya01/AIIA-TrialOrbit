import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

let token = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  await User.create({ email: 'admin@val.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@val.in', password: 'password123' });
  token = res.body.data.token;
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Validation Coverage', () => {
  it('should reject missing required field (400)', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Missing Protocol ID' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'protocolId' })
      ])
    );
  });

  it('should reject invalid enum (400)', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ protocolId: 'VAL-001', title: 'Enum Test', phase: 'Phase X', targetParticipants: 10 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'phase' })
      ])
    );
  });

  it('should reject invalid ObjectId (400)', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId: 'invalid-id-string', name: 'Site', location: 'Location' });
    expect(res.status).toBe(400);
  });

  it('should reject invalid ISO date (400)', async () => {
    const res = await request(app)
      .post('/api/v1/visits')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        studyId: new mongoose.Types.ObjectId().toString(), 
        siteId: new mongoose.Types.ObjectId().toString(), 
        participantId: new mongoose.Types.ObjectId().toString(), 
        visitName: 'Screening',
        scheduledDate: 'not-a-date' 
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'scheduledDate' })
      ])
    );
  });

  it('should strip unknown fields (stripUnknown: true)', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        protocolId: 'VAL-002', 
        title: 'Unknown Field Test', 
        phase: 'Phase I', 
        targetParticipants: 10,
        hackerField: 'admin: true'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.hackerField).toBeUndefined();
  });
});
