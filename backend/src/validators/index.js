// index.js — Re-exports ONLY. All schemas live in their domain files.
// DO NOT add Joi schemas here.

export * from './auth.validator.js';
export * from './study.validator.js';
export * from './site.validator.js';
export * from './participant.validator.js';
export * from './consent.validator.js';
export * from './visit.validator.js';
export * from './query.validator.js';
export * from './deviation.validator.js';
export * from './regulatory.validator.js';
export * from './safety.validator.js';
export * from './alert.validator.js';
export * from './user.validator.js';
export * from './dashboard.validator.js';
export * from './export.validator.js';

// Legacy named exports for backward compatibility with existing routes
// (routes import named objects like studyValidator, authValidator, etc.)
import { loginSchema, registerSchema } from './auth.validator.js';
import { createStudySchema, updateStudySchema, lifecycleSchema } from './study.validator.js';
import { createSiteSchema, updateSiteSchema, siteStatusSchema } from './site.validator.js';
import { createParticipantSchema, updateParticipantSchema, participantStatusSchema } from './participant.validator.js';
import { createConsentSchema } from './consent.validator.js';
import { createVisitSchema, updateVisitSchema } from './visit.validator.js';
import { createQuerySchema, updateQuerySchema, resolveQuerySchema } from './query.validator.js';
import { createDeviationSchema, updateDeviationSchema } from './deviation.validator.js';
import { createRegulatorySchema, updateRegulatorySchema } from './regulatory.validator.js';
import { createSafetyEventSchema, updateSafetyEventSchema, pvReviewSchema } from './safety.validator.js';
import { acknowledgeAlertSchema } from './alert.validator.js';
import { createUserSchema, updateUserSchema, updateRoleSchema, updateStatusSchema } from './user.validator.js';
import { cdiscExportSchema } from './export.validator.js';

export const authValidator = {
  login: loginSchema,
  register: registerSchema
};

export const studyValidator = {
  create: createStudySchema,
  update: updateStudySchema,
  lifecycle: lifecycleSchema
};

export const siteValidator = {
  create: createSiteSchema,
  update: updateSiteSchema,
  updateStatus: siteStatusSchema
};

export const participantValidator = {
  create: createParticipantSchema,
  update: updateParticipantSchema,
  updateStatus: participantStatusSchema,
  consent: createConsentSchema
};

export const visitValidator = {
  create: createVisitSchema,
  update: updateVisitSchema,
  updateStatus: updateVisitSchema
};

export const queryValidator = {
  create: createQuerySchema,
  update: updateQuerySchema,
  resolve: resolveQuerySchema
};

export const deviationValidator = {
  create: createDeviationSchema,
  update: updateDeviationSchema
};

export const regulatoryValidator = {
  create: createRegulatorySchema,
  update: updateRegulatorySchema
};

export const safetyValidator = {
  create: createSafetyEventSchema,
  update: updateSafetyEventSchema,
  pvReview: pvReviewSchema
};

export const alertValidator = {
  acknowledge: acknowledgeAlertSchema
};

export const userValidator = {
  create: createUserSchema,
  update: updateUserSchema,
  updateRole: updateRoleSchema,
  updateStatus: updateStatusSchema
};

export const exportValidator = {
  cdiscExport: cdiscExportSchema
};
