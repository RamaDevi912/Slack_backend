import Joi from 'joi';

/**
 * Authentication Validation Schemas
 */
export const authValidation = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    username: Joi.string().alphanum().min(3).max(20).required().messages({
      'string.alphanum': 'Username must be alphanumeric',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 20 characters',
      'any.required': 'Username is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
    firstName: Joi.string().max(50).allow('', null),
    lastName: Joi.string().max(50).allow('', null),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().max(50).allow('', null),
    lastName: Joi.string().max(50).allow('', null),
    bio: Joi.string().max(500).allow('', null),
    status: Joi.string().valid('ONLINE', 'AWAY', 'DO_NOT_DISTURB', 'OFFLINE'),
    customStatus: Joi.string().max(100).allow('', null),
  }),
};
