const dataQualityService = require('../services/dataQuality.service');

// Queries
exports.createQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.createQuery(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getQueries = async (req, res, next) => {
  try {
    const result = await dataQualityService.getQueries(req.query);
    res.status(200).json({ success: true, data: result.queries, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.resolveQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.resolveQuery(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Deviations
exports.createDeviation = async (req, res, next) => {
  try {
    const result = await dataQualityService.createDeviation(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getDeviations = async (req, res, next) => {
  try {
    const result = await dataQualityService.getDeviations(req.query);
    res.status(200).json({ success: true, data: result.deviations, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.updateDeviationStatus = async (req, res, next) => {
  try {
    const result = await dataQualityService.updateDeviationStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
