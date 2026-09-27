import visitService from '../services/visit.service.js';
import { generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

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

export const exportVisits = async (req, res, next) => {
  try {
    const result = await visitService.getVisits(req.query);
    const data = result.visits.map(v => ({
      id: v.visitId || v._id,
      participant: v.participantId || 'N/A',
      type: v.type || 'N/A',
      status: v.status || 'N/A',
      scheduledDate: v.scheduledDate ? new Date(v.scheduledDate).toISOString().split('T')[0] : 'N/A',
      completedDate: v.completedDate ? new Date(v.completedDate).toISOString().split('T')[0] : 'N/A',
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'VISIT_SCHEDULE',
      user: req.user._id,
      details: 'Visit schedule CSV exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Visit ID' },
      { key: 'participant', label: 'Participant ID' },
      { key: 'type', label: 'Visit Type' },
      { key: 'status', label: 'Status' },
      { key: 'scheduledDate', label: 'Scheduled Date' },
      { key: 'completedDate', label: 'Completed Date' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-visits-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
