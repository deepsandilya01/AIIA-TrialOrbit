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

    // Semantic fix: explicitly count sites in 'Monitoring' status instead of pretending it's 'overdue'
    const sitesInMonitoring = await siteRepository.count({ ...siteFilter, status: 'Monitoring' });

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
      sitesInMonitoring,
      aeCount,
      saeCount,
      overdueSaeCount,
      activeAlertsCount,
      targetParticipants,
      enrolledParticipants: actualEnrolled
    };
  }

  // --- NEW: Recruitment Trend & Compliance Data Aggregations ---

  async getRecruitmentSummary(user) {
    let studyFilter = {};
    let participantFilter = {};
    if (user && user.role !== 'ADMIN') {
      if (user.role === 'PI') {
        const studies = await studyRepository.findMany({ pi_id: user.id });
        const studyIds = studies.map(s => s._id);
        studyFilter = { _id: { $in: studyIds } };
        participantFilter = { studyId: { $in: studyIds } };
      } else if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
        if (!user.siteId) return null;
        const site = await siteRepository.findById(user.siteId);
        if (!site) return null;
        studyFilter = { _id: site.studyId };
        participantFilter = { siteId: user.siteId };
      }
    }

    const ParticipantModel = (await import('../models/Participant.js')).default;
    
    // Total screened (explicitly participants in Screened status)
    const totalScreened = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Screened' });
    
    // Total enrolled
    const totalEnrolled = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Enrolled' });
    
    // Lost to follow up
    const lostToFollowUp = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Lost-to-follow-up' });
    
    // Withdrawn
    const withdrawn = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Withdrawn' });
    
    // Completed
    const completed = await ParticipantModel.countDocuments({ ...participantFilter, status: 'Completed' });

    // Active in protocol - schema has no unified active flag, return null
    const activeInProtocol = null;
    
    // Recruitment Lag - no explicit timeline/business rule defined for this, return null
    const recruitmentLag = null;

    return {
      totalScreened,
      totalEnrolled,
      lostToFollowUp,
      withdrawn,
      completed,
      activeInProtocol,
      recruitmentLag
    };
  }


  async getRecruitmentTrend(user) {
    let studyFilter = {};
    let participantFilter = {};
    if (user && user.role !== 'ADMIN') {
      if (user.role === 'PI') {
        const studies = await studyRepository.findMany({ pi_id: user.id });
        const studyIds = studies.map(s => s._id);
        studyFilter = { _id: { $in: studyIds } };
        participantFilter = { studyId: { $in: studyIds } };
      } else if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
        if (!user.siteId) return [];
        const site = await siteRepository.findById(user.siteId);
        if (!site) return [];
        studyFilter = { _id: site.studyId };
        participantFilter = { siteId: user.siteId };
      }
    }

    const targetAgg = await (await import('../models/Study.js')).default.aggregate([
      { $match: studyFilter },
      { $group: { _id: null, total: { $sum: '$targetParticipants' } } }
    ]);
    const target = targetAgg.length > 0 ? targetAgg[0].total : 0;

    const ParticipantModel = (await import('../models/Participant.js')).default;
    
    // Aggregate enrolled participants by month based on createdAt
    const trendAgg = await ParticipantModel.aggregate([
      { $match: { ...participantFilter, status: 'Enrolled' } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulative = 0;
    
    return trendAgg.map(item => {
      cumulative += item.count;
      return {
        month: `${months[item._id.month - 1]} ${item._id.year}`,
        target: target,
        actual: cumulative
      };
    });
  }

  async getComplianceSummary(user) {
    let studyFilter = {};
    if (user && user.role !== 'ADMIN') {
      if (user.role === 'PI') {
        const studies = await studyRepository.findMany({ pi_id: user.id });
        const studyIds = studies.map(s => s._id);
        studyFilter = { studyId: { $in: studyIds } };
      } else if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
        if (!user.siteId) return [];
        const site = await siteRepository.findById(user.siteId);
        if (!site) return [];
        studyFilter = { studyId: site.studyId };
      }
    }

    const milestones = await regulatoryRepository.findMany(studyFilter);
    return milestones.map(m => ({
      id: m._id,
      req: m.title || m.requirement || 'Regulatory Milestone',
      status: m.status || 'Pending',
      date: new Date(m.targetDate || m.dueDate || m.createdAt).toLocaleDateString('en-GB'),
      days: m.daysRemaining || null,
      authority: m.authority || 'Institutional Authority'
    }));
  }
}

export default new DashboardService();
