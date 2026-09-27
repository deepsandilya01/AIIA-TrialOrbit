import dataQualityService from '../services/dataQuality.service.js';
import { generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

// Queries
export const createQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.createQuery(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getQueries = async (req, res, next) => {
  try {
    const result = await dataQualityService.getQueries(req.query, req.user);
    res.status(200).json({ success: true, data: result.queries, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const resolveQuery = async (req, res, next) => {
  try {
    const result = await dataQualityService.resolveQuery(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const exportQueries = async (req, res, next) => {
  try {
    const result = await dataQualityService.getQueries(req.query, req.user);
    const data = result.queries.map(q => ({
      id: q.id || q._id,
      study: q.studyId || 'N/A',
      site: q.siteId || 'N/A',
      participant: q.participantId || 'N/A',
      status: q.status || 'N/A',
      priority: q.priority || 'N/A'
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'DATA_QUERIES',
      user: req.user._id,
      details: 'Data queries exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Query ID' },
      { key: 'study', label: 'Study' },
      { key: 'site', label: 'Site' },
      { key: 'participant', label: 'Participant' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-data-queries-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
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
    const result = await dataQualityService.getDeviations(req.query, req.user);
    res.status(200).json({ success: true, data: result.deviations, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const updateDeviationStatus = async (req, res, next) => {
  try {
    const result = await dataQualityService.updateDeviationStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const exportDeviations = async (req, res, next) => {
  try {
    const result = await dataQualityService.getDeviations(req.query, req.user);
    const data = result.deviations.map(d => ({
      id: d.id || d._id,
      study: d.studyId || 'N/A',
      site: d.siteId || 'N/A',
      type: d.type || 'N/A',
      status: d.status || 'N/A',
      category: d.category || 'N/A'
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'PROTOCOL_DEVIATIONS',
      user: req.user._id,
      details: 'Protocol deviations exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Deviation ID' },
      { key: 'study', label: 'Study' },
      { key: 'site', label: 'Site' },
      { key: 'type', label: 'Type' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-deviations-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) { next(error); }
};
