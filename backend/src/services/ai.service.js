import env from '../config/env.js';
import Study from '../models/Study.js';
import Site from '../models/Site.js';
import Participant from '../models/Participant.js';
import AdverseEvent from '../models/AdverseEvent.js';
import AuditLog from '../models/AuditLog.js';

class AIService {
  async processKpiQuery(query, user, filters = {}) {
    // Deterministic fallback for KPI queries
    const activeStudies = await Study.countDocuments({ status: { $in: ['Recruiting', 'Active-Follow-Up'] } });
    const totalParticipants = await Participant.countDocuments({});

    const result = {
      intent: "KPI_QUERY",
      authorized: true,
      data: {
        activeStudies,
        totalParticipants,
        note: "Data generated deterministically by backend analytics."
      },
      explanation: "There are currently " + activeStudies + " active studies and " + totalParticipants + " participants in the system."
    };

    await this._logAIAudit(user, 'kpi-query');
    return result;
  }

  async processRecruitmentRisk(studyId, user) {
    const study = await Study.findById(studyId);
    if (!study) throw new Error('Study not found');

    const participants = await Participant.countDocuments({ studyId });
    const target = study.targetEnrollment || 1;
    const progress = (participants / target) * 100;

    let riskLevel = 'LOW';
    let explanation = `Recruitment is progressing well (${progress.toFixed(2)}% of target).`;

    if (progress < 50) {
      riskLevel = 'HIGH';
      explanation = `Recruitment is at high risk (${progress.toFixed(2)}% of target). Immediate action required.`;
    } else if (progress < 80) {
      riskLevel = 'MEDIUM';
      explanation = `Recruitment is slightly behind schedule (${progress.toFixed(2)}% of target).`;
    }

    const result = {
      intent: "RECRUITMENT_RISK",
      authorized: true,
      data: {
        studyId,
        target,
        current: participants,
        riskLevel
      },
      explanation
    };

    await this._logAIAudit(user, 'recruitment-risk');
    return result;
  }

  async processAnomalyDetection(studyId, user) {
    // A deterministic anomaly check: look for sites with zero recruitment
    const sites = await Site.find({ studyId, status: 'Activated' });
    const anomalies = [];

    for (const site of sites) {
      const pCount = await Participant.countDocuments({ siteId: site._id });
      if (pCount === 0) {
        anomalies.push({
          siteId: site._id,
          siteName: site.name,
          issue: "Zero participants recruited despite active status."
        });
      }
    }

    const result = {
      intent: "ANOMALY_DETECTION",
      authorized: true,
      data: {
        anomaliesFound: anomalies.length,
        anomalies
      },
      explanation: anomalies.length > 0 
        ? `Found ${anomalies.length} anomalous sites with zero recruitment.` 
        : "No significant recruitment anomalies detected."
    };

    await this._logAIAudit(user, 'anomaly-detection');
    return result;
  }

  async processSafetySummary(studyId, user) {
    const aes = await AdverseEvent.find({ studyId });
    const seriousCount = aes.filter(ae => ae.seriousness === 'SERIOUS').length;
    
    const result = {
      intent: "SAFETY_SUMMARY",
      authorized: true,
      data: {
        totalEvents: aes.length,
        seriousEvents: seriousCount
      },
      explanation: `There are a total of ${aes.length} adverse events reported, of which ${seriousCount} are marked as serious.`
    };

    await this._logAIAudit(user, 'safety-summary');
    return result;
  }

  async _logAIAudit(user, endpoint) {
    await AuditLog.create({
      actorId: user._id,
      actorRole: user.role,
      action: 'AI_QUERY',
      entityType: 'AI_Service',
      entityId: user._id, // placeholder
      reason: `User initiated safe AI query to /api/ai/${endpoint}`
    });
  }
}

export default new AIService();
