import visitService from '../services/visit.service.js';

export const createVisit = async (req, res, next) => {
  try {
    const visit = await visitService.createVisit(req.body, req.user);
    res.status(201).json({ success: true, data: visit });
  } catch (error) {
    next(error);
  }
};

export const getVisits = async (req, res, next) => {
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

export const getVisitById = async (req, res, next) => {
  try {
    const visit = await visitService.getVisitById(req.params.id);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};

export const updateVisit = async (req, res, next) => {
  try {
    const visit = await visitService.updateVisit(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};

export const completeVisit = async (req, res, next) => {
  try {
    const visit = await visitService.completeVisit(req.params.id, req.body.completedDate, req.user);
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    if (error.message === 'Visit not found') res.status(404);
    next(error);
  }
};
