import Joi from 'joi';

/**
 * Direct Message Validation Schemas
 */
export const directMessageValidation = {
  createRoom: Joi.object({
    recipientId: Joi.string().required().messages({
      'any.required': 'Recipient ID is required',
    }),
  }),

  send: Joi.object({
    content: Joi.string().min(1).max(4000).required().messages({
      'string.min': 'Message content is required',
      'string.max': 'Message content must not exceed 4000 characters',
      'any.required': 'Message content is required',
    }),
  }),
};
