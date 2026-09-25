const express = require('express');
const { 
  createSite, 
  getSites, 
  getSiteById, 
  updateSite, 
  updateStatus 
} = require('../controllers/site.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createSite)
  .get(getSites);

router.route('/:id')
  .get(getSiteById)
  .patch(updateSite);

router.patch('/:id/status', updateStatus);

module.exports = router;
