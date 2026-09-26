import studyRepository from '../repositories/study.repository.js';
import siteRepository from '../repositories/site.repository.js';
import participantRepository from '../repositories/participant.repository.js';
import queryRepository from '../repositories/dataQuery.repository.js';
import deviationRepository from '../repositories/deviation.repository.js';
import alertRepository from '../repositories/alert.repository.js';
import regulatoryRepository from '../repositories/regulatory.repository.js';

class DashboardService {
  async getKPIs() {
    // In a massive DB these would be grouped/cached, but for now we count them directly
    const totalStudies = await studyRepository.count();
    const activeStudies = await studyRepository.count({ status: { $in: ['Recruiting', 'Active Follow-up'] } });
    const totalSites = await siteRepository.count();
    
    // Total enrolled vs target
    const targetAgg = await studyRepository.aggregate([{ $group: { _id: null, total: { $sum: '$targetParticipants' } } }]);
    const targetParticipants = targetAgg.length > 0 ? targetAgg[0].total : 0;
    
    const enrolledParticipants = await participantRepository.countByStatus('Enrolled');
    const recruitmentProgress = targetParticipants > 0 ? (enrolledParticipants / targetParticipants) * 100 : 0;

    const activeAlertsCount = await alertRepository.countActive();
    const unresolvedQueries = await queryRepository.countOpen();
    const openDeviations = await deviationRepository.countOpen();
    const pendingRegulatory = await regulatoryRepository.countPending();

    return {
      totalStudies,
      activeStudies,
      totalSites,
      recruitmentProgress,
      activeAlertsCount,
      unresolvedQueries,
      openDeviations,
      pendingRegulatory
    };
  }
}

export default new DashboardService();
