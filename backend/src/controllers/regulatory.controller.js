import regulatoryService from '../services/regulatory.service.js';
import { generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

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

export const exportMilestones = async (req, res, next) => {
  try {
    const result = await regulatoryService.getMilestones(req.query);
    const data = result.milestones.map(m => ({
      id: m.id || m._id,
      study: m.studyId || 'N/A',
      type: m.type || 'N/A',
      referenceNumber: m.referenceNumber || 'N/A',
      status: m.status || 'N/A',
      dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split('T')[0] : 'N/A'
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'REGULATORY_MILESTONES',
      user: req.user._id,
      details: 'Regulatory milestones exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Milestone ID' },
      { key: 'study', label: 'Study' },
      { key: 'type', label: 'Type' },
      { key: 'referenceNumber', label: 'Ref No' },
      { key: 'status', label: 'Status' },
      { key: 'dueDate', label: 'Due Date' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-milestones-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) { next(error); }
};
