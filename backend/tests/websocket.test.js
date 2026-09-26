import request from 'supertest';
import { io as Client } from 'socket.io-client';
import app from '../src/app.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import { initSocket } from '../src/sockets/index.js';

let server;
let clientSocket;
let token;
let user;
let studyId;
let port = 5005; // Different port for WebSocket tests to avoid conflict

// Set timeout
// jest.setTimeout(15000);

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  user = await User.create({
    name: 'WS Admin',
    email: 'admin_ws@aiia.gov.in',
    passwordHash,
    role: 'ADMIN',
    isActive: true
  });

  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin_ws@aiia.gov.in', password: 'password123' });
  token = res.body.data.token;

  const study = await Study.create({
    protocolId: 'WS-001',
    title: 'WebSocket Test Study',
    phase: 'Phase I',
    pi_id: user._id,
    targetParticipants: 10
  });
  studyId = study._id.toString();

  server = app.listen(port);
  initSocket(server);
});

afterAll(async () => {
  await clearTestDB();
  await closeTestDB();
  if (clientSocket) {
    clientSocket.close();
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('WebSocket Authentication & Authorization', () => {
  it('should reject connection without token', (done) => {
    const socket = Client(`http://localhost:${port}`);
    socket.on('connect_error', (err) => {
      expect(err.message).toBe('Authentication error: Token missing');
      socket.close();
      done();
    });
  });

  it('should reject connection with invalid token', (done) => {
    const socket = Client(`http://localhost:${port}`, {
      auth: { token: 'invalid.token.here' }
    });
    socket.on('connect_error', (err) => {
      expect(err.message).toBe('Authentication error: Invalid token');
      socket.close();
      done();
    });
  });

  it('should connect successfully with valid token', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token }
    });
    clientSocket.on('connect', () => {
      expect(clientSocket.id).toBeDefined();
      done();
    });
  });
});

describe('WebSocket Real-time Emissions', () => {
  beforeAll((done) => {
    if (!clientSocket || !clientSocket.connected) {
      clientSocket = Client(`http://localhost:${port}`, { auth: { token } });
      clientSocket.on('connect', () => {
        clientSocket.emit('join-study', studyId);
        done();
      });
    } else {
      clientSocket.emit('join-study', studyId);
      done();
    }
  });

  it('should receive participant:created when a participant is added', (done) => {
    clientSocket.once('participant:created', (data) => {
      expect(data.participantCode).toBe('WS-P-101');
      expect(data.studyId.toString()).toBe(studyId);
      // Ensure sensitive data is not leaked
      expect(data.passwordHash).toBeUndefined();
      done();
    });

    // Create a site first
    request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId: studyId, name: 'WS Site', location: 'Virtual' })
      .end((err, res) => {
        const siteId = res.body.data._id;
        
        request(app)
          .post('/api/v1/participants')
          .set('Authorization', `Bearer ${token}`)
          .send({
            participantCode: 'WS-P-101',
            studyId: studyId,
            siteId: siteId,
            age: 30,
            gender: 'Male'
          })
          .end((err2, res2) => {
            if (err2) return done(err2);
            expect(res2.status).toBe(201);
          });
      });
  });

  it('should receive safety:event_created when SAE is reported', (done) => {
    let participantId;
    let siteId;
    
    // First setup the site
    request(app)
      .post('/api/v1/sites')
      .set('Authorization', `Bearer ${token}`)
      .send({ studyId: studyId, name: 'WS Site 2', location: 'Virtual' })
      .end((err, res) => {
        siteId = res.body.data._id;
        
        // Setup participant
        request(app)
          .post('/api/v1/participants')
          .set('Authorization', `Bearer ${token}`)
          .send({ participantCode: 'WS-P-102', studyId: studyId, siteId: siteId, age: 35, gender: 'Female' })
          .then(pRes => {
            participantId = pRes.body.data._id;
            
            clientSocket.once('safety:event_created', (data) => {
              expect(data.eventType).toBe('AE');
              expect(data.studyId.toString()).toBe(studyId);
              expect(data._id).toBeDefined();
              done();
            });

            request(app)
              .post('/api/v1/safety/events')
              .set('Authorization', `Bearer ${token}`)
              .send({
                studyId: studyId,
                siteId: siteId,
                participantId: participantId,
                eventType: 'AE',
                event: 'Headache',
                seriousness: 'NON_SERIOUS',
                severity: 'MILD'
              })
              .end((err3, res3) => {
                if (err3) return done(err3);
                expect(res3.status).toBe(201);
              });
          });
      });
  });
});
