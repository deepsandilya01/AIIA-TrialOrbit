import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const cdiscExportSchema = Joi.object({
  format: Joi.string().valid('CDASH', 'SDTM', 'ADAM', 'DEFINE_XML').optional(),
  domains: Joi.array().items(Joi.string().max(50)).optional()
});

export const fhirParamsSchema = Joi.object({
  participantId: objectId.required()
});
