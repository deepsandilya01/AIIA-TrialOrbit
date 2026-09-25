const regulatoryService = require('../services/regulatory.service');

exports.createMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.createMilestone(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getMilestones = async (req, res, next) => {
  try {
    const result = await regulatoryService.getMilestones(req.query);
    res.status(200).json({ success: true, data: result.milestones, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.updateMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.updateMilestone(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.completeMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.completeMilestone(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
