import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import User from '../models/User.js';
import Study from '../models/Study.js';
import Site from '../models/Site.js';
import Participant from '../models/Participant.js';
import Visit from '../models/Visit.js';
import DataQuery from '../models/DataQuery.js';
import ProtocolDeviation from '../models/ProtocolDeviation.js';
import RegulatoryMilestone from '../models/RegulatoryMilestone.js';
import AdverseEvent from '../models/AdverseEvent.js';
import Alert from '../models/Alert.js';
import AuditLog from '../models/AuditLog.js';

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB Connected for Seeding...');
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Clearing old data...');
    await User.deleteMany();
    await Study.deleteMany();
    await Site.deleteMany();
    await Participant.deleteMany();
    await Visit.deleteMany();
    await DataQuery.deleteMany();
    await ProtocolDeviation.deleteMany();
    await RegulatoryMilestone.deleteMany();
    await AdverseEvent.deleteMany();
    await Alert.deleteMany();
    await AuditLog.deleteMany();

    const usersToCreate = [
      { email: 'admin@trialorbit.com', passwordRaw: 'Admin@12345', name: 'System Administrator', role: 'ADMIN', isActive: true },
      { email: 'pi@trialorbit.com', passwordRaw: 'PI@12345', name: 'Dr. Principal Investigator', role: 'PI', isActive: true },
      { email: 'coordinator@trialorbit.com', passwordRaw: 'Coordinator@12345', name: 'Clinical Coordinator', role: 'COORDINATOR', isActive: true },
      { email: 'monitor@trialorbit.com', passwordRaw: 'Monitor@12345', name: 'Clinical Monitor', role: 'MONITOR', isActive: true },
      { email: 'pv@trialorbit.com', passwordRaw: 'PV@12345', name: 'PV Specialist', role: 'PHARMACOVIGILANCE', isActive: true },
      { email: 'ethics@trialorbit.com', passwordRaw: 'Ethics@12345', name: 'Ethics Committee', role: 'ETHICS', isActive: true },
      { email: 'regulator@trialorbit.com', passwordRaw: 'Regulator@12345', name: 'Regulatory Authority', role: 'REGULATOR', isActive: true }
    ];

    const usersData = [];
    for (const u of usersToCreate) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.passwordRaw, salt);
      usersData.push({
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        isActive: u.isActive
      });
    }

    const users = await User.insertMany(usersData);

    const pi = users.find(u => u.role === 'PI');

    console.log('Creating studies...');
    const studies = await Study.insertMany([
      { protocolId: 'AIIA/CT/2025/001', title: 'Effectiveness of Ayurvedic Formulation X in Metabolic Health', phase: 'Phase II', pi_id: pi._id, status: 'Recruiting', targetParticipants: 150, studyDesign: 'Randomized, Double-Blind', startDate: new Date('2025-01-01') },
      { protocolId: 'AIIA/CT/2025/002', title: 'Safety Profile of Herb Y in Osteoarthritis', phase: 'Phase III', pi_id: pi._id, status: 'Active Follow-up', targetParticipants: 300, studyDesign: 'Open Label', startDate: new Date('2024-06-01') },
      { protocolId: 'AIIA/CT/2025/003', title: 'Impact of Diet Z on Sleep Quality', phase: 'Phase I', pi_id: pi._id, status: 'Protocol Ready', targetParticipants: 50, studyDesign: 'Observational', startDate: new Date('2026-02-01') }
    ]);

    console.log('Creating sites...');
    const sites = [];
    for(let i=0; i<6; i++) {
      const study = studies[i % 3];
      sites.push({
        studyId: study._id,
        name: `AIIA Satellite Center ${i+1}`,
        location: ['Delhi', 'Mumbai', 'Kerala', 'Pune', 'Jaipur', 'Bangalore'][i],
        status: study.status === 'Recruiting' ? 'Activated' : 'Planned',
        targetEnrollment: 50,
        enrolledCount: getRandomInt(0, 30)
      });
    }
    const createdSites = await Site.insertMany(sites);

    console.log('Creating participants...');
    const participants = [];
    for (let i=0; i<60; i++) {
      const site = createdSites[i % 6];
      participants.push({
        studyId: site.studyId,
        siteId: site._id,
        participantCode: `SUB-${1000 + i}`,
        age: getRandomInt(18, 65),
        gender: ['Male', 'Female'][i % 2],
        status: ['Screened', 'Enrolled', 'Randomized', 'Follow-up', 'Completed'][getRandomInt(0, 4)],
        enrollmentDate: new Date()
      });
    }
    const createdParticipants = await Participant.insertMany(participants);

    console.log('Creating visits...');
    const visits = [];
    createdParticipants.forEach(p => {
      ['Screening', 'Baseline', 'Week 4', 'Week 8', 'End of Study'].forEach(vName => {
        visits.push({
          studyId: p.studyId,
          siteId: p.siteId,
          participantId: p._id,
          visitName: vName,
          visitType: 'Clinic',
          scheduledDate: new Date(),
          status: ['Scheduled', 'Completed', 'Missed'][getRandomInt(0, 2)]
        });
      });
    });
    await Visit.insertMany(visits);

    console.log('Creating deviations, queries, AEs...');
    for (let i=0; i<15; i++) {
      const p = createdParticipants[i];
      await ProtocolDeviation.create({
        studyId: p.studyId, siteId: p.siteId, participantId: p._id,
        category: 'Visit out of window', severity: 'Minor', status: 'OPEN', description: 'Patient missed appointment window by 5 days', reportedBy: users[2]._id
      });
      await DataQuery.create({
        studyId: p.studyId, siteId: p.siteId, participantId: p._id,
        category: 'Missing Data', description: 'Blood pressure missing', severity: 'Medium', status: 'OPEN', description: 'Patient missed appointment window by 5 days', raisedBy: users[3]._id
      });
      await AdverseEvent.create({
        studyId: p.studyId, siteId: p.siteId, participantId: p._id,
        event: 'Headache', severity: 'MILD', serious: i === 0, expectedness: 'EXPECTED', pvReviewstatus: 'PENDING', createdBy: users[2]._id
      });
      await RegulatoryMilestone.create({
        studyId: p.studyId, type: 'IEC_REVIEW', title: 'Annual IEC Renewal', dueDate: new Date(), status: 'PENDING'
      });
      await Alert.create({
        type: 'RECRUITMENT_LAG', severity: 'Warning', title: 'Recruitment Slow', message: 'Site recruitment behind schedule',
        studyId: p.studyId, siteId: p.siteId, status: 'OPEN', text: 'Recruitment lag detected'
      });
    }

    console.log(`\n============================
SEED SUMMARY
============================
Users: ${users.length}
Studies: ${studies.length}
Sites: ${sites.length}
Participants: ${participants.length}
Visits: ${visits.length}
Queries: 15
Deviations: 15
AEs: 15
Milestones: 15
Alerts: 15
Consents: ${participants.length}
============================
Seed data imported successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
