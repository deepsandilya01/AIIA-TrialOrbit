import Visit from '../models/Visit.js';

class VisitRepository {
  async create(data) {
    const visit = new Visit(data);
    return await visit.save();
  }

  async findById(id) {
    return await Visit.findById(id)
      .populate('studyId', 'protocolId title')
      .populate('siteId', 'name location')
      .populate('participantId', 'participantCode');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { scheduledDate: 1 } }) {
    return await Visit.find(filters)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async findByParticipant(participantId) {
    return await Visit.find({ participantId }).sort({ scheduledDate: 1 });
  }

  async count(filters = {}) {
    return await Visit.countDocuments(filters);
  }

  async updateById(id, updateData) {
    return await Visit.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async completeVisit(id, completedDate = new Date()) {
    return await Visit.findByIdAndUpdate(
      id, 
      { status: 'Completed', completedDate }, 
      { new: true, runValidators: true }
    );
  }

  async countCompliance(filters = {}) {
    const total = await Visit.countDocuments(filters);
    const completed = await Visit.countDocuments({ ...filters, status: 'Completed' });
    return { total, completed, compliance: total > 0 ? (completed / total) * 100 : 0 };
  }
}

export default new VisitRepository();
