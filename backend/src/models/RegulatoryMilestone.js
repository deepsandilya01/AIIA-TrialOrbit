import mongoose from 'mongoose';

const regulatoryMilestoneSchema = new mongoose.Schema({
  studyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Study', required: true },
  type: {
    type: String,
    enum: ['IEC_REVIEW', 'IEC_APPROVAL', 'CTRI_REGISTRATION', 'CTRI_UPDATE', 'REGULATORY_SUBMISSION', 'REGULATORY_RENEWAL', 'SITE_APPROVAL', 'OTHER'],
    required: true
  },
  title: { type: String, required: true, trim: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'DUE', 'OVERDUE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  completedAt: { type: Date, default: null },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('RegulatoryMilestone', regulatoryMilestoneSchema);
