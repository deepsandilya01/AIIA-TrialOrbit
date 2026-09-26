import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    required: true
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  visitName: {
    type: String,
    required: true,
    trim: true
  },
  visitType: {
    type: String,
    enum: ['Clinic', 'Phone', 'Remote'],
    default: 'Clinic'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Due', 'Overdue', 'Completed', 'Missed', 'Cancelled', 'Upcoming'],
    default: 'Scheduled'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Visit', visitSchema);
