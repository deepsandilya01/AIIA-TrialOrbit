import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createConsentSchema = Joi.object({
  consentVersion: Joi.string().min(1).max(50).required(),
  method: Joi.string().valid('Electronic', 'Paper', 'Verbal').optional(),
  status: Joi.string().valid('Active', 'Withdrawn', 'Expired').optional(),
  // E-signature intent string provided by frontend
  signatureIntent: Joi.string().optional()
});

export const withdrawConsentSchema = Joi.object({
  reason: Joi.string().max(500).optional()
});
