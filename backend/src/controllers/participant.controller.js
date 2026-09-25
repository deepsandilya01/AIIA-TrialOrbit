const participantService = require('../services/participant.service');

exports.createParticipant = async (req, res, next) => {
  try {
    const participant = await participantService.createParticipant(req.body, req.user);
    res.status(201).json({ success: true, data: participant });
  } catch (error) {
    next(error);
  }
};

exports.getParticipants = async (req, res, next) => {
  try {
    const result = await participantService.getParticipants(req.query);
    res.status(200).json({ 
      success: true, 
      data: result.participants,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getParticipantById = async (req, res, next) => {
  try {
    const participant = await participantService.getParticipantById(req.params.id);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

exports.updateParticipant = async (req, res, next) => {
  try {
    const participant = await participantService.updateParticipant(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const participant = await participantService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: participant });
  } catch (error) {
    if (error.message === 'Participant not found') res.status(404);
    next(error);
  }
};
