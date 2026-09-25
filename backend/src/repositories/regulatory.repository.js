const RegulatoryMilestone = require('../models/RegulatoryMilestone');

class RegulatoryRepository {
  async create(data) {
    const milestone = new RegulatoryMilestone(data);
    return await milestone.save();
  }

  async findById(id) {
    return await RegulatoryMilestone.findById(id)
      .populate('studyId', 'protocolId title')
      .populate('completedBy', 'name email');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { dueDate: 1 } }) {
    return await RegulatoryMilestone.find(filters)
      .populate('studyId', 'protocolId')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async findOverdue() {
    return await RegulatoryMilestone.find({
      status: 'Pending',
      dueDate: { $lt: new Date() }
    });
  }

  async count(filters = {}) {
    return await RegulatoryMilestone.countDocuments(filters);
  }

  async countPending() {
    return await RegulatoryMilestone.countDocuments({ status: { $ne: 'Completed' } });
  }

  async complete(id, userId) {
    return await RegulatoryMilestone.findByIdAndUpdate(
      id,
      { status: 'Completed', completedAt: new Date(), completedBy: userId },
      { new: true, runValidators: true }
    );
  }

  async update(id, data) {
    return await RegulatoryMilestone.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

module.exports = new RegulatoryRepository();
