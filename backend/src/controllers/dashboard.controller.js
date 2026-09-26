import dashboardService from '../services/dashboard.service.js';

export const getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKPIs();
    res.status(200).json({ success: true, data: kpis });
  } catch (error) { next(error); }
};
