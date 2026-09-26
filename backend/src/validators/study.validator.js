import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

export const createStudySchema = Joi.object({
  protocolId: Joi.string().min(3).max(50).required(),
  title: Joi.string().min(5).max(300).required(),
  phase: Joi.string().valid('Phase I', 'Phase II', 'Phase IIb', 'Phase III', 'Phase IV', 'Not Applicable').required(),
  targetParticipants: Joi.number().integer().min(1).max(100000).required(),
  studyDesign: Joi.string().max(200).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

export const updateStudySchema = Joi.object({
  title: Joi.string().min(5).max(300),
  targetParticipants: Joi.number().integer().min(1).max(100000),
  studyDesign: Joi.string().max(200),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso()
}).min(1);

export const lifecycleSchema = Joi.object({
  status: Joi.string().valid(
    'Draft', 'Protocol Ready', 'IEC Review', 'IEC Approved',
    'CTRI Registered', 'Site Activation', 'Recruiting',
    'Active Follow-up', 'Data Cleaning', 'Close-out', 'Archived',
    'On Hold', 'Terminated'
  ).required()
});
