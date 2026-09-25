const dashboardService = require('../services/dashboard.service');

exports.getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKPIs();
    res.status(200).json({ success: true, data: kpis });
  } catch (error) { next(error); }
};
