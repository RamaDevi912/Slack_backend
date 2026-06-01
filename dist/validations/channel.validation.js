import Joi from 'joi';
/**
 * Channel Validation Schemas
 */
export const channelValidation = {
    create: Joi.object({
        name: Joi.string().min(1).max(80).required().messages({
            'string.min': 'Channel name is required',
            'string.max': 'Channel name must not exceed 80 characters',
            'any.required': 'Channel name is required',
        }),
        description: Joi.string().max(500).allow('', null),
        isPrivate: Joi.boolean().default(false),
        topic: Joi.string().max(200).allow('', null),
    }),
    update: Joi.object({
        name: Joi.string().min(1).max(80),
        description: Joi.string().max(500).allow('', null),
        topic: Joi.string().max(200).allow('', null),
    }),
    addMember: Joi.object({
        userId: Joi.string().required().messages({
            'any.required': 'User ID is required',
        }),
    }),
};
//# sourceMappingURL=channel.validation.js.map