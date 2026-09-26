import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createSafetyEventSchema = Joi.object({
  studyId: objectId.required(),
  siteId: objectId.required(),
  participantId: objectId.required(),
  eventType: Joi.string().valid('AE', 'ADR', 'SAE').optional(),
  event: Joi.string().min(2).max(500).required(),
  onsetDate: Joi.date().iso().optional(),
  seriousness: Joi.string().valid('SERIOUS', 'NON_SERIOUS').optional(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').optional(),
  relationship: Joi.string().valid('RELATED', 'POSSIBLY_RELATED', 'UNRELATED', 'UNKNOWN').optional(),
  expectedness: Joi.string().valid('EXPECTED', 'UNEXPECTED', 'UNKNOWN').optional(),
  outcome: Joi.string().valid('RECOVERED', 'RECOVERING', 'NOT_RECOVERED', 'FATAL', 'UNKNOWN').optional(),
  actionTaken: Joi.string().max(1000).optional(),
  pvReviewStatus: Joi.string().valid('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED').optional()
});

export const updateSafetyEventSchema = Joi.object({
  event: Joi.string().min(2).max(500),
  onsetDate: Joi.date().iso(),
  resolutionDate: Joi.date().iso(),
  seriousness: Joi.string().valid('SERIOUS', 'NON_SERIOUS'),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE'),
  relationship: Joi.string().valid('RELATED', 'POSSIBLY_RELATED', 'UNRELATED', 'UNKNOWN'),
  expectedness: Joi.string().valid('EXPECTED', 'UNEXPECTED', 'UNKNOWN'),
  outcome: Joi.string().valid('RECOVERED', 'RECOVERING', 'NOT_RECOVERED', 'FATAL', 'UNKNOWN'),
  actionTaken: Joi.string().max(1000),
  reportingStatus: Joi.string().valid('NOT_DUE', 'DUE', 'SUBMITTED', 'OVERDUE', 'CLOSED')
}).min(1);

export const pvReviewSchema = Joi.object({
  pvReviewStatus: Joi.string().valid('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED').required(),
  codingStatus: Joi.string().valid('PENDING', 'CODED', 'VERIFIED').optional(),
  codedTerm: Joi.string().max(200).optional(),
  dictionary: Joi.string().max(100).optional(),
  version: Joi.string().max(50).optional()
});
