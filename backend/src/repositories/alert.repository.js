import Alert from '../models/Alert.js';

class AlertRepository {
  async create(data) {
    const alert = new Alert(data);
    return await alert.save();
  }

  async findExistingAlert(entityId, type) {
    return await Alert.findOne({ entityId, type, resolved: false });
  }

  async findActiveForUser(userId, role) {
    return await Alert.find({
      resolved: false,
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

  async countActive() {
    return await Alert.countDocuments({ resolved: false });
  }

  async acknowledge(id) {
    return await Alert.findByIdAndUpdate(
      id,
      { resolved: true, acknowledgedAt: new Date() },
      { new: true, runValidators: true }
    );
  }
}

export default new AlertRepository();
