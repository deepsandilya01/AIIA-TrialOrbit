const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
  protocolId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  phase: {
    type: String,
    required: true,
    enum: ['Phase I', 'Phase II', 'Phase IIb', 'Phase III', 'Phase IV', 'Not Applicable']
  },
  pi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'Draft', 
      'Protocol Ready', 
      'IEC Review', 
      'IEC Approved', 
      'CTRI Registered', 
      'Site Activation', 
      'Recruiting', 
      'Active Follow-up', 
      'Data Cleaning', 
      'Close-out', 
      'Archived',
      'On Hold',
      'Terminated'
    ],
    default: 'Draft'
  },
  targetParticipants: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Study', studySchema);
