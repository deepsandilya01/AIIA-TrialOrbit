import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'APPROVE', 'RESOLVE', 'AI_QUERY', 'AI_ASK']
  },
  actorRole: {
    type: String,
    default: null
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  reason: {
    type: String,
    default: null
  },
  correlationId: {
    type: String, // Useful for tracing multi-step transactions
    default: null
  }
}, {
  timestamps: true // adds createdAt automatically
});

export default mongoose.model('AuditLog', auditLogSchema);
