const dataQueryRepository = require('../repositories/dataQuery.repository');
const deviationRepository = require('../repositories/deviation.repository');

class DataQualityService {
  // Queries
  async createQuery(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    return await dataQueryRepository.create(data);
  }

  async getQueries(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

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
    return result;
  }

  // Deviations
  async createDeviation(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    return await deviationRepository.create(data);
  }

  async getDeviations(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

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

module.exports = new DataQualityService();
