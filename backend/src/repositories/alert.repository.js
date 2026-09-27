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
    const query = { status: 'OPEN' };
    if (role !== 'ADMIN' && role !== 'REGULATOR') {
      query.$or = [{ userId: userId }, { role: role }, { userId: null, role: null }];
    }
    return await Alert.find(query).sort({ severity: -1, createdAt: -1 });
  }

  async findManyForUser(userId, role, filters = {}, options = { skip: 0, limit: 20, sort: { createdAt: -1 } }) {
    const query = { ...filters };
    if (role !== 'ADMIN' && role !== 'REGULATOR') {
      query.$or = [{ userId: userId }, { role: role }, { userId: null, role: null }];
    }
    return await Alert.find(query)
      .skip(options.skip)
      .limit(options.limit)
      .sort(options.sort);
  }

  async countForUser(userId, role, filters = {}) {
    const query = { ...filters };
    if (role !== 'ADMIN' && role !== 'REGULATOR') {
      query.$or = [{ userId: userId }, { role: role }, { userId: null, role: null }];
    }
    return await Alert.countDocuments(query);
  }

  async countActive() {
    return await Alert.countDocuments({ status: 'OPEN' });
  }

  async acknowledge(id, userId, role) {
    const query = { _id: id };
    if (role !== 'ADMIN') {
      query.$or = [{ userId: userId }, { role: role }, { userId: null, role: null }];
    }
    const alert = await Alert.findOne(query);
    
    if (!alert) return null;

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = userId;
    return await alert.save();
  }
}

export default new AlertRepository();
