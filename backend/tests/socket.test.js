import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import app from '../src/app.js';
import { initSocket } from '../src/sockets/index.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import User from '../src/models/User.js';
import Study from '../src/models/Study.js';
import Site from '../src/models/Site.js';
import bcrypt from 'bcryptjs';
import request from 'supertest';

let httpServer;
let port;
let adminToken, piToken, coordTokenA, monitorTokenB, regulatorToken;
let studyIdA, studyIdB;
let siteIdA, siteIdB;

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const piA = await User.create({ email: 'pia@s.in', passwordHash, name: 'PIA', role: 'PI', isActive: true });
  const piB = await User.create({ email: 'pib@s.in', passwordHash, name: 'PIB', role: 'PI', isActive: true });

  const studyA = await Study.create({ protocolId: 'S-001', title: 'Study A', phase: 'Phase II', pi_id: piA._id, targetParticipants: 100 });
  const studyB = await Study.create({ protocolId: 'S-002', title: 'Study B', phase: 'Phase III', pi_id: piB._id, targetParticipants: 200 });
  studyIdA = studyA._id.toString();
  studyIdB = studyB._id.toString();

  const siteA = await Site.create({ name: 'Site A', studyId: studyA._id, status: 'Activated', location: 'Location A' });
  const siteB = await Site.create({ name: 'Site B', studyId: studyB._id, status: 'Activated', location: 'Location B' });
  siteIdA = siteA._id.toString();
  siteIdB = siteB._id.toString();

  const coordA = await User.create({ email: 'coorda@s.in', passwordHash, name: 'Coord A', role: 'COORDINATOR', siteId: siteA._id, isActive: true });
  const monitorB = await User.create({ email: 'monb@s.in', passwordHash, name: 'Mon B', role: 'MONITOR', siteId: siteB._id, isActive: true });
  const regulator = await User.create({ email: 'reg@s.in', passwordHash, name: 'Regulator', role: 'REGULATOR', isActive: true });

  const getT = async (email) => (await request(app).post('/api/v1/auth/login').send({ email, password: 'password123' })).body.data.token;
  
  piToken = await getT('pia@s.in');
  coordTokenA = await getT('coorda@s.in');
  monitorTokenB = await getT('monb@s.in');
  regulatorToken = await getT('reg@s.in');

  httpServer = createServer(app);
  initSocket(httpServer);
  
  await new Promise((resolve) => {
    httpServer.listen(0, () => {
      port = httpServer.address().port;
      resolve();
    });
  });
});

afterAll(async () => {
  if (httpServer) {
    await new Promise((resolve) => {
      httpServer.close(() => {
        resolve();
      });
    });
  }
  await closeTestDB();
});

const connectClient = (token) => {
  return new Promise((resolve, reject) => {
    const socket = Client(`http://localhost:${port}`, {
      auth: { token }
    });
    socket.on('connect', () => {
      resolve(socket);
    });
    socket.on('connect_error', (err) => {
      reject(err);
    });
  });
};

describe('Socket Authorization Tests', () => {
  let clientSocket;

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  test('H. Missing/invalid JWT -> REJECT', async () => {
    await expect(connectClient('invalid-token')).rejects.toThrow('Authentication error: Invalid token');
  });

  test('A. PI Study A -> join Study A -> PASS', (done) => {
    connectClient(piToken).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdA, (response) => {
        expect(response.success).toBe(true);
        done();
      });
    });
  });

  test('B. PI Study A -> attempt Study B -> REJECT', (done) => {
    connectClient(piToken).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdB, (response) => {
        expect(response.success).toBe(false);
        expect(response.error).toBe('Unauthorized study access');
        done();
      });
    });
  });

  test('C. Coordinator Site A -> study associated with Site A -> PASS', (done) => {
    connectClient(coordTokenA).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdA, (response) => {
        expect(response.success).toBe(true);
        done();
      });
    });
  });

  test('D. Coordinator Site A -> study associated with Site B -> REJECT', (done) => {
    connectClient(coordTokenA).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdB, (response) => {
        expect(response.success).toBe(false);
        done();
      });
    });
  });

  test('E. Monitor Site B -> Site A study -> REJECT', (done) => {
    connectClient(monitorTokenB).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdA, (response) => {
        expect(response.success).toBe(false);
        done();
      });
    });
  });

  test('F. Regulator -> permitted institutional study -> PASS', (done) => {
    connectClient(regulatorToken).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', studyIdB, (response) => {
        expect(response.success).toBe(true); // REGULATOR has global access
        done();
      });
    });
  });

  test('G. Invalid study ID -> REJECT without crash', (done) => {
    connectClient(coordTokenA).then(socket => {
      clientSocket = socket;
      socket.emit('join-study', 'invalid_id_format', (response) => {
        expect(response.success).toBe(false);
        done();
      });
    });
  });
});
