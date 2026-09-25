const participantRepository = require('../repositories/participant.repository');

class ParticipantService {
  async createParticipant(data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to create participants');
    }
    
    // Auto-generate Participant Code if not provided
    if (!data.participantCode) {
      const count = await participantRepository.count({ studyId: data.studyId });
      data.participantCode = `P-${1001 + count}`;
    }

    const participant = await participantRepository.create(data);
    return participant;
  }

  async getParticipants(query) {
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

  async getParticipantById(id) {
    const participant = await participantRepository.findById(id);
    if (!participant) throw new Error('Participant not found');
    return participant;
  }

  async updateParticipant(id, data, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update participants');
    }

    const participant = await participantRepository.updateById(id, data);
    if (!participant) throw new Error('Participant not found');
    
    return participant;
  }

  async updateStatus(id, status, user) {
    if (user.role === 'MONITOR' || user.role === 'REGULATOR') {
      throw new Error('Unauthorized to update participant status');
    }

    const participant = await participantRepository.updateStatus(id, status);
    if (!participant) throw new Error('Participant not found');

    return participant;
  }
}

module.exports = new ParticipantService();
