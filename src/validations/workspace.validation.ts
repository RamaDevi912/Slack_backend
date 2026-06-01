import Joi from 'joi';

/**
 * Workspace Validation Schemas
 */
export const workspaceValidation = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Workspace name is required',
      'string.max': 'Workspace name must not exceed 100 characters',
      'any.required': 'Workspace name is required',
    }),
    description: Joi.string().max(500).allow('', null),
    slug: Joi.string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .min(3)
      .max(50)
      .optional()
      .allow('', null)
      .messages({
        'string.pattern.base': 'Slug must contain only lowercase alphanumeric characters and single hyphens',
        'string.min': 'Slug must be at least 3 characters',
        'string.max': 'Slug must not exceed 50 characters',
      }),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().max(500).allow('', null),
  }),

  invite: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    role: Joi.string()
      .valid('OWNER', 'ADMIN', 'MEMBER', 'GUEST')
      .default('MEMBER'),
  }),

  addMember: Joi.object({
    userId: Joi.string().required().messages({
      'any.required': 'User ID is required',
    }),
    role: Joi.string()
      .valid('OWNER', 'ADMIN', 'MEMBER', 'GUEST')
      .default('MEMBER'),
  }),
};
