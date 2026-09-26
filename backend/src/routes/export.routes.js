import express from 'express';
import { 
  getFHIRPatient, 
  getFHIRResearchStudy, 
  getFHIREncounter, 
  getCDISCExport 
} from '../controllers/export.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { rbacMiddleware } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { exportValidator } from '../validators/index.js';

const router = express.Router();

// Both FHIR and CDISC require 'exports:read' permission
router.use(protect);

// FHIR Routes
router.get('/fhir/patient/:participantId', rbacMiddleware('fhir:read'), getFHIRPatient);
router.get('/fhir/research-study/:studyId', rbacMiddleware('fhir:read'), getFHIRResearchStudy);
router.get('/fhir/encounter/:visitId', rbacMiddleware('fhir:read'), getFHIREncounter);

// CDISC Routes
router.get('/cdisc/studies/:studyId/export', rbacMiddleware('cdisc:export'), getCDISCExport);
router.post('/cdisc/studies/:studyId/export', rbacMiddleware('cdisc:export'), validate(exportValidator.cdiscExport), getCDISCExport);

export default router;
