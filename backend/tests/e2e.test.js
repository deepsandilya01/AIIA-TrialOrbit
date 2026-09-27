import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';
let siteId = '';
let participantId = '';
let visitId = '';
let queryId = '';
let milestoneId = '';
let aeId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();
}, 30000);

afterAll(async () => {
  await closeTestDB();
});

beforeEach(async () => {
  // We'll keep state across these 'it' blocks because it's an E2E flow.
  // But we need initial data.
});

describe('E2E Clinical Trial Management System Flow', () => {
  
  it('0. Should setup initial admin user', async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    await User.create({
      name: 'System Admin',
      email: 'admin@aiia.gov.in',
      passwordHash,
      role: 'ADMIN',
      isActive: true
    });
  });

  it('1. LOGIN', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@aiia.gov.in', password: 'password123' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    token = res.body.data.token;
    expect(token).toBeDefined();
  });

  it('2. DASHBOARD (Initial)', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/kpis')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalStudies).toBe(0);
  });

  it('3. CREATE STUDY', async () => {
    const res = await request(app)
      .post('/api/v1/studies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        protocolId: 'AIIA-001',
        title: 'E2E Test Study',
        phase: 'Phase II',
        status: 'Draft',
        targetParticipants: 100,
        studyDesign: 'Randomized',
        startDate: new Date()
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    studyId = res.body.data._id;
  });

  it('4. LIFECYCLE TRANSITIONS', async () => {
    const states = [
      'Protocol Ready', 'IEC Review', 'IEC Approved', 
      'CTRI Registered', 'Site Activation', 'Recruiting'
    ];
    for (const state of states) {
      const res = await request(app)
        .post(`/api/v1/studies/${studyId}/lifecycle`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: state });
      
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe(state);
    }
  });

  it('5. CREATE SITE', async () => {
    const res = await request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId: studyId,
        name: 'Test Site 1',
        location: 'Delhi',
        status: 'Setup',
        targetEnrollment: 50
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    siteId = res.body.data._id;
  });

  it('6. ACTIVATE SITE', async () => {
    const res = await request(app)
      .patch(`/api/v1/sites/${siteId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Activated' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Activated');
  });

  it('7. CREATE PARTICIPANT & ENROLL (Consent implied or explicit)', async () => {
    const res = await request(app)
      .post('/api/v1/participants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId,
        siteId,
        participantCode: 'SUB-001',
        age: 30,
        gender: 'Male',
        status: 'Enrolled'
      });
    
    expect(res.status).toBe(201);
    participantId = res.body.data._id;
  });

  it('8. CREATE VISIT', async () => {
    const res = await request(app)
      .post('/api/v1/visits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId,
        siteId,
        participantId,
        visitName: 'Baseline',
        
        scheduledDate: new Date(),
        status: 'Scheduled'
      });
    
    expect(res.status).toBe(201);
    visitId = res.body.data._id;
  });

  it('9. COMPLETE VISIT', async () => {
    const res = await request(app)
      .patch(`/api/v1/visits/${visitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Completed' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Completed');
  });

  it('10. CREATE QUERY', async () => {
    const res = await request(app)
      .post('/api/v1/data-quality/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId,
        siteId,
        participantId,
        category: 'Missing Data',
        description: 'Missing BP',
        severity: 'High',
        status: 'OPEN'
      });
    
    expect(res.status).toBe(201);
    queryId = res.body.data._id;
  });

  it('11. RESOLVE QUERY', async () => {
    const res = await request(app)
      .patch(`/api/v1/data-quality/queries/${queryId}/resolve`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
  });

  it('12. CREATE REGULATORY MILESTONE', async () => {
    const res = await request(app)
      .post('/api/v1/regulatory/milestones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId,
        type: 'IEC_REVIEW',
        title: 'Initial IEC',
        dueDate: new Date(),
        status: 'PENDING'
      });
    
    expect(res.status).toBe(201);
    milestoneId = res.body.data._id;
  });

  it('13. CREATE SAE', async () => {
    const res = await request(app)
      .post('/api/v1/safety/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studyId,
        siteId,
        participantId,
        event: 'Severe Headache',
        severity: 'SEVERE',
        seriousness: 'SERIOUS',
        expectedness: 'UNEXPECTED',
        pvReviewStatus: 'PENDING'
      });
    
    expect(res.status).toBe(201);
    aeId = res.body.data._id;
  });

  it('14. DASHBOARD KPI & AUDIT', async () => {
    const dashRes = await request(app)
      .get('/api/v1/dashboard/kpis')
      .set('Authorization', `Bearer ${token}`);
    
    expect(dashRes.status).toBe(200);
    expect(dashRes.body.data.totalStudies).toBe(1);

    const auditRes = await request(app)
      .get('/api/v1/audit-logs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(auditRes.status).toBe(200);
    // At least the study lifecycle transitions should be here
    expect(auditRes.body.data.length).toBeGreaterThan(0);
  });

});
