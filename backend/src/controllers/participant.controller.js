import participantService from '../services/participant.service.js';
import { generateCSV } from '../utils/export.util.js';
import auditService from '../services/audit.service.js';

export const createParticipant = async (req, res, next) => {
  try {
    const participant = await participantService.createParticipant(req.body, req.user);
    res.status(201).json({ success: true, data: participant });
  } catch (error) {
    next(error);
  }
};

export const getParticipants = async (req, res, next) => {
  try {
    const result = await participantService.getParticipants(req.query, req.user);
    res.status(200).json({ 
      success: true, 
      data: result.participants,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getParticipantById = async (req, res, next) => {
  try {
    const participant = await participantService.getParticipantById(req.params.id, req.user);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

export const updateParticipant = async (req, res, next) => {
  try {
    const participant = await participantService.updateParticipant(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const participant = await participantService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

export const updateParticipantConsent = async (req, res, next) => {
  try {
    const consent = await participantService.updateParticipantConsent(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: consent });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

export const exportParticipants = async (req, res, next) => {
  try {
    const result = await participantService.getParticipants(req.query);
    const data = result.participants.map(p => ({
      id: p.participantCode || p.id || p._id,
      study: p.studyId || 'N/A',
      site: p.siteId || 'N/A',
      age: p.demographics?.age || 'N/A',
      gender: p.demographics?.gender || 'N/A',
      status: p.status || 'N/A',
      enrollmentDate: p.enrollmentDate ? new Date(p.enrollmentDate).toISOString().split('T')[0] : 'N/A'
    }));

    await auditService.log({
      action: 'EXPORT',
      entity: 'PARTICIPANT_DIRECTORY',
      user: req.user._id,
      details: 'Participant line listing exported'
    });

    const csv = generateCSV(data, [
      { key: 'id', label: 'Participant ID' },
      { key: 'study', label: 'Study' },
      { key: 'site', label: 'Site' },
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' },
      { key: 'status', label: 'Status' },
      { key: 'enrollmentDate', label: 'Enrollment Date' }
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=trialorbit-participants-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
