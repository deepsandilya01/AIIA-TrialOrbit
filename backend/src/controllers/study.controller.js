const studyService = require('../services/study.service');

exports.createStudy = async (req, res, next) => {
  try {
    const study = await studyService.createStudy(req.body, req.user);
    res.status(201).json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
};

exports.getStudies = async (req, res, next) => {
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

exports.getStudyById = async (req, res, next) => {
  try {
    const study = await studyService.getStudyById(req.params.id);
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') res.status(404);
    next(error);
  }
};

exports.updateStudy = async (req, res, next) => {
  try {
    const study = await studyService.updateStudy(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') res.status(404);
    next(error);
  }
};

exports.updateLifecycle = async (req, res, next) => {
  try {
    const study = await studyService.updateLifecycle(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    if (error.message === 'Study not found') res.status(404);
    next(error);
  }
};
