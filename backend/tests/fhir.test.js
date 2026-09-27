import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import Participant from '../src/models/Participant.js';
import bcrypt from 'bcryptjs';

let token = '';
let participantId = '';

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const admin = await User.create({ email: 'admin@fhir.in', passwordHash, name: 'Admin', role: 'ADMIN', isActive: true });

  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@fhir.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({ protocolId: 'FHIR-001', title: 'FHIR Study', phase: 'Phase I', pi_id: admin._id, targetParticipants: 10 });
  const site = await Site.create({ studyId: study._id, name: 'FHIR Site', location: 'Kolkata', status: 'Activated' });
  const participant = await Participant.create({ studyId: study._id, siteId: site._id, age: 40, gender: 'Male', status: 'Enrolled', participantCode: 'SUB-123' });
  participantId = participant._id.toString();
}, 30000);

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
});

describe('FHIR Export', () => {
  it('should return a valid FHIR Patient resource', async () => {
    const res = await request(app)
      .get(`/api/v1/export/fhir/patient/${participantId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.resourceType).toBe('Patient');
    expect(res.body.id).toBeDefined();
    
    // Check demographic determinism
    const extension = res.body.extension.find(ext => ext.url === 'http://hl7.org/fhir/StructureDefinition/patient-age');
    expect(extension.valueInteger).toBe(40); // As seeded: age: 40
    
    // Repeated export should be identical
    const res2 = await request(app)
      .get(`/api/v1/export/fhir/patient/${participantId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res2.body.extension).toEqual(res.body.extension);
  });

  it('should reject invalid participantId', async () => {
    const res = await request(app)
      .get('/api/v1/export/fhir/patient/not-an-id')
      .set('Authorization', `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  it('should reject unauthenticated access', async () => {
    const res = await request(app).get(`/api/v1/export/fhir/patient/${participantId}`);
    expect(res.status).toBe(401);
  });
});
