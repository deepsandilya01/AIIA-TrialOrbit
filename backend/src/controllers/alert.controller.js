import alertService from '../services/alert.service.js';

export const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getActiveAlerts(req.user);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) { next(error); }
};

export const getAllAlerts = async (req, res, next) => {
  try {
    const result = await alertService.getAllAlerts(req.query);
    res.status(200).json({ success: true, data: result.alerts, pagination: result.pagination });
  } catch (error) { next(error); }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const result = await alertService.acknowledge(req.params.id, req.user);
    res.status(200).json({ success: true, message: 'Alert acknowledged successfully', data: result });
  } catch (error) {
    if (error.message === 'Alert not found') {
      return res.status(404).json({ success: false, message: 'Alert not found or access denied' });
    }
    next(error);
  }
};
