const visitService = require('../services/visit.service');

exports.createVisit = async (req, res, next) => {
  try {
    const visit = await visitService.createVisit(req.body, req.user);
    res.status(201).json({ success: true, data: visit });
  } catch (error) {
    next(error);
  }
};

exports.getVisits = async (req, res, next) => {
  try {
    const result = await visitService.getVisits(req.query);
    res.status(200).json({ 
      success: true, 
      data: result.visits,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getVisitById = async (req, res, next) => {
  try {
    const visit = await visitService.getVisitById(req.params.id);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};

exports.updateVisit = async (req, res, next) => {
  try {
    const visit = await visitService.updateVisit(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};

exports.completeVisit = async (req, res, next) => {
  try {
    const visit = await visitService.completeVisit(req.params.id, req.body.completedDate, req.user);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};
