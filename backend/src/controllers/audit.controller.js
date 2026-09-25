const auditService = require('../services/audit.service');

exports.getAuditLogs = async (req, res, next) => {
  try {
    const result = await auditService.getAuditLogs(req.query, req.user);
    res.status(200).json({ success: true, data: result.logs, pagination: result.pagination });
  } catch (error) { next(error); }
};
