import Alert from '../models/Alert.js';

class AlertRepository {
  async create(data) {
    const alert = new Alert(data);
    return await alert.save();
  }

  async findExistingAlert(entityId, type) {
    return await Alert.findOne({ entityId, type, status: { $nin: ['ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'] } });
  }

  async findActiveForUser(userId, role) {
    return await Alert.find({
      status: 'OPEN',
      $or: [
        { userId: userId },
        { role: role }
      ]
    }).sort({ severity: -1, createdAt: -1 });
  }

  async findMany(filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    return await Alert.find(filters)
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async count(filters = {}) {
    return await Alert.countDocuments(filters);
  }

  async countActive() {
    return await Alert.countDocuments({ status: 'OPEN' });
  }

  async acknowledge(id, userId) {
    return await Alert.findByIdAndUpdate(
      id,
      { status: 'ACKNOWLEDGED', acknowledgedAt: new Date(), acknowledgedBy: userId },
      { new: true, runValidators: true }
    );
  }
}

export default new AlertRepository();
