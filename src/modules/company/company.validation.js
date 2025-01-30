import Joi from 'joi';
import {
  companyStatus,
  compnayTypes,
} from '../../constants/company.constants.js';

export const createCompanySchema = Joi.object({
  CompanyName: Joi.string().required().trim(),
  CompanyEmail: Joi.string().email().required().trim(),
  CompanyType: Joi.number()
    .valid(...Object.keys(compnayTypes.CompanyType).map(Number))
    .required(),
  CompanyAddress: Joi.object({
    City: Joi.string().required().trim(),
    State: Joi.string().required().trim(),
  }).required(),
  CompanySocialLinks: Joi.object({
    Linkedin: Joi.string().uri().required().trim(),
    Website: Joi.string().uri().allow('').trim(),
  }).required(),
  CompanyGst: Joi.string()
    .trim()
    .allow('') // Allow empty string
    .when('this', {
      is: (value) => value && value.length > 0, // If GST is not empty
      then: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .message('Invalid GST format. Format: 22AAAAA0000A1Z5'),
    }),

  CompanyStatus: Joi.number()
    .valid(...Object.keys(companyStatus).map(Number))
    .required(),
  ModeOfOperations: Joi.array()
    .items(
      Joi.number().valid(
        ...Object.keys(compnayTypes.ModeOfOperations).map(Number),
      ),
    )
    .min(1)
    .required(),
  PocName: Joi.string().allow('').trim(),
  PocContact: Joi.string().allow('').trim(),
  PocEmail: Joi.string().email().allow('').trim(),
});
