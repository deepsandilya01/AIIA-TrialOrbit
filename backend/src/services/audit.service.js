import auditRepository from '../repositories/audit.repository.js';

class AuditService {
  async log(data) {
    // This method is generally called internally by other services
    return await auditRepository.create(data);
  }

  async getAuditLogs(query, user) {
    // Only Admin and Regulator can view all audit logs
    if (user.role !== 'ADMIN' && user.role !== 'REGULATOR') {
      throw new Error('Unauthorized to view audit logs');
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.actorId) filters.actorId = query.actorId;
    if (query.entityType) filters.entityType = query.entityType;
    if (query.action) filters.action = query.action;
    
    if (query.startDate && query.endDate) {
      filters.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      };
    }

    const logs = await auditRepository.findMany(filters, { skip, limit });
    const total = await auditRepository.count(filters);

    return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

export default new AuditService();
