import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createQuerySchema = Joi.object({
  studyId: objectId.required(),
  siteId: objectId.required(),
  participantId: objectId.optional(),
  category: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).max(2000).required(),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional()
});

export const updateQuerySchema = Joi.object({
  description: Joi.string().min(5).max(2000),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
  status: Joi.string().valid('OPEN', 'IN_REVIEW', 'RESPONDED', 'RESOLVED', 'CLOSED'),
  response: Joi.string().max(2000)
}).min(1);

export const resolveQuerySchema = Joi.object({
  resolution: Joi.string().max(2000).optional()
});
