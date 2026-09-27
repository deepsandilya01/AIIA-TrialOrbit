import participantRepository from '../repositories/participant.repository.js';
import { serializeParticipant } from '../utils/serializers.js';
import { assertSiteAccess } from '../middleware/scope.middleware.js';

class ParticipantService {
  async createParticipant(data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to create participants');
    }

    if (!(await assertSiteAccess(user, data.siteId, data.studyId))) {
      throw new Error('Forbidden: unauthorized site scope');
    }
    
    // Auto-generate Participant Code if not provided
    if (!data.participantCode) {
      const count = await participantRepository.count({ studyId: data.studyId });
      data.participantCode = `P-${1001 + count}`;
    }

    const participant = await participantRepository.create(data);

    // Emit real-time updates
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent('dashboard', 'dashboard:kpi_updated', { metric: 'participant_created', value: 1, studyId: participant.studyId });
    emitEvent(`study:${participant.studyId}`, 'participant:created', serializeParticipant(participant));

    return participant;
  }

  async getParticipants(query, user) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filters = {};
    if (query.studyId) filters.studyId = query.studyId;
    if (query.siteId) filters.siteId = query.siteId;
    if (query.status) filters.status = query.status;
    if (query.search) {
      filters.participantCode = { $regex: query.search, $options: 'i' };
    }

    if (user && (user.role === 'COORDINATOR' || user.role === 'MONITOR')) {
      if (!user.siteId) return { participants: [], pagination: { total: 0, page, pages: 0 } };
      filters.siteId = user.siteId; // hard scope
    } else if (user && user.role === 'PI') {
      const studies = await (await import('../models/Study.js')).default.find({ pi_id: user.id });
      filters.studyId = { $in: studies.map(s => s._id) };
    }

    const participants = await participantRepository.findMany(filters, { skip, limit });
    const total = await participantRepository.count(filters);

    return {
      participants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getParticipantById(id, user) {
    const participant = await participantRepository.findById(id);
    if (!participant) throw new Error('Participant not found');

    if (user && !(await assertSiteAccess(user, participant.siteId, participant.studyId))) {
      throw new Error('Forbidden: unauthorized site scope');
    }

    return participant;
  }

  async updateParticipant(id, data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update participants');
    }

    const existing = await participantRepository.findById(id);
    if (!existing) throw new Error('Participant not found');

    if (!(await assertSiteAccess(user, existing.siteId, existing.studyId))) {
      throw new Error('Forbidden: unauthorized site scope');
    }

    const participant = await participantRepository.updateById(id, data);
    if (!participant) throw new Error('Participant not found');
    
    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${participant.studyId}`, 'participant:updated', serializeParticipant(participant));

    return participant;
  }

  async updateStatus(id, status, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update participant status');
    }

    const participant = await participantRepository.updateStatus(id, status);
    if (!participant) throw new Error('Participant not found');

    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${participant.studyId}`, 'participant:status_changed', serializeParticipant(participant));

    return participant;
  }

  async updateParticipantConsent(id, data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update participant consent');
    }

    const participant = await participantRepository.findById(id);
    if (!participant) throw new Error('Participant not found');

    const Consent = (await import('../models/Consent.js')).default;
    const AuditLog = (await import('../models/AuditLog.js')).default;

    // Handle withdrawal
    if (data.status === 'Withdrawn') {
      await Consent.updateMany(
        { participantId: id, status: 'Active' },
        { status: 'Withdrawn', withdrawnAt: new Date() }
      );
    }

    const consent = await Consent.create({
      participantId: id,
      studyId: participant.studyId,
      consentVersion: data.consentVersion,
      method: data.method,
      status: data.status || 'Active',
      electronicSignature: {
        actorId: user.id,
        intent: 'Consent update via prototype',
        hash: 'PROTOTYPE-HASH-' + Date.now(),
        signedAt: new Date()
      }
    });

    // Update participant master record
    await participantRepository.updateById(id, { consentVersion: data.consentVersion });

    await AuditLog.create({
      actorId: user.id,
      action: 'UPDATE_CONSENT',
      entityType: 'Consent',
      entityId: consent._id,
      oldValue: 'N/A',
      newValue: data.consentVersion,
      reason: 'Consent updated'
    });

    const { emitEvent } = await import('../sockets/index.js');
    emitEvent(`study:${participant.studyId}`, 'participant:consent_updated', {
      participantId: participant._id,
      consentId: consent._id,
      status: consent.status,
      version: consent.consentVersion
    });

    return consent;
  }
}

export default new ParticipantService();
