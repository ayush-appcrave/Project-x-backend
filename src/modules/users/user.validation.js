import Joi from 'joi';
import { UserRole } from './user.model.js';
const createUserSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
});

export {
  createUserSchema,
  loginSchema,
  changePasswordSchema,
  updateUserRoleSchema,
};
