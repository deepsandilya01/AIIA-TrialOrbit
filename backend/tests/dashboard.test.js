import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import bcrypt from 'bcryptjs';

let adminToken = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const admin = await User.create({ email: 'admin@dash.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });
  await User.create({ email: 'pi@dash.in', passwordHash, name: 'PI', role: 'PI', isActive: true });

  const adminRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@dash.in', password: 'password123' });
  adminToken = adminRes.body.data.token;

  const study = await Study.create({ protocolId: 'DASH-001', title: 'Dashboard Study', phase: 'Phase II', pi_id: admin._id, targetParticipants: 100 });
  studyId = study._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('Dashboard KPIs', () => {
  it('should return KPIs with database-driven values', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/kpis')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    // All values should be numbers (not strings like '14 Days')
    expect(typeof data.totalStudies).toBe('number');
    expect(typeof data.activeStudies).toBe('number');
    expect(typeof data.totalSites).toBe('number');
    expect(typeof data.aeCount).toBe('number');
    expect(typeof data.saeCount).toBe('number');
    expect(data.totalStudies).toBeGreaterThanOrEqual(1);
  });

  it('should explicitly count sites in Monitoring status for sitesInMonitoring metric', async () => {
    const Site = (await import('../src/models/Site.js')).default;
    const pi = await User.findOne({ role: 'PI' });
    await Site.create({ studyId, code: 'MON-001', name: 'Monitoring Site A', location: 'New York', pi_id: pi._id, status: 'Monitoring' });
    
    const res = await request(app)
      .get('/api/v1/dashboard/kpis')
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.data.sitesInMonitoring).toBeGreaterThanOrEqual(1);
    expect(res.body.data.monitoringOverdue).toBeUndefined(); // Verify the mock metric was removed
  });

  it('should reject dashboard KPI request without auth', async () => {
    const res = await request(app).get('/api/v1/dashboard/kpis');
    expect(res.status).toBe(401);
  });
});
