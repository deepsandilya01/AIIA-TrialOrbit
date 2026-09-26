import Study from '../models/Study.js';

class StudyRepository {
  async create(data) {
    const study = new Study(data);
    return await study.save();
  }

  async findById(id) {
    return await Study.findById(id).populate('pi_id', 'name email');
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await Study.find(filters)
      .populate('pi_id', 'name email')
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await Study.countDocuments(filters);
  }

  async updateById(id, updateData) {
    return await Study.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async updateLifecycle(id, status) {
    return await Study.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }

  async aggregate(pipeline) {
    return await Study.aggregate(pipeline);
  }
}

export default new StudyRepository();
