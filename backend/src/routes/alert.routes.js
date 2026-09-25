const express = require('express');
const { getActiveAlerts, getAllAlerts, acknowledgeAlert } = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllAlerts);
router.get('/active', getActiveAlerts);
router.patch('/:id/acknowledge', acknowledgeAlert);

module.exports = router;
