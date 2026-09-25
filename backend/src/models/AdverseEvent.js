const mongoose = require('mongoose');

const adverseEventSchema = new mongoose.Schema({
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
  event: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Grade 1 (Mild)', 'Grade 2 (Moderate)', 'Grade 3 (Severe)', 'Grade 4 (Life-threatening)', 'Grade 5 (Death)'],
    required: true
  },
  serious: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  causality: {
    type: String,
    enum: ['Related', 'Probable', 'Possible', 'Unlikely', 'Not Related', 'Unknown'],
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Resolved', 'Resolved with Sequelae', 'Fatal', 'Pending Review'],
    default: 'Ongoing'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  reportingDueAt: {
    type: Date, // Used for tracking 24h SAE timelines
    default: null
  },
  pvReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pvReviewedAt: {
    type: Date,
    default: null
  },
  coding: {
    type: String, // Representative MedDRA/WHODrug code
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdverseEvent', adverseEventSchema);
