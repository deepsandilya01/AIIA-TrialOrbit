import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createParticipantSchema = Joi.object({
  studyId: objectId.required(),
  siteId: objectId.required(),
  participantCode: Joi.string().max(50).optional(),
  age: Joi.number().integer().min(0).max(120).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other', 'Unknown').required(),
  status: Joi.string().valid(
    'Screened', 'Eligible', 'Ineligible', 'Enrolled',
    'Randomized', 'Follow-up', 'Completed', 'Withdrawn', 'Lost-to-follow-up'
  ).optional()
});

export const updateParticipantSchema = Joi.object({
  age: Joi.number().integer().min(0).max(120),
  gender: Joi.string().valid('Male', 'Female', 'Other', 'Unknown'),
  participantCode: Joi.string().max(50)
}).min(1);

export const participantStatusSchema = Joi.object({
  status: Joi.string().valid(
    'Screened', 'Eligible', 'Ineligible', 'Enrolled',
    'Randomized', 'Follow-up', 'Completed', 'Withdrawn', 'Lost-to-follow-up'
  ).required()
});
