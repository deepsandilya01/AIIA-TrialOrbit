import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  role: { type: String, default: null },
  studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study', default: null },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', default: null }, // adding siteId back as it was in original
  entityType: { type: String, default: 'Study' },
  entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
  text: { type: String, required: true },
  title: { type: String, default: 'Alert' }, // adding title back
  type: {
    type: String,
    enum: ['RECRUITMENT_LAG', 'CTRI_UPDATE_DUE', 'ETHICS_DUE', 'MONITORING_OVERDUE', 'QUERY_AGING', 'SAE_REPORTING_DUE', 'SAE_REPORTING_OVERDUE', 'DATA_QUALITY_BACKLOG'],
    required: true
  },
  severity: { type: String, enum: ['Info', 'Warning', 'Critical'], default: 'Info' },
  status: {
    type: String,
    enum: ['OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'],
    default: 'OPEN'
  },
  acknowledgedAt: { type: Date, default: null },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
