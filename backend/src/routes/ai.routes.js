const express = require('express');

exports.aiQuery = (req, res, next) => {
  // Stub for AI Assistant
  res.status(200).json({
    success: true,
    data: {
      response: "This is a representative AI response based on the clinical trial data.",
      confidence: 0.95
    }
  });
};

const router = express.Router();
router.post('/query', exports.aiQuery);

module.exports = router;
