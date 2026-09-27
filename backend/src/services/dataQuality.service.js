import dataQueryRepository from '../repositories/dataQuery.repository.js';
import deviationRepository from '../repositories/deviation.repository.js';
import { serializeQuery } from '../utils/serializers.js';
import { assertSiteAccess } from '../middleware/scope.middleware.js';

class DataQualityService {
  // Queries
  async createQuery(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    if (!(await assertSiteAccess(user, data.siteId, data.studyId))) throw new Error('Forbidden: unauthorized site scope');
    const queryDoc = await dataQueryRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${queryDoc.studyId}`, 'query:created', serializeQuery(queryDoc));
    return queryDoc;
  }

  async getQueries(query, user) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

    if (user && (user.role === 'COORDINATOR' || user.role === 'MONITOR')) {
      if (!user.siteId) return { queries: [], pagination: { total: 0, page, pages: 0 } };
      filters.siteId = user.siteId;
    } else if (user && user.role === 'PI') {
      const studies = await (await import('../models/Study.js')).default.find({ pi_id: user.id });
      filters.studyId = { $in: studies.map(s => s._id) };
    }

    const queries = await dataQueryRepository.findMany(filters, { skip, limit });
    const total = await dataQueryRepository.count(filters);

    return { queries, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async resolveQuery(id, user) {
    if (user.role === 'REGULATOR' || user.role === 'MONITOR') {
      throw new Error('Unauthorized to resolve queries');
    }
    const result = await dataQueryRepository.resolve(id);
    if (!result) throw new Error('Query not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${result.studyId}`, 'query:resolved', serializeQuery(result));
    return result;
  }

  // Deviations
  async createDeviation(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    if (!(await assertSiteAccess(user, data.siteId, data.studyId))) throw new Error('Forbidden: unauthorized site scope');
    return await deviationRepository.create(data);
  }

  async getDeviations(query, user) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

    if (user && (user.role === 'COORDINATOR' || user.role === 'MONITOR')) {
      if (!user.siteId) return { deviations: [], pagination: { total: 0, page, pages: 0 } };
      filters.siteId = user.siteId;
    } else if (user && user.role === 'PI') {
      const studies = await (await import('../models/Study.js')).default.find({ pi_id: user.id });
      filters.studyId = { $in: studies.map(s => s._id) };
    }

    const deviations = await deviationRepository.findMany(filters, { skip, limit });
    const total = await deviationRepository.count(filters);

    return { deviations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateDeviationStatus(id, status, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    const deviation = await deviationRepository.updateStatus(id, status);
    if (!deviation) throw new Error('Deviation not found');
    return deviation;
  }
}

export default new DataQualityService();
