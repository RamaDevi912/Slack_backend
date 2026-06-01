import Joi from 'joi';

/**
 * Message Validation Schemas
 */
export const messageValidation = {
  create: Joi.object({
    content: Joi.string().min(1).max(4000).required().messages({
      'string.min': 'Message content is required',
      'string.max': 'Message content must not exceed 4000 characters',
      'any.required': 'Message content is required',
    }),
    fileId: Joi.string().allow('', null),
    threadId: Joi.string().allow('', null),
  }),

  update: Joi.object({
    content: Joi.string().min(1).max(4000).required().messages({
      'string.min': 'Message content is required',
      'string.max': 'Message content must not exceed 4000 characters',
      'any.required': 'Message content is required',
    }),
  }),

  addReaction: Joi.object({
    emoji: Joi.string().required().messages({
      'any.required': 'Emoji is required',
    }),
  }),
};
