const express = require('express');
const { getAuditLogs } = require('../controllers/audit.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAuditLogs);

module.exports = router;
