const studyRepository = require('../repositories/study.repository');
const siteRepository = require('../repositories/site.repository');
const participantRepository = require('../repositories/participant.repository');
const queryRepository = require('../repositories/dataQuery.repository');
const deviationRepository = require('../repositories/deviation.repository');
const alertRepository = require('../repositories/alert.repository');
const regulatoryRepository = require('../repositories/regulatory.repository');

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

module.exports = new DashboardService();
