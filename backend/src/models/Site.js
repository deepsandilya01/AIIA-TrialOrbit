const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: [
      'Planned',
      'Setup',
      'Activated',
      'Recruiting',
      'Monitoring',
      'Closed'
    ],
    default: 'Planned'
  },
  enrolledCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Site', siteSchema);
