const AdverseEvent = require('../models/AdverseEvent');

class AdverseEventRepository {
  async create(data) {
    const ae = new AdverseEvent(data);
    return await ae.save();
  }

  async findById(id) {
    return await AdverseEvent.findById(id)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .populate('pvReviewedBy', 'name email');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { reportedAt: -1 } }) {
    return await AdverseEvent.find(filters)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await AdverseEvent.countDocuments(filters);
  }

  async update(id, data) {
    return await AdverseEvent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findExpeditedSAEs() {
    return await AdverseEvent.find({ serious: 'Yes', status: 'Pending Review' })
      .sort({ reportedAt: 1 });
  }
}

module.exports = new AdverseEventRepository();
