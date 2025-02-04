import Joi from 'joi';
import { requirementPriority, requirementStatus, requirementContractType } from '../../constants/requirement.constants.js';

export const createRequirementSchema = Joi.object({
  requirement_title: Joi.string().required().trim(),
  requirement_by: Joi.string().required().trim(), // Reference to Company ID
  number_of_positions: Joi.number().integer().min(1).required(),
  assigned_to: Joi.array().items(Joi.string().trim()).required(), // Array of User IDs
  location: Joi.string().required().trim(),
  job_description: Joi.string().required().trim(),
  skills: Joi.string().required().trim(),
  budget: Joi.string().required().trim(),
  experience: Joi.string().required().trim(),
  priority: Joi.number()
    .valid(...Object.keys(requirementPriority).map(Number))
    .required(),
  status: Joi.number()
    .valid(...Object.keys(requirementStatus).map(Number))
    .required(),
  contract_type: Joi.number()
    .valid(...Object.keys(requirementContractType).map(Number))
    .required(),
  payroll: Joi.string().trim().required(),
  remarks: Joi.string().trim().allow(''),
});

export const updateRequirementSchema = Joi.object({
  requirement_title: Joi.string().trim(),
  number_of_positions: Joi.number().integer().min(1),
  assigned_to: Joi.array().items(Joi.string().trim()),
  location: Joi.string().trim(),
  job_description: Joi.string().trim(),
  skills: Joi.string().trim(),
  budget: Joi.string().trim(),
  experience: Joi.string().trim(),
  priority: Joi.number().valid(...Object.keys(requirementPriority).map(Number)),
  status: Joi.number().valid(...Object.keys(requirementStatus).map(Number)),
  contract_type: Joi.number().valid(...Object.keys(requirementContractType).map(Number)),
  payroll: Joi.string().trim(),
  remarks: Joi.string().trim().allow(''),
}).min(1); // Ensure at least one field is being updated
