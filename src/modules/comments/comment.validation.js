import Joi from 'joi';

const commentSchema = Joi.object({
  Comment: Joi.string().min(1).max(1000).required(),
  Type: Joi.string().required(),
  TypeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(), // Ensure valid MongoDB ObjectId
});

const updateCommentSchema = Joi.object({
  Comment: Joi.string().min(1).max(1000).required(),
});

const commentIdSchema = Joi.object({
  commentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export { commentIdSchema, commentSchema, updateCommentSchema };
