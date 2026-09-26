import safetyRepository from '../repositories/adverseEvent.repository.js';
import { serializeSafetyEvent } from '../utils/serializers.js';

class SafetyService {
  async createEvent(data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    
    // Set 24h timeline if serious SAE
    if (data.seriousness === 'SERIOUS') {
      const due = new Date();
      due.setHours(due.getHours() + 24);
      data.reportingDueDate = due;
    }
    
    const event = await safetyRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${event.studyId}`, 'safety:event_created', serializeSafetyEvent(event));
    return event;
  }

  async getEventById(id) {
    const event = await safetyRepository.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async getEvents(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.seriousness) filters.seriousness = query.seriousness;
    if (query.status) filters.pvReviewStatus = query.status; // Using pvReviewStatus for generic status query

    const events = await safetyRepository.findMany(filters, { skip, limit });
    const total = await safetyRepository.count(filters);

    return { events, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateEvent(id, data, user) {
    if (user.role === 'REGULATOR') throw new Error('Unauthorized');
    const event = await safetyRepository.update(id, data);
    if (!event) throw new Error('Event not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${event.studyId}`, 'safety:event_updated', serializeSafetyEvent(event));
    return event;
  }

  async pvReview(id, reviewData, user) {
    if (user.role !== 'PHARMACOVIGILANCE' && user.role !== 'ADMIN') {
      throw new Error('Only Pharmacovigilance Officer can perform safety reviews');
    }
    
    const update = {
      ...reviewData,
      pvReviewedBy: user.id,
      pvReviewedAt: new Date(),
      pvReviewStatus: reviewData.status || 'UNDER_REVIEW'
    };
    
    const event = await safetyRepository.update(id, update);
    if (!event) throw new Error('Event not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${event.studyId}`, 'safety:pv_review_updated', serializeSafetyEvent(event));
    return event;
  }

  async checkDueSAEs() {
    const now = new Date();
    const nearDue = new Date(now.getTime() + 12 * 60 * 60 * 1000); // due within next 12 hours
    const dueEvents = await safetyRepository.findMany({ 
      seriousness: 'SERIOUS', 
      reportingStatus: { $ne: 'CLOSED' },
      reportingDueDate: { $lt: nearDue, $gte: now } 
    }, { limit: 1000 });
    
    let count = 0;
    const { emitEvent } = await import('../sockets/index.js');
    for (const ae of dueEvents) {
      emitEvent(`study:${ae.studyId}`, 'safety:sae_due', { eventId: ae._id, eventType: ae.eventType });
      count++;
    }
    return count;
  }

  async checkOverdueSAEs() {
    // Note: requires access to raw repo or mongoose model. Assuming findMany works.
    const overdue = await safetyRepository.findMany({ 
      seriousness: 'SERIOUS', 
      reportingStatus: { $ne: 'CLOSED' },
      reportingDueDate: { $lt: new Date() } 
    }, { limit: 1000 });
    
    let count = 0;
    const { emitEvent } = await import('../sockets/index.js');
    for (const ae of overdue) {
      emitEvent(`study:${ae.studyId}`, 'safety:sae_overdue', { eventId: ae._id, eventType: ae.eventType });
      count++;
    }
    return count;
  }
}

export default new SafetyService();
