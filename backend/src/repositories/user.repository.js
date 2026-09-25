const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+passwordHash');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20 }) {
    return await User.find(filters)
      .skip(options.skip)
      .limit(options.limit)
      .sort({ createdAt: -1 });
  }

  async count(filters = {}) {
    return await User.countDocuments(filters);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new UserRepository();
