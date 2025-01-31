import Joi from 'joi';

const documentUploadSchema = Joi.object({
  DocumentName: Joi.string().required().messages({
    'string.empty': 'Document Name is required',
  }),
  Type: Joi.string().required().messages({
    'string.empty': 'Type is required',
  }),
  TypeId: Joi.string().required().messages({
    'string.empty': 'Type ID is required',
  }),
});

export { documentUploadSchema };
