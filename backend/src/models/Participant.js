const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
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
  participantCode: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Unknown'],
    required: true
  },
  status: {
    type: String,
    enum: [
      'Screened',
      'Eligible',
      'Ineligible',
      'Enrolled',
      'Randomized',
      'Follow-up',
      'Completed',
      'Withdrawn',
      'Lost-to-follow-up'
    ],
    default: 'Screened'
  },
  consentVersion: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Participant', participantSchema);
