import Joi from 'joi';
import { companyStatus, companyTypes } from '../../constants/company.constants.js';

export const createCompanySchema = Joi.object({
  CompanyName: Joi.string().required().trim(),
  CompanyEmail: Joi.string().email().required().trim(),
  CompanyType: Joi.number()
    .valid(...Object.keys(companyTypes.CompanyType).map(Number))
    .required(),
  CompanyAddress: Joi.object({
    City: Joi.string().required().trim(),
    State: Joi.string().required().trim(),
  }).required(),
  CompanySocialLinks: Joi.object({
    Linkedin: Joi.string().uri().required().trim(),
    Website: Joi.string().uri().allow('').trim(),
  }).required(),
  CompanyGst: Joi.string().trim().allow(''), // Allow empty string

  CompanyStatus: Joi.number()
    .valid(...Object.keys(companyStatus).map(Number))
    .required(),
  ModeOfOperations: Joi.array()
    .items(Joi.number().valid(...Object.keys(companyTypes.ModeOfOperations).map(Number)))
    .min(1)
    .required(),
  PocName: Joi.string().required().trim(), // Now required
  PocContact: Joi.string()
    .pattern(/^[0-9]{10}$/) // Ensures exactly 10 digits
    .required()
    .trim()
    .messages({ 'string.pattern.base': 'POC contact must be a valid 10-digit number' }),
  PocEmail: Joi.string().email().required().trim(), // Now required
});
