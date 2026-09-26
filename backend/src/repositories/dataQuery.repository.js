import DataQuery from '../models/DataQuery.js';

class DataQueryRepository {
  async create(data) {
    const query = new DataQuery(data);
    return await query.save();
  }

  async findById(id) {
    return await DataQuery.findById(id)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .populate('assignedTo', 'name email');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await DataQuery.find(filters)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .populate('participantId', 'participantCode')
      .populate('assignedTo', 'name email')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await DataQuery.countDocuments(filters);
  }

  async countOpen() {
    return await DataQuery.countDocuments({ status: { $ne: 'RESOLVED' } });
  }

  async resolve(id) {
    return await DataQuery.findByIdAndUpdate(
      id,
      { status: 'RESOLVED', resolvedAt: new Date() },
      { new: true, runValidators: true }
    );
  }
}

export default new DataQueryRepository();
