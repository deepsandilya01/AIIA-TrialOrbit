import dashboardService from '../services/dashboard.service.js';

export const getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKPIs(req.user);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) { next(error); }
};

export const getRecruitmentSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getRecruitmentSummary(req.user);
    res.status(200).json({ success: true, data: summary });
  } catch (error) { next(error); }
};

export const getRecruitmentTrend = async (req, res, next) => {
  try {
    const trend = await dashboardService.getRecruitmentTrend(req.user);
    res.status(200).json({ success: true, data: trend });
  } catch (error) { next(error); }
};

export const getComplianceSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getComplianceSummary(req.user);
    res.status(200).json({ success: true, data: summary });
  } catch (error) { next(error); }
};
