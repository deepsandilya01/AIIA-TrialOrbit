import regulatoryService from '../services/regulatory.service.js';

export const createMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.createMilestone(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getMilestones = async (req, res, next) => {
  try {
    const result = await regulatoryService.getMilestones(req.query);
    res.status(200).json({ success: true, data: result.milestones, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const getMilestoneById = async (req, res, next) => {
  try {
    const result = await regulatoryService.getMilestoneById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.updateMilestone(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const completeMilestone = async (req, res, next) => {
  try {
    const result = await regulatoryService.completeMilestone(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
