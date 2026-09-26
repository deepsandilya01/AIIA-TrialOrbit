import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('PI', 'COORDINATOR', 'MONITOR', 'PHARMACOVIGILANCE', 'ETHICS', 'ADMIN', 'REGULATOR').required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email()
}).min(1);

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('PI', 'COORDINATOR', 'MONITOR', 'PHARMACOVIGILANCE', 'ETHICS', 'ADMIN', 'REGULATOR').required()
});

export const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});
