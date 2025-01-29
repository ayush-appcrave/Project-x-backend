import Joi from 'joi';
import { userRole } from '../../constants/userRole.constants.js';
import {
  VALIDATION_MESSAGES,
  VALIDATION_REGEX,
} from '../../constants/validation.constants.js';

const registerSchema = Joi.object({
  FullName: Joi.string().required(),
  Email: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.EMAIL))
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL,
      'string.empty': '{#label} is required',
    }),
  Password: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.PASSWORD))
    .messages({
      'string.pattern.base': Object.values(VALIDATION_MESSAGES.PASSWORD).join(
        ', ',
      ),
      'string.empty': '{#label} is required',
    }),
  Role: Joi.number()
    .valid(...Object.keys(userRole).map(Number)) // Validate keys
    .required()
    .messages({
      'any.only': 'Role must be one of: ' + Object.keys(userRole).join(', '),
    }),
});

const loginSchema = Joi.object({
  Email: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.EMAIL))
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL,
      'string.empty': '{#label} is required',
    }),
  Password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  OldPassword: Joi.string().required(),
  NewPassword: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.PASSWORD))
    .messages({
      'string.pattern.base': Object.values(VALIDATION_MESSAGES.PASSWORD).join(
        ', ',
      ),
      'string.empty': '{#label} is required',
    }),
});

const updateUserRoleSchema = Joi.object({
  Role: Joi.number()
    .valid(...Object.keys(userRole).map(Number)) // Validate keys
    .required()
    .messages({
      'any.only': 'Role must be one of: ' + Object.keys(userRole).join(', '),
    }),
});

export {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserRoleSchema,
};
