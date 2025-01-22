import Joi from 'joi';
import { UserRole } from './user.model.js';
import Joi from 'joi';
import { VALIDATION_REGEX, VALIDATION_MESSAGES } from '../../constants/validation.constants.js';

export const registerSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string()
    .pattern(VALIDATION_REGEX.EMAIL)
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL
    }),
  password: Joi.string()
    .pattern(VALIDATION_REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.PASSWORD.GENERAL,
      'string.min': VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
    }),
  role: Joi.string().valid('user', 'admin').default('user')
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(VALIDATION_REGEX.EMAIL)
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.EMAIL
    }),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(VALIDATION_REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': VALIDATION_MESSAGES.PASSWORD.GENERAL,
      'string.min': VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
    })
});


const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
});

export {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserRoleSchema,
};
