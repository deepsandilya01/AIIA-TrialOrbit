import Participant from '../models/Participant.js';

class ParticipantRepository {
  async create(data) {
    const participant = new Participant(data);
    return await participant.save();
  }

  async findById(id) {
    return await Participant.findById(id)
      .populate('studyId', 'protocolId title')
      .populate('siteId', 'name location');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await Participant.find(filters)
      .populate('studyId', 'protocolId')
      .populate('siteId', 'name')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async findByStudy(studyId) {
    return await Participant.find({ studyId }).sort({ createdAt: -1 });
  }

  async findBySite(siteId) {
    return await Participant.find({ siteId }).sort({ createdAt: -1 });
  }

  async count(filters = {}) {
    return await Participant.countDocuments(filters);
  }

  async countByStatus(status) {
    return await Participant.countDocuments({ status });
  }

  async updateById(id, updateData) {
    return await Participant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async updateStatus(id, status) {
    return await Participant.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }
}

export default new ParticipantRepository();
