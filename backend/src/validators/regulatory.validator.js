import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createRegulatorySchema = Joi.object({
  studyId: objectId.required(),
  type: Joi.string().valid(
    'IEC_REVIEW', 'IEC_APPROVAL', 'CTRI_REGISTRATION', 'CTRI_UPDATE',
    'REGULATORY_SUBMISSION', 'REGULATORY_RENEWAL', 'SITE_APPROVAL', 'OTHER'
  ).required(),
  title: Joi.string().min(3).max(200).required(),
  dueDate: Joi.date().iso().required(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE').optional(),
  notes: Joi.string().max(1000).optional()
});

export const updateRegulatorySchema = Joi.object({
  title: Joi.string().min(3).max(200),
  dueDate: Joi.date().iso(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'),
  notes: Joi.string().max(1000)
}).min(1);
