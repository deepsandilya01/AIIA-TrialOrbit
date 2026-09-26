import studyRepository from '../repositories/study.repository.js';
import siteRepository from '../repositories/site.repository.js';
import participantRepository from '../repositories/participant.repository.js';
import queryRepository from '../repositories/dataQuery.repository.js';
import deviationRepository from '../repositories/deviation.repository.js';
import alertRepository from '../repositories/alert.repository.js';
import regulatoryRepository from '../repositories/regulatory.repository.js';

class DashboardService {
  async getKPIs(user) {
    let studyFilter = {};
    let siteFilter = {};
    let participantFilter = {};

    if (user && user.role !== 'ADMIN') {
      if (user.role === 'PI') {
        studyFilter = { pi_id: user.id };
        const studies = await studyRepository.findMany(studyFilter);
        const studyIds = studies.map(s => s._id);
        siteFilter = { studyId: { $in: studyIds } };
        participantFilter = { studyId: { $in: studyIds } };
      } else if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
        if (user.siteId) {
          siteFilter = { _id: user.siteId };
          participantFilter = { siteId: user.siteId };
          const site = await siteRepository.findById(user.siteId);
          if (site) {
             studyFilter = { _id: site.studyId };
          } else {
             studyFilter = { _id: null };
          }
        } else {
          // If a coordinator/monitor is unassigned, they see nothing
          studyFilter = { _id: null };
          siteFilter = { _id: null };
          participantFilter = { _id: null };
        }
      } else if (user.role === 'ETHICS' || user.role === 'PHARMACOVIGILANCE' || user.role === 'REGULATOR') {
        // These roles generally have global overview of their domains
        studyFilter = {};
        siteFilter = {};
        participantFilter = {};
      }
    }

    const totalStudies = await studyRepository.count(studyFilter);
    const activeStudies = await studyRepository.count({ ...studyFilter, status: { $in: ['Recruiting', 'Active Follow-up'] } });
    const totalSites = await siteRepository.count(siteFilter);
    
    // Recruitment metrics
    const targetAgg = await (await import('../models/Study.js')).default.aggregate([{ $match: studyFilter }, { $group: { _id: null, total: { $sum: '$targetParticipants' } } }]);
    const targetParticipants = targetAgg.length > 0 ? targetAgg[0].total : 0;
    const enrolledParticipants = await participantRepository.countByStatus('Enrolled'); // Assuming participant repo isn't easily scopable, doing manually:
    const ParticipantModel = (await import('../models/Participant.js')).default;
    const actualEnrolled = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Enrolled' });
    const recruitmentProgress = targetParticipants > 0 ? (actualEnrolled / targetParticipants) * 100 : 0;

    // Site Activation %
    const activatedSites = await siteRepository.count({ ...siteFilter, status: { $in: ['Activated', 'Recruiting', 'Monitoring'] } });
    const siteActivationRate = totalSites > 0 ? (activatedSites / totalSites) * 100 : 0;

    // Safety (Adverse Events)
    const AdverseEvent = (await import('../models/AdverseEvent.js')).default;
    const aeCount = await AdverseEvent.countDocuments({ ...participantFilter, eventType: 'AE' });
    const saeCount = await AdverseEvent.countDocuments({ ...participantFilter, eventType: 'SAE' });
    const overdueSaeCount = await AdverseEvent.countDocuments({ ...participantFilter, reportingStatus: 'OVERDUE' });

    // Visits Compliance % (On-time completed / due * 100)
    const Visit = (await import('../models/Visit.js')).default;
    const completedVisits = await Visit.countDocuments({ ...participantFilter, status: 'Completed' });
    const dueVisits = await Visit.countDocuments({ ...participantFilter, status: { $in: ['Scheduled', 'Completed', 'Overdue'] } });
    const visitCompliance = dueVisits > 0 ? (completedVisits / dueVisits) * 100 : 0;

    const Alert = (await import('../models/Alert.js')).default;
    const activeAlertsCount = await Alert.countDocuments({ ...studyFilter, status: 'OPEN' });

    const DataQuery = (await import('../models/DataQuery.js')).default;
    const unresolvedQueries = await DataQuery.countDocuments({ ...participantFilter, status: 'OPEN' });
    
    const ProtocolDeviation = (await import('../models/ProtocolDeviation.js')).default;
    const openDeviations = await ProtocolDeviation.countDocuments({ ...participantFilter, status: 'OPEN' });
    
    const RegulatoryMilestone = (await import('../models/RegulatoryMilestone.js')).default;
    const pendingRegulatory = await RegulatoryMilestone.countDocuments({ ...studyFilter, status: 'PENDING' });
    
    const overdueRegulatoryCount = await RegulatoryMilestone.countDocuments({
      ...studyFilter,
      status: 'PENDING',
      dueDate: { $lt: new Date() }
    });

    // Monitoring Overdue (Mock metric derived from sites lacking recent monitoring)
    const monitoringOverdue = await siteRepository.count({ ...siteFilter, status: 'Monitoring' /* Ideally checks date */ });

    return {
      totalStudies,
      activeStudies,
      totalSites,
      recruitmentProgress,
      recruitmentLag: targetParticipants - actualEnrolled,
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
      activeAlertsCount,
      targetParticipants,
      enrolledParticipants: actualEnrolled
    };
  }
}

export default new DashboardService();
