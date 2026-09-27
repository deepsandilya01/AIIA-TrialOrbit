import safetyService from '../services/safety.service.js';
import { generatePDF } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';
import Participant from '../models/Participant.js';
import Study from '../models/Study.js';
import Site from '../models/Site.js';

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

export const getEventById = async (req, res, next) => {
  try {
    const result = await safetyService.getEventById(req.params.id);
    res.status(200).json({ success: true, data: result });
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

export const exportSafetyReport = async (req, res, next) => {
  try {
    const event = await safetyService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Safety event not found' });

    await auditService.log({
      action: 'EXPORT',
      entity: 'SAFETY_REPORT',
      entityId: event._id,
      user: req.user._id,
      details: 'TrialOrbit MVP Safety Event Report exported'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-safety-event-${event.eventId || event._id}.pdf`);

    generatePDF({
      title: 'TrialOrbit MVP Safety Event Report',
      sections: [
        { heading: 'Event Details', content: [`Event ID: ${event.eventId || event._id}`, `Description: ${event.description}`, `Date: ${event.dateOfOnset}`, `Status: ${event.status}`] },
        { heading: 'Study & Subject', content: [`Study Protocol: ${event.study?.protocolId || 'N/A'}`, `Participant ID: ${event.participant?.participantCode || 'N/A'}`] },
        { heading: 'Severity & Assessment', content: [`Severity: ${event.severity}`, `Seriousness: ${event.seriousness}`, `Causality: ${event.causality || 'Not Assessed'}`, `Action Taken: ${event.actionTaken || 'None'}`] }
      ]
    }, res);
  } catch (error) {
    next(error);
  }
};
