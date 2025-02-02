import Joi from 'joi';

export const commentSchema = Joi.object({
  Comment: Joi.string().min(1).max(1000).required(),
  Type: Joi.string().required(),
  TypeId: Joi.string().required(),
});
