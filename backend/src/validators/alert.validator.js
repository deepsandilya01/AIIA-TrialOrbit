import Joi from 'joi';

export const acknowledgeAlertSchema = Joi.object({
  note: Joi.string().max(500).optional()
});
