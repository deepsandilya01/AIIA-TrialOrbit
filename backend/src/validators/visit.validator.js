import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createVisitSchema = Joi.object({
  studyId: objectId.required(),
  siteId: objectId.required(),
  participantId: objectId.required(),
  visitName: Joi.string().min(1).max(100).required(),
  scheduledDate: Joi.date().iso().required(),
  visitType: Joi.string().valid('Clinic', 'Phone', 'Remote').optional(),
  status: Joi.string().valid('Scheduled', 'Completed', 'Missed', 'Overdue').optional()
});

export const updateVisitSchema = Joi.object({
  visitName: Joi.string().min(1).max(100),
  scheduledDate: Joi.date().iso(),
  status: Joi.string().valid('Scheduled', 'Completed', 'Missed', 'Overdue'),
  completedDate: Joi.date().iso(),
  visitType: Joi.string().valid('Clinic', 'Phone', 'Remote'),
  notes: Joi.string().max(2000)
}).min(1);
