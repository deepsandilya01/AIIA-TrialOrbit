import mongoose from 'mongoose';

const consentSchema = new mongoose.Schema({
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    required: true
  },
  consentVersion: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['Electronic', 'Paper', 'Verbal'],
    default: 'Electronic'
  },
  status: {
    type: String,
    enum: ['Active', 'Withdrawn', 'Expired'],
    default: 'Active'
  },
  obtainedAt: {
    type: Date,
    default: Date.now
  },
  withdrawnAt: {
    type: Date,
    default: null
  },
  // Electronic Signature Prototype
  electronicSignature: {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    intent: { type: String, default: 'Consent to participate in clinical trial' },
    hash: { type: String },
    signedAt: { type: Date }
  }
}, {
  timestamps: true
});

export default mongoose.model('Consent', consentSchema);
