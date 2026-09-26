import Joi from 'joi';

// Helper to validate request body against a Joi schema
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errorMessage } });
    }
    next();
  };
};

export const authSchemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('ADMIN', 'PI', 'COORDINATOR', 'MONITOR', 'ETHICS', 'PHARMACOVIGILANCE', 'REGULATOR').required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const studySchemas = {
  create: Joi.object({
    title: Joi.string().required(),
    protocolId: Joi.string().required(),
    phase: Joi.string().required(),
    targetEnrollment: Joi.number().integer().min(1).required()
  }),
  transition: Joi.object({
    newState: Joi.string().required(),
    reason: Joi.string().required()
  })
};

export const validateObjectId = (req, res, next) => {
  // Check if req.params has any id, studyId, etc., and ensure they are valid MongoDB ObjectIds
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  for (const [key, value] of Object.entries(req.params)) {
    if (key.toLowerCase().endsWith('id') && !objectIdRegex.test(value)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_ID_FORMAT', message: `Invalid ${key} format` } });
    }
  }
  next();
};
