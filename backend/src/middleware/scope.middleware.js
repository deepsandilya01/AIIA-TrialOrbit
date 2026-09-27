import Site from '../models/Site.js';
import Study from '../models/Study.js';

export const assertSiteAccess = async (user, requestedSiteId, requestedStudyId) => {
  if (user.role === 'ADMIN' || user.role === 'REGULATOR' || user.role === 'ETHICS' || user.role === 'PHARMACOVIGILANCE') {
    return true; // Global roles
  }

  if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
    if (!user.siteId) return false;
    
    // Check site access
    if (requestedSiteId && requestedSiteId.toString() !== user.siteId.toString()) {
      return false;
    }
    
    // Check study access if provided
    if (requestedStudyId) {
      const assignedSite = await Site.findById(user.siteId);
      if (!assignedSite || assignedSite.studyId.toString() !== requestedStudyId.toString()) {
        return false;
      }
    }
    return true;
  }

  if (user.role === 'PI') {
    if (requestedStudyId) {
      const study = await Study.findById(requestedStudyId);
      if (!study || study.pi_id.toString() !== user.id.toString()) {
        return false;
      }
    }
    if (requestedSiteId) {
      const site = await Site.findById(requestedSiteId);
      if (!site) return false;
      const study = await Study.findById(site.studyId);
      if (!study || study.pi_id.toString() !== user.id.toString()) {
        return false;
      }
    }
    return true;
  }

  return false;
};
