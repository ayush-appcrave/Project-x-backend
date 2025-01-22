import Joi from 'joi';
import { userRole } from '../../constants/userRole.constants.js';
import {
  VALIDATION_MESSAGES,
  VALIDATION_REGEX,
} from '../../constants/validation.constants.js';

const registerSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.EMAIL))
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL,
      'string.empty': '{#label} is required',
    }),
  password: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.PASSWORD))
    .messages({
      'string.pattern.base': Object.values(VALIDATION_MESSAGES.PASSWORD).join(
        ', ',
      ),
      'string.empty': '{#label} is required',
    }),
  role: Joi.string()
    .valid(...Object.values(userRole))
    .default(userRole.SYSTEM_ADMIN),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .regex(new RegExp(VALIDATION_REGEX.EMAIL))
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL,
      'string.empty': '{#label} is required',
    }),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
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
  role: Joi.string()
    .valid(...Object.values(userRole))
    .required()
    .messages({
      'any.only': 'Role must be one of: ' + Object.values(userRole).join(', '),
    }),
});

export {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserRoleSchema,
};
