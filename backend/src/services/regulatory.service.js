import regulatoryRepository from '../repositories/regulatory.repository.js';

class RegulatoryService {
  async createMilestone(data, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return await regulatoryRepository.create(data);
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

  async updateMilestone(id, data, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const milestone = await regulatoryRepository.update(id, data);
    if (!milestone) throw new Error('Milestone not found');
    return milestone;
  }

  async completeMilestone(id, user) {
    if (user.role !== 'PI' && user.role !== 'ETHICS' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const milestone = await regulatoryRepository.complete(id, user.id);
    if (!milestone) throw new Error('Milestone not found');
    return milestone;
  }
}

export default new RegulatoryService();
