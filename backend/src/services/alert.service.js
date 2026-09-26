import alertRepository from '../repositories/alert.repository.js';
import regulatoryRepository from '../repositories/regulatory.repository.js';
import { serializeAlert } from '../utils/serializers.js';

class AlertService {
  async createAlert(data) {
    // Check if alert already exists for this entity to prevent spam
    const existing = await alertRepository.findExistingAlert(data.entityId, data.type);
    if (existing) return existing;

    const alert = await alertRepository.create(data);
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`role:${alert.role}`, 'alert:created', serializeAlert(alert));
    return alert;
  }

  async getActiveAlerts(user) {
    return await alertRepository.findActiveForUser(user.id, user.role);
  }

  async getAllAlerts(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const alerts = await alertRepository.findMany({}, { skip, limit });
    const total = await alertRepository.countActive(); // approximation

    return { alerts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async acknowledge(id, user) {
    const alert = await alertRepository.acknowledge(id, user.id, user.role);
    if (!alert) throw new Error('Alert not found');
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`role:${alert.role}`, 'alert:acknowledged', serializeAlert(alert));
    return alert;
  }

  // System methods called by CRON
  async checkOverdueMilestones() {
    const overdue = await regulatoryRepository.findOverdue();
    let count = 0;
    const { emitEvent } = await import('../sockets/index.js');
    for (const ms of overdue) {
      await this.createAlert({
        role: 'ETHICS',
        studyId: ms.studyId,
        entityType: 'RegulatoryMilestone',
        entityId: ms._id,
        text: `Milestone "${ms.title}" is overdue`,
        type: 'ETHICS_DUE',
        severity: 'Critical'
      });
      emitEvent(`study:${ms.studyId}`, 'regulatory:overdue', { milestoneId: ms._id, title: ms.title });
      count++;
    }
    return count;
  }
}

export default new AlertService();
