import AuditLog from '../models/AuditLog.js';

class AuditRepository {
  async create(data) {
    const log = new AuditLog(data);
    return await log.save();
  }

  async findMany(filters = {}, options = { skip: 0, limit: 50, sort: { createdAt: -1 } }) {
    return await AuditLog.find(filters)
      .populate('actorId', 'name email role')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await AuditLog.countDocuments(filters);
  }

  async findByEntity(entityType, entityId) {
    return await AuditLog.find({ entityType, entityId }).sort({ createdAt: -1 });
  }

  async findByActor(actorId) {
    return await AuditLog.find({ actorId }).sort({ createdAt: -1 });
  }
  
  // STRICT RULE: No update() or delete() methods provided for AuditLog
}

export default new AuditRepository();
