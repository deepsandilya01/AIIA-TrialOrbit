import studyRepository from '../repositories/study.repository.js';
import { serializeStudy } from '../utils/serializers.js';

class StudyService {
  async createStudy(data, user) {
    if (user.role !== 'PI' && user.role !== 'ADMIN') {
      throw new Error('Only PI or ADMIN can create studies');
    }
    
    // In a real app we'd wrap this in a transaction and log audit trail here
    const study = await studyRepository.create({
      ...data,
      pi_id: user.id
    });

    // Audit Log for study creation
    const AuditLog = (await import('../models/AuditLog.js')).default;
    await AuditLog.create({
      actorId: user.id,
      action: 'CREATE',
      entityType: 'Study',
      entityId: study._id,
      newValue: study.protocolId,
      reason: 'Study created'
    });

    const { emitEvent } = await import('../sockets/index.js');
    emitEvent('dashboard', 'study:created', serializeStudy(study));
    emitEvent('dashboard', 'dashboard:kpi_updated', { trigger: 'study:created' });

    return study;
  }

  async getStudies(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.status) filters.status = query.status;
    if (query.search) {
      filters.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { protocolId: { $regex: query.search, $options: 'i' } }
      ];
    }

    const sort = query.sort ? query.sort : '-createdAt';
    let sortObj = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }

    const studies = await studyRepository.findMany(filters, { skip, limit, sort: sortObj });
    const total = await studyRepository.count(filters);

    return {
      studies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getStudyById(id) {
    const study = await studyRepository.findById(id);
    if (!study) throw new Error('Study not found');
    return study;
  }

  async updateStudy(id, data, user) {
    if (user.role !== 'PI' && user.role !== 'ADMIN') {
      throw new Error('Only PI or ADMIN can update studies');
    }

    // Prevent arbitrary status changes
    if (data.status) {
      delete data.status;
    }

    const study = await studyRepository.updateById(id, data);
    if (!study) throw new Error('Study not found');
    
    // Audit Log
    const AuditLog = (await import('../models/AuditLog.js')).default;
    await AuditLog.create({
      actorId: user.id,
      action: 'UPDATE',
      entityType: 'Study',
      entityId: id,
      oldValue: 'Various',
      newValue: 'Various',
      reason: 'General Update'
    });
    
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${study._id}`, 'study:updated', serializeStudy(study));

    return study;
  }

  async updateLifecycle(id, status, user) {
    if (user.role !== 'PI' && user.role !== 'ADMIN') {
      throw new Error('Only PI or ADMIN can update study lifecycle');
    }

    const study = await studyRepository.findById(id);
    if (!study) throw new Error('Study not found');

    const validTransitions = {
      'Draft': ['Protocol Ready'],
      'Protocol Ready': ['IEC Review'],
      'IEC Review': ['IEC Approved', 'On Hold'],
      'IEC Approved': ['CTRI Registered'],
      'CTRI Registered': ['Site Activation'],
      'Site Activation': ['Recruiting'],
      'Recruiting': ['Active Follow-up'],
      'Active Follow-up': ['Data Cleaning'],
      'Data Cleaning': ['Close-out'],
      'Close-out': ['Archived']
    };

    if (!validTransitions[study.status] || !validTransitions[study.status].includes(status)) {
      throw new Error(`Invalid transition from ${study.status} to ${status}`);
    }

    const oldStatus = study.status;
    const updatedStudy = await studyRepository.updateLifecycle(id, status);

    // Audit Log
    const AuditLog = (await import('../models/AuditLog.js')).default;
    await AuditLog.create({
      actorId: user.id,
      action: 'UPDATE',
      entityType: 'Study',
      entityId: id,
      oldValue: oldStatus,
      newValue: status,
      reason: 'Lifecycle transition'
    });

    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${updatedStudy._id}`, 'study:lifecycle_changed', serializeStudy(updatedStudy));

    return updatedStudy;
  }
}

export default new StudyService();
