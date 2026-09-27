import Study from '../models/Study.js';
import Site from '../models/Site.js';
import Participant from '../models/Participant.js';
import DataQuery from '../models/DataQuery.js';
import ProtocolDeviation from '../models/ProtocolDeviation.js';
import AdverseEvent from '../models/AdverseEvent.js';
import RegulatoryMilestone from '../models/RegulatoryMilestone.js';
import Visit from '../models/Visit.js';

class RiskEngineService {
  constructor() {
    this.METHODOLOGY_VERSION = "risk-engine-v1";
    this.WEIGHTS = {
      ENROLLMENT: 0.2,
      SITE: 0.15,
      DATA_QUALITY: 0.2,
      DEVIATIONS: 0.15,
      SAFETY: 0.2,
      REGULATORY: 0.1
    };
  }

  _determineRiskLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 35) return 'MEDIUM';
    return 'LOW';
  }

  async calculateEnrollmentRisk(studyId) {
    const study = await Study.findById(studyId).lean();
    if (!study) throw new Error('Study not found');

    const participants = await Participant.countDocuments({ studyId });
    const target = study.targetEnrollment || 100; // safe default
    
    // Enrollment progress percentage
    const progress = (participants / target) * 100;
    
    let score = 0;
    let drivers = [];
    
    if (progress < 25) {
      score = 75;
      drivers.push(`Enrollment is critically low (${progress.toFixed(1)}% of target).`);
    } else if (progress < 50) {
      score = 50;
      drivers.push(`Enrollment is below expected trajectory (${progress.toFixed(1)}%).`);
    } else {
      score = 10;
      drivers.push(`Enrollment is progressing normally (${progress.toFixed(1)}%).`);
    }

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      progress,
      drivers
    };
  }

  async calculateSiteRisk(studyId) {
    const sites = await Site.find({ studyId }).lean();
    if (sites.length === 0) return { score: 0, riskLevel: 'LOW', metrics: { totalSites: 0, inactiveCount: 0, lowEnrollingCount: 0 }, drivers: ['No sites activated yet.'] };

    let inactiveCount = 0;
    let lowEnrollingCount = 0;

    for (const site of sites) {
      if (site.status === 'Planned' || site.status === 'Setup') {
        inactiveCount++;
      } else if (site.enrolledCount === 0 && site.status === 'Activated') {
        lowEnrollingCount++;
      }
    }

    let score = 0;
    let drivers = [];

    if (inactiveCount > 0) {
      score += (inactiveCount / sites.length) * 50;
      drivers.push(`${inactiveCount} site(s) are stuck in planned/setup phases.`);
    }
    if (lowEnrollingCount > 0) {
      score += (lowEnrollingCount / sites.length) * 50;
      drivers.push(`${lowEnrollingCount} activated site(s) have zero enrollment.`);
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      metrics: {
        totalSites: sites.length,
        inactiveCount,
        lowEnrollingCount
      },
      drivers: drivers.length ? drivers : ['All sites are performing normally.']
    };
  }

  async calculateDataQualityRisk(studyId) {
    const queries = await DataQuery.find({ studyId }).lean();
    
    const openQueries = queries.filter(q => q.status === 'OPEN' || q.status === 'IN_REVIEW');
    const highSevQueries = openQueries.filter(q => q.severity === 'High' || q.severity === 'Critical');
    
    let score = 0;
    let drivers = [];

    if (openQueries.length > 20) {
      score += 40;
      drivers.push(`High backlog of open queries (${openQueries.length}).`);
    } else if (openQueries.length > 5) {
      score += 20;
    }

    if (highSevQueries.length > 5) {
      score += 60;
      drivers.push(`Multiple critical/high severity data queries unresolved (${highSevQueries.length}).`);
    } else if (highSevQueries.length > 0) {
      score += 30;
      drivers.push(`Contains high severity data queries.`);
    }

    score = Math.min(score, 100);

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      metrics: {
        totalQueries: queries.length,
        openQueries: openQueries.length,
        highSevQueries: highSevQueries.length
      },
      drivers: drivers.length ? drivers : ['Data quality is within normal limits.']
    };
  }

  async calculateDeviationRisk(studyId) {
    const deviations = await ProtocolDeviation.find({ studyId }).lean();
    
    const openDeviations = deviations.filter(d => d.status === 'OPEN' || d.status === 'UNDER_INVESTIGATION');
    const majorDeviations = deviations.filter(d => d.severity === 'Major' || d.severity === 'Critical');

    let score = 0;
    let drivers = [];

    if (openDeviations.length > 10) {
      score += 50;
      drivers.push(`Unresolved protocol deviations are accumulating (${openDeviations.length}).`);
    }

    if (majorDeviations.length > 2) {
      score += 50;
      drivers.push(`Major protocol deviations detected (${majorDeviations.length}).`);
    }

    score = Math.min(score, 100);

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      metrics: {
        totalDeviations: deviations.length,
        openDeviations: openDeviations.length,
        majorDeviations: majorDeviations.length
      },
      drivers: drivers.length ? drivers : ['Protocol compliance is stable.']
    };
  }

  async calculateSafetyRisk(studyId) {
    const aes = await AdverseEvent.find({ studyId }).lean();
    
    const seriousAEs = aes.filter(ae => ae.seriousness === 'SERIOUS' || ae.seriousness === 'LIFE_THREATENING');
    const unresolvedAEs = aes.filter(ae => ae.status === 'REPORTED' || ae.status === 'UNDER_REVIEW');

    let score = 0;
    let drivers = [];

    if (seriousAEs.length > 0) {
      score += 80; // Safety issues carry heavy weight
      drivers.push(`${seriousAEs.length} serious adverse event(s) detected.`);
    }

    if (unresolvedAEs.length > 5) {
      score += 20;
      drivers.push(`${unresolvedAEs.length} adverse events pending review.`);
    }

    score = Math.min(score, 100);

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      metrics: {
        totalAEs: aes.length,
        seriousAEs: seriousAEs.length,
        unresolvedAEs: unresolvedAEs.length
      },
      drivers: drivers.length ? drivers : ['No significant safety signals detected.']
    };
  }

  async calculateRegulatoryRisk(studyId) {
    const milestones = await RegulatoryMilestone.find({ studyId }).lean();
    
    const overdue = milestones.filter(m => m.status === 'OVERDUE');
    const dueSoon = milestones.filter(m => m.status === 'DUE' || (new Date(m.dueDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) && m.status === 'PENDING'));

    let score = 0;
    let drivers = [];

    if (overdue.length > 0) {
      score += 80;
      drivers.push(`${overdue.length} regulatory milestone(s) are overdue.`);
    }
    if (dueSoon.length > 0) {
      score += 20;
      drivers.push(`${dueSoon.length} regulatory milestone(s) are due within 14 days.`);
    }

    score = Math.min(score, 100);

    return {
      score,
      riskLevel: this._determineRiskLevel(score),
      metrics: {
        overdueCount: overdue.length,
        dueSoonCount: dueSoon.length
      },
      drivers: drivers.length ? drivers : ['Regulatory milestones are on track.']
    };
  }

  async calculateOverallStudyRisk(studyId) {
    const [enrollment, site, dataQuality, deviations, safety, regulatory] = await Promise.all([
      this.calculateEnrollmentRisk(studyId),
      this.calculateSiteRisk(studyId),
      this.calculateDataQualityRisk(studyId),
      this.calculateDeviationRisk(studyId),
      this.calculateSafetyRisk(studyId),
      this.calculateRegulatoryRisk(studyId)
    ]);

    let totalScore = 
      (enrollment.score * this.WEIGHTS.ENROLLMENT) +
      (site.score * this.WEIGHTS.SITE) +
      (dataQuality.score * this.WEIGHTS.DATA_QUALITY) +
      (deviations.score * this.WEIGHTS.DEVIATIONS) +
      (safety.score * this.WEIGHTS.SAFETY) +
      (regulatory.score * this.WEIGHTS.REGULATORY);

    totalScore = Math.round(totalScore);

    // Aggregate drivers (top 4 critical ones)
    let allDrivers = [];
    if (safety.score > 50) allDrivers.push(...safety.drivers);
    if (regulatory.score > 50) allDrivers.push(...regulatory.drivers);
    if (dataQuality.score > 50) allDrivers.push(...dataQuality.drivers);
    if (deviations.score > 50) allDrivers.push(...deviations.drivers);
    if (enrollment.score > 50) allDrivers.push(...enrollment.drivers);
    if (site.score > 50) allDrivers.push(...site.drivers);

    // Ensure we always have at least some driver info
    if (allDrivers.length === 0) {
      allDrivers.push("All operational domains are within acceptable limits.");
    }

    return {
      studyId,
      overallRiskScore: totalScore,
      overallRiskLevel: this._determineRiskLevel(totalScore),
      generatedAt: new Date().toISOString(),
      methodologyVersion: this.METHODOLOGY_VERSION,
      topDrivers: allDrivers.slice(0, 4),
      components: {
        enrollment,
        site,
        dataQuality,
        deviations,
        safety,
        regulatory
      }
    };
  }
}

export default new RiskEngineService();
