const Site = require('../models/Site');

class SiteRepository {
  async create(data) {
    const site = new Site(data);
    return await site.save();
  }

  async findById(id) {
    return await Site.findById(id).populate('studyId', 'protocolId title');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await Site.find(filters)
      .populate('studyId', 'protocolId title')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async findByStudy(studyId) {
    return await Site.find({ studyId }).sort({ createdAt: -1 });
  }

  async count(filters = {}) {
    return await Site.countDocuments(filters);
  }

  async updateById(id, updateData) {
    return await Site.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async updateStatus(id, status) {
    return await Site.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }
}

module.exports = new SiteRepository();
