import studyService from '../services/study.service.js';
import { invalidateCachePrefix } from '../middleware/cache.middleware.js';

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
