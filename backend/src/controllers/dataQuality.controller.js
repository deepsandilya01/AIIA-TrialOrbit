import dataQualityService from '../services/dataQuality.service.js';

// Queries
export const createQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.createQuery(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getQueries = async (req, res, next) => {
  try {
    const result = await dataQualityService.getQueries(req.query);
    res.status(200).json({ success: true, data: result.queries, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const resolveQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.resolveQuery(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Deviations
export const createDeviation = async (req, res, next) => {
  try {
    const result = await dataQualityService.createDeviation(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getDeviations = async (req, res, next) => {
  try {
    const result = await dataQualityService.getDeviations(req.query);
    res.status(200).json({ success: true, data: result.deviations, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const updateDeviationStatus = async (req, res, next) => {
  try {
    const result = await dataQualityService.updateDeviationStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
