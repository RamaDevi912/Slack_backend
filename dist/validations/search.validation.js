import Joi from 'joi';
/**
 * Search Validation Schema
 */
export const searchValidation = Joi.object({
    query: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Search query is required',
        'string.max': 'Search query must not exceed 100 characters',
        'any.required': 'Search query is required',
    }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
});
//# sourceMappingURL=search.validation.js.map