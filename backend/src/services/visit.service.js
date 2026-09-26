import visitRepository from '../repositories/visit.repository.js';
import { serializeVisit } from '../utils/serializers.js';

class VisitService {
  async createVisit(data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to schedule visits');
    }
    
    const visit = await visitRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${visit.studyId}`, 'visit:created', serializeVisit(visit));
    return visit;
  }

  async getVisits(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.siteId) filters.siteId = query.siteId;
    if (query.participantId) filters.participantId = query.participantId;
    if (query.status) filters.status = query.status;

    const visits = await visitRepository.findMany(filters, { skip, limit });
    const total = await visitRepository.count(filters);

    return {
      visits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getVisitById(id) {
    const visit = await visitRepository.findById(id);
    if (!visit) throw new Error('Visit not found');
    return visit;
  }

  async updateVisit(id, data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update visits');
    }

    const visit = await visitRepository.updateById(id, data);
    if (!visit) throw new Error('Visit not found');
    
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${visit.studyId}`, 'visit:updated', serializeVisit(visit));
    if (visit.status === 'Missed') {
      emitEvent(`study:${visit.studyId}`, 'visit:missed', serializeVisit(visit));
    }
    
    return visit;
  }

  async completeVisit(id, completedDate, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to complete visits');
    }

    const visit = await visitRepository.completeVisit(id, completedDate);
    if (!visit) throw new Error('Visit not found');

    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${visit.studyId}`, 'visit:completed', serializeVisit(visit));

    return visit;
  }
}

export default new VisitService();
