import aiService from '../services/ai.service.js';

export const getStudyOverview = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const user = req.user;

    // IDOR Check - Assuming authorization middleware handles basic study access, 
    // but the service could also enforce it if needed.
    const analysis = await aiService.getStudyOverview(studyId, user);

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    if (error.status === 403) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};

export const generateExplanation = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const user = req.user;

    const explanation = await aiService.generateExplanation(studyId, user);

    res.status(200).json({
      success: true,
      data: explanation
    });
  } catch (error) {
    if (error.status === 403) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};

export const askAI = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { question } = req.body;
    const user = req.user;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const result = await aiService.askAI(studyId, question, user);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.status === 403) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};
