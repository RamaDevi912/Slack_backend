import Joi from 'joi';
/**
 * File Upload Validation Schemas
 */
export const fileValidation = {
    upload: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(52428800).required().messages({
            'number.max': 'File size must not exceed 50MB',
        }),
    }),
};
//# sourceMappingURL=file.validation.js.map