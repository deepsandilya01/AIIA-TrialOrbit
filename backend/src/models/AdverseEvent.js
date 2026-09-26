import mongoose from 'mongoose';

const adverseEventSchema = new mongoose.Schema({
  studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study', required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
  eventType: { type: String, enum: ['AE', 'ADR', 'SAE'], default: 'AE' },
  event: { type: String, required: true, trim: true },
  onsetDate: { type: Date, default: null },
  resolutionDate: { type: Date, default: null },
  seriousness: { type: String, enum: ['SERIOUS', 'NON_SERIOUS'], default: 'NON_SERIOUS' },
  severity: { type: String, enum: ['MILD', 'MODERATE', 'SEVERE'], default: 'MILD' },
  relationship: { type: String, enum: ['RELATED', 'POSSIBLY_RELATED', 'UNRELATED', 'UNKNOWN'], default: 'UNKNOWN' },
  expectedness: { type: String, enum: ['EXPECTED', 'UNEXPECTED', 'UNKNOWN'], default: 'UNKNOWN' },
  outcome: { type: String, enum: ['RECOVERED', 'RECOVERING', 'NOT_RECOVERED', 'FATAL', 'UNKNOWN'], default: 'UNKNOWN' },
  actionTaken: { type: String, trim: true, default: null },
  reportingDueDate: { type: Date, default: null },
  reportedDate: { type: Date, default: null },
  reportingStatus: { type: String, enum: ['NOT_DUE', 'DUE', 'SUBMITTED', 'OVERDUE', 'CLOSED'], default: 'NOT_DUE' },
  pvReviewStatus: { type: String, enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  codingStatus: { type: String, enum: ['PENDING', 'CODED', 'VERIFIED'], default: 'PENDING' },
  codedTerm: { type: String, trim: true, default: null },
  dictionary: { type: String, trim: true, default: null },
  version: { type: String, trim: true, default: null },
  pvReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pvReviewedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('AdverseEvent', adverseEventSchema);
