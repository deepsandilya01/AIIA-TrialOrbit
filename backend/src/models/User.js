import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
    select: false // Do not return by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['PI', 'COORDINATOR', 'MONITOR', 'PHARMACOVIGILANCE', 'ETHICS', 'ADMIN', 'REGULATOR'],
    required: [true, 'Role is required']
  },
  phone: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
