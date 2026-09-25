const mongoose = require('mongoose');

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
    enum: ['Reported', 'Under Review', 'Approved by PI', 'Corrective Action Taken', 'Resolved'],
    default: 'Reported'
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProtocolDeviation', protocolDeviationSchema);
