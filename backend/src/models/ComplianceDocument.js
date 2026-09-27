import mongoose from 'mongoose';

const complianceDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['PROTOCOL', 'IB', 'ICF', 'GCP_CERT', 'ETHICS_APPROVAL', 'OTHER'], default: 'OTHER' },
  study: { type: mongoose.Schema.Types.ObjectId, ref: 'Study' },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' }
}, {
  timestamps: true
});

export default mongoose.model('ComplianceDocument', complianceDocumentSchema);
