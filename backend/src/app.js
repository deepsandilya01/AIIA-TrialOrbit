import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import env from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = yaml.load(path.join(__dirname, '../docs/swagger.yaml'));

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // limit each IP to 200 requests per windowMs
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
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    data: {
      status: isDbConnected ? 'ok' : 'degraded',
      service: 'aiia-trialorbit-backend',
      database: isDbConnected ? 'connected' : 'disconnected'
    }
  });
});

import authRoutes from './routes/auth.routes.js';
import studyRoutes from './routes/study.routes.js';
import siteRoutes from './routes/site.routes.js';
import participantRoutes from './routes/participant.routes.js';
import visitRoutes from './routes/visit.routes.js';
import dataQualityRoutes from './routes/dataQuality.routes.js';
import regulatoryRoutes from './routes/regulatory.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import auditRoutes from './routes/audit.routes.js';
import alertRoutes from './routes/alert.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import exportRoutes from './routes/export.routes.js';
import aiRoutes from './routes/ai.routes.js';
import userRoutes from './routes/user.routes.js';

import { validateObjectId } from './middleware/validate.middleware.js';

app.use('/api/v1', validateObjectId);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/studies', studyRoutes);
app.use('/api/v1/sites', siteRoutes);
app.use('/api/v1/participants', participantRoutes);
app.use('/api/v1/visits', visitRoutes);
app.use('/api/v1', dataQualityRoutes);
app.use('/api/v1/regulatory', regulatoryRoutes);
app.use('/api/v1/safety', safetyRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/integration', exportRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);


// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
