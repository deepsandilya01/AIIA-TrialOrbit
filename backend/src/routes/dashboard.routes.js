const express = require('express');
const { getKPIs } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/kpis', getKPIs);

module.exports = router;
