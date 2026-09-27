import siteService from '../services/site.service.js';
import { generatePDF, generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

export const createSite = async (req, res, next) => {
  try {
    const site = await siteService.createSite(req.body, req.user);
    res.status(201).json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
};

export const getSites = async (req, res, next) => {
  try {
    const result = await siteService.getSites(req.query);
    res.status(200).json({ 
      success: true, 
      data: result.sites,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getSiteById = async (req, res, next) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};

export const updateSite = async (req, res, next) => {
  try {
    const site = await siteService.updateSite(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const site = await siteService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};

export const exportSiteDirectory = async (req, res, next) => {
  try {
    const result = await siteService.getSites(req.query);
    const data = result.sites.map(s => ({
      id: s.siteId || s._id,
      name: s.name,
      study: s.study?.protocolId || 'N/A',
      location: `${s.city || ''}, ${s.country || ''}`,
      status: s.status,
      pi: s.pi?.name || 'N/A',
      participants: s.activeParticipants || 0,
      createdAt: s.createdAt
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'SITE_DIRECTORY',
      user: req.user._id,
      details: 'Site directory CSV exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Site ID' },
      { key: 'name', label: 'Site Name' },
      { key: 'study', label: 'Study' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
      { key: 'pi', label: 'Principal Investigator' },
      { key: 'participants', label: 'Participants' },
      { key: 'createdAt', label: 'Created At' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-sites-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportSiteDossier = async (req, res, next) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    if (!site) return res.status(404).json({ success: false, message: 'Site not found' });

    await auditService.log({
      action: 'EXPORT',
      entity: 'SITE_DOSSIER',
      entityId: site._id,
      user: req.user._id,
      details: 'Site audit dossier exported'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-site-${site.siteId || site._id}-audit-dossier.pdf`);

    generatePDF({
      title: `Site Audit Dossier: ${site.name}`,
      sections: [
        { heading: 'Site Details', content: [`Site ID: ${site.siteId || site._id}`, `Location: ${site.city}, ${site.country}`, `Status: ${site.status}`] },
        { heading: 'Study & Oversight', content: [`Study Protocol: ${site.study?.protocolId || 'N/A'}`, `Principal Investigator: ${site.pi?.name || 'N/A'}`] },
        { heading: 'Performance Metrics', content: [`Active Participants: ${site.activeParticipants || 0}`] }
      ]
    }, res);
  } catch (error) {
    next(error);
  }
};
