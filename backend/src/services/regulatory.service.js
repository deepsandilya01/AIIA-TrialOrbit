import regulatoryRepository from '../repositories/regulatory.repository.js';
import { serializeRegulatory } from '../utils/serializers.js';

class RegulatoryService {
  async createMilestone(data, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const milestone = await regulatoryRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${milestone.studyId}`, 'regulatory:created', serializeRegulatory(milestone));
    return milestone;
  }

  async getMilestones(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

    const milestones = await regulatoryRepository.findMany(filters, { skip, limit });
    const total = await regulatoryRepository.count(filters);

    return { milestones, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getMilestoneById(id) {
    const milestone = await regulatoryRepository.findById(id);
    if (!milestone) throw new Error('Milestone not found');
    return milestone;
  }

  async updateMilestone(id, data, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const milestone = await regulatoryRepository.update(id, data);
    if (!milestone) throw new Error('Milestone not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${milestone.studyId}`, 'regulatory:updated', serializeRegulatory(milestone));
    return milestone;
  }

  async completeMilestone(id, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const milestone = await regulatoryRepository.complete(id, user.id);
    if (!milestone) throw new Error('Milestone not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${milestone.studyId}`, 'regulatory:updated', serializeRegulatory(milestone));
    return milestone;
  }
}

export default new RegulatoryService();
