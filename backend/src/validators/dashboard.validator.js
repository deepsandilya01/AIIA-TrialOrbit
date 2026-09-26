import Joi from 'joi';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().max(200).optional(),
  sort: Joi.string().max(100).optional(),
  status: Joi.string().max(50).optional(),
  studyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  siteId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
});
