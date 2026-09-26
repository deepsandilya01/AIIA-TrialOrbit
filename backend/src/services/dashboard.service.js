import studyRepository from '../repositories/study.repository.js';
import siteRepository from '../repositories/site.repository.js';
import participantRepository from '../repositories/participant.repository.js';
import queryRepository from '../repositories/dataQuery.repository.js';
import deviationRepository from '../repositories/deviation.repository.js';
import alertRepository from '../repositories/alert.repository.js';
import regulatoryRepository from '../repositories/regulatory.repository.js';

class DashboardService {
  async getKPIs() {
    const totalStudies = await studyRepository.count();
    const activeStudies = await studyRepository.count({ status: { $in: ['Recruiting', 'Active Follow-up'] } });
    const totalSites = await siteRepository.count();
    
    // Recruitment metrics
    const targetAgg = await studyRepository.aggregate([{ $group: { _id: null, total: { $sum: '$targetParticipants' } } }]);
    const targetParticipants = targetAgg.length > 0 ? targetAgg[0].total : 0;
    const enrolledParticipants = await participantRepository.countByStatus('Enrolled');
    const recruitmentProgress = targetParticipants > 0 ? (enrolledParticipants / targetParticipants) * 100 : 0;

    // Site Activation %
    const activatedSites = await siteRepository.count({ status: { $in: ['Activated', 'Recruiting', 'Monitoring'] } });
    const siteActivationRate = totalSites > 0 ? (activatedSites / totalSites) * 100 : 0;

    // Safety (Adverse Events)
    const AdverseEvent = (await import('../models/AdverseEvent.js')).default;
    const aeCount = await AdverseEvent.countDocuments({ eventType: 'AE' });
    const saeCount = await AdverseEvent.countDocuments({ eventType: 'SAE' });
    const overdueSaeCount = await AdverseEvent.countDocuments({ reportingStatus: 'OVERDUE' });

    // Visits Compliance % (On-time completed / due * 100)
    const Visit = (await import('../models/Visit.js')).default;
    const completedVisits = await Visit.countDocuments({ status: 'Completed' });
    const dueVisits = await Visit.countDocuments({ status: { $in: ['Scheduled', 'Completed', 'Overdue'] } });
    const visitCompliance = dueVisits > 0 ? (completedVisits / dueVisits) * 100 : 0;

    const activeAlertsCount = await alertRepository.countActive();
    const unresolvedQueries = await queryRepository.countOpen();
    const openDeviations = await deviationRepository.countOpen();
    const pendingRegulatory = await regulatoryRepository.countPending();
    
    const overdueRegulatory = await regulatoryRepository.findOverdue();
    const overdueRegulatoryCount = overdueRegulatory.length;

    // Monitoring Overdue (Mock metric derived from sites lacking recent monitoring)
    const monitoringOverdue = await siteRepository.count({ status: 'Monitoring' /* Ideally checks date */ });

    return {
      totalStudies,
      activeStudies,
      totalSites,
      recruitmentProgress,
      recruitmentLag: targetParticipants - enrolledParticipants,
      siteActivationRate,
      visitCompliance,
      unresolvedQueries,
      queryAging: unresolvedQueries, // Number of open queries (aging KPI)
      openDeviations,
      pendingRegulatory,
      overdueRegulatoryCount,
      monitoringOverdue,
      aeCount,
      saeCount,
      overdueSaeCount,
      activeAlertsCount
    };
  }
}

export default new DashboardService();
