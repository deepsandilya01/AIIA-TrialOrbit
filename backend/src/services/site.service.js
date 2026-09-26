import siteRepository from '../repositories/site.repository.js';
import { serializeSite } from '../utils/serializers.js';

class SiteService {
  async createSite(data, user) {
    // Basic check - depending on business rules, maybe Monitor can't create
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to create sites');
    }
    
    const site = await siteRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${site.studyId}`, 'site:created', serializeSite(site));
    return site;
  }

  async getSites(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.status) filters.status = query.status;

    const sites = await siteRepository.findMany(filters, { skip, limit });
    const total = await siteRepository.count(filters);

    return {
      sites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getSiteById(id) {
    const site = await siteRepository.findById(id);
    if (!site) throw new Error('Site not found');
    return site;
  }

  async updateSite(id, data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update sites');
    }

    const site = await siteRepository.updateById(id, data);
    if (!site) throw new Error('Site not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${site.studyId}`, 'site:updated', serializeSite(site));
    return site;
  }

  async updateStatus(id, status, user) {
    if (user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update site status');
    }

    const site = await siteRepository.updateStatus(id, status);
    if (!site) throw new Error('Site not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${site.studyId}`, 'site:status_changed', serializeSite(site));
    return site;
  }
}

export default new SiteService();
