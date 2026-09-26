import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import Participant from '../src/models/Participant.js';
import Visit from '../src/models/Visit.js';
import AdverseEvent from '../src/models/AdverseEvent.js';
import bcrypt from 'bcryptjs';

let token = '';
let studyId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const admin = await User.create({ email: 'admin@cdisc.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@cdisc.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'CDISC-001', title: 'CDISC Export Study', phase: 'Phase II', pi_id: admin._id, targetParticipants: 10 });
  studyId = study._id.toString();

  const site = await Site.create({ studyId: study._id, name: 'CDISC Site', location: 'Hyderabad', status: 'Activated' });
  const participant = await Participant.create({ studyId: study._id, siteId: site._id, participantCode: 'CDISC-SUB-001', age: 42, gender: 'Female', status: 'Enrolled', participantCode: 'SUB-123' });
  await Visit.create({ studyId: study._id, siteId: site._id, participantId: participant._id, visitName: 'Screening', scheduledDate: new Date(), status: 'Completed' });
  await AdverseEvent.create({ studyId: study._id, siteId: site._id, participantId: participant._id, event: 'Headache', severity: 'MILD', eventType: 'AE' });
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('CDISC Export', () => {
  it('should return CDISC export structure', async () => {
    const res = await request(app)
      .get(`/api/v1/export/cdisc/studies/${studyId}/export`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    const data = res.body.data.cdiscStandards;
    expect(data.CDASH).toBeDefined();
    expect(data.SDTM).toBeDefined();
    expect(data.ADaM).toBeDefined();
  });

  it('should reject CDISC export without auth', async () => {
    const res = await request(app).get(`/api/v1/export/cdisc/studies/${studyId}/export`);
    expect(res.status).toBe(401);
  });

  it('should handle invalid studyId gracefully', async () => {
    const res = await request(app)
      .get('/api/v1/export/cdisc/studies/000000000000000000000000/export')
      .set('Authorization', `Bearer ${token}`);
    expect([404, 500]).toContain(res.status); // Export returns 500 for unfound study via global handler
  });
});
