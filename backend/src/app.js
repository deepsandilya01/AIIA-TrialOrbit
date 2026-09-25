const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

// Import Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/studies', require('./routes/study.routes'));
app.use('/api/v1/sites', require('./routes/site.routes'));
app.use('/api/v1/participants', require('./routes/participant.routes'));
app.use('/api/v1/visits', require('./routes/visit.routes'));
app.use('/api/v1', require('./routes/dataQuality.routes'));
app.use('/api/v1/regulatory', require('./routes/regulatory.routes'));
app.use('/api/v1/safety', require('./routes/safety.routes'));
app.use('/api/v1/audit-logs', require('./routes/audit.routes'));
app.use('/api/v1/alerts', require('./routes/alert.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));
app.use('/api/v1/export', require('./routes/export.routes'));
app.use('/api/v1/integration', require('./routes/export.routes'));
app.use('/api/v1/ai', require('./routes/ai.routes'));
// TODO: Add other routes here

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
