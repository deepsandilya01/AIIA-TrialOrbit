const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const User = require('../models/User');
const Study = require('../models/Study');
const Site = require('../models/Site');
// Other models would go here

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB Connected for Seeding...');
};

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await User.deleteMany();
    await Study.deleteMany();
    await Site.deleteMany();

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    const admin = await User.create({
      email: 'admin@aiia.gov.in',
      passwordHash,
      name: 'System Administrator',
      role: 'ADMIN'
    });

    const pi = await User.create({
      email: 'pi@aiia.gov.in',
      passwordHash,
      name: 'Dr. Anurag Sharma',
      role: 'PI'
    });

    // Create Study
    const study1 = await Study.create({
      protocolId: 'AIIA/CT/2025/001',
      title: 'Effectiveness of Ayurvedic Formulation X in Metabolic Health',
      phase: 'Phase II',
      pi_id: pi._id,
      status: 'Recruiting',
      targetParticipants: 150
    });

    // Create Site
    const site1 = await Site.create({
      studyId: study1._id,
      name: 'AIIA Main Campus Hospital, New Delhi',
      location: 'New Delhi',
      status: 'Activated',
      enrolledCount: 45
    });

    console.log('Seed data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
