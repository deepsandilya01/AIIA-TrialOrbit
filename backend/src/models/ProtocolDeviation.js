import mongoose from 'mongoose';

const protocolDeviationSchema = new mongoose.Schema({
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
    ref: 'Participant'
  },
  severity: {
    type: String,
    enum: ['Minor', 'Moderate', 'Major', 'Critical'],
    default: 'Minor'
  },
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'CLOSED'],
    default: 'OPEN'
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ProtocolDeviation', protocolDeviationSchema);
