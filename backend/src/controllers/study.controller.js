import studyService from '../services/study.service.js';
import { invalidateCachePrefix } from '../middleware/cache.middleware.js';
import { generatePDF, generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

export const createStudy = async (req, res, next) => {
  try {
    const study = await studyService.createStudy(req.body, req.user);
    await invalidateCachePrefix('/api/v1/studies');
    await invalidateCachePrefix('/api/v1/dashboard');
    res.status(201).json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
};

export const getStudies = async (req, res, next) => {
  try {
    const result = await studyService.getStudies(req.query);
    res.status(200).json({ 
      success: true, 
      data: result.studies,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getStudyById = async (req, res, next) => {
  try {
    const study = await studyService.getStudyById(req.params.id);
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') res.status(404);
    next(error);
  }
};

export const updateStudy = async (req, res, next) => {
  try {
    const study = await studyService.updateStudy(req.params.id, req.body, req.user);
    await invalidateCachePrefix(`/api/v1/studies`);
    await invalidateCachePrefix('/api/v1/dashboard');
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') return res.status(404).json({ success: false, message: error.message });
    if (error.message.startsWith('Forbidden')) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};

export const updateLifecycle = async (req, res, next) => {
  try {
    const study = await studyService.updateLifecycle(req.params.id, req.body.status, req.user);
    await invalidateCachePrefix(`/api/v1/studies`);
    await invalidateCachePrefix('/api/v1/dashboard');
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') return res.status(404).json({ success: false, message: error.message });
    if (error.message.startsWith('Forbidden')) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};

export const exportStudyDossier = async (req, res, next) => {
  try {
    const study = await studyService.getStudyById(req.params.id);
    if (!study) return res.status(404).json({ success: false, message: 'Study not found' });

    await auditService.log({
      action: 'EXPORT',
      entity: 'STUDY_DOSSIER',
      entityId: study._id,
      user: req.user._id,
      details: 'Study PDF dossier exported'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-study-${study.protocolId}-dossier.pdf`);

    generatePDF({
      title: `Study Dossier: ${study.title}`,
      sections: [
        { heading: 'General Information', content: [`Protocol ID: ${study.protocolId}`, `Sponsor: ${study.sponsor}`, `Phase: ${study.phase}`, `Status: ${study.status}`] },
        { heading: 'Enrollment', content: [`Target: ${study.targetEnrollment}`, `Current: ${study.currentEnrollment || 0}`] }
      ]
    }, res);
  } catch (error) {
    next(error);
  }
};

export const exportRecruitmentReport = async (req, res, next) => {
  try {
    const result = await studyService.getStudies(req.query);
    const data = result.studies.map(s => ({
      study: s.protocolId,
      title: s.title,
      target: s.targetEnrollment,
      actual: s.currentEnrollment || 0,
      sites: s.sites?.length || 0,
      status: s.status
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'RECRUITMENT_REPORT',
      user: req.user._id,
      details: 'Recruitment report exported'
    });

    const csv = generateCSV(data, [
      { key: 'study', label: 'Protocol ID' },
      { key: 'title', label: 'Study Title' },
      { key: 'target', label: 'Target Enrollment' },
      { key: 'actual', label: 'Actual Enrollment' },
      { key: 'sites', label: 'Sites' },
      { key: 'status', label: 'Status' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-recruitment-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
