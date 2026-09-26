import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createDeviationSchema = Joi.object({
  studyId: objectId.required(),
  siteId: objectId.required(),
  participantId: objectId.optional(),
  category: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).max(2000).required(),
  severity: Joi.string().valid('Minor', 'Major', 'Critical').optional(),
  status: Joi.string().valid('OPEN', 'UNDER_REVIEW', 'CLOSED').optional()
});

export const updateDeviationSchema = Joi.object({
  description: Joi.string().min(5).max(2000),
  severity: Joi.string().valid('Minor', 'Major', 'Critical'),
  status: Joi.string().valid('OPEN', 'UNDER_REVIEW', 'CLOSED'),
  corrective: Joi.string().max(2000)
}).min(1);
