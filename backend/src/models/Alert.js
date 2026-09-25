const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // If null, it could be targeted to a role instead via application logic
  },
  role: {
    type: String, // Target specific role instead of user
    default: null
  },
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    default: null
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Recruitment Lag', 'CTRI Update Due', 'Ethics Due', 'Monitoring Overdue', 'Query Aging', 'SAE Reporting Due', 'SAE Reporting Overdue', 'Data Quality Backlog'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Info', 'Warning', 'Critical'],
    default: 'Info'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  acknowledgedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
