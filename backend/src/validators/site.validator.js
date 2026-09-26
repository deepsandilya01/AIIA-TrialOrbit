import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createSiteSchema = Joi.object({
  studyId: objectId.required(),
  name: Joi.string().min(2).max(200).required(),
  location: Joi.string().min(2).max(200).required(),
  targetEnrollment: Joi.number().integer().min(0).optional(),
  investigatorName: Joi.string().max(100).optional(),
  status: Joi.string().valid('Planned', 'Setup', 'Activated', 'Recruiting', 'Monitoring', 'Closed').optional()
});

export const updateSiteSchema = Joi.object({
  name: Joi.string().min(2).max(200),
  location: Joi.string().min(2).max(200),
  targetEnrollment: Joi.number().integer().min(0),
  investigatorName: Joi.string().max(100)
}).min(1);

export const siteStatusSchema = Joi.object({
  status: Joi.string().valid('Planned', 'Setup', 'Activated', 'Recruiting', 'Monitoring', 'Closed').required()
});
