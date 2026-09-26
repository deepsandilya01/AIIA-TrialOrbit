import ProtocolDeviation from '../models/ProtocolDeviation.js';

class DeviationRepository {
  async create(data) {
    const deviation = new ProtocolDeviation(data);
    return await deviation.save();
  }

  async findById(id) {
    return await ProtocolDeviation.findById(id)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await ProtocolDeviation.find(filters)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await ProtocolDeviation.countDocuments(filters);
  }

  async countOpen() {
    return await ProtocolDeviation.countDocuments({ status: { $ne: 'Resolved' } });
  }

  async updateStatus(id, status) {
    return await ProtocolDeviation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
}

export default new DeviationRepository();
