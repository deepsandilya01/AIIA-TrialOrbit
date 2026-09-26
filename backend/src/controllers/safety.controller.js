import safetyService from '../services/safety.service.js';

export const createEvent = async (req, res, next) => {
  try {
    const result = await safetyService.createEvent(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getEvents = async (req, res, next) => {
  try {
    const result = await safetyService.getEvents(req.query);
    res.status(200).json({ success: true, data: result.events, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const result = await safetyService.updateEvent(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const pvReview = async (req, res, next) => {
  try {
    const result = await safetyService.pvReview(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
