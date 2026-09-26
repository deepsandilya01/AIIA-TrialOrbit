import safetyRepository from '../repositories/adverseEvent.repository.js';

class SafetyService {
  async createEvent(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    
    // Set 24h timeline if serious SAE
    if (data.serious === 'Yes') {
      const due = new Date();
      due.setHours(due.getHours() + 24);
      data.reportingDueAt = due;
    }
    
    return await safetyRepository.create(data);
  }

  async getEvents(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.serious) filters.serious = query.serious;
    if (query.status) filters.status = query.status;

    const events = await safetyRepository.findMany(filters, { skip, limit });
    const total = await safetyRepository.count(filters);

    return { events, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateEvent(id, data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    const event = await safetyRepository.update(id, data);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async pvReview(id, reviewData, user) {
    if (user.role !== 'PV_OFFICER' && user.role !== 'ADMIN') {
      throw new Error('Only PV Officer can perform safety reviews');
    }
    
    const update = {
      ...reviewData,
      pvReviewedBy: user.id,
      pvReviewedAt: new Date(),
      status: reviewData.status || 'Ongoing'
    };
    
    const event = await safetyRepository.update(id, update);
    if (!event) throw new Error('Event not found');
    return event;
  }
}

export default new SafetyService();
