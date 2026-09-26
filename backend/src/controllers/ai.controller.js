import AIService from '../services/ai.service.js';

export const handleKpiQuery = async (req, res, next) => {
  try {
    const { query, filters } = req.body;
    const result = await AIService.processKpiQuery(query, req.user, filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const handleRecruitmentRisk = async (req, res, next) => {
  try {
    const { studyId } = req.body;
    const result = await AIService.processRecruitmentRisk(studyId, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const handleAnomalyDetection = async (req, res, next) => {
  try {
    const { studyId } = req.body;
    const result = await AIService.processAnomalyDetection(studyId, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const handleSafetySummary = async (req, res, next) => {
  try {
    const { studyId } = req.body;
    const result = await AIService.processSafetySummary(studyId, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
