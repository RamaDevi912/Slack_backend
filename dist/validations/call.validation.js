import Joi from 'joi';
/**
 * Call Validation Schemas
 */
export const callValidation = {
    initiate: Joi.object({
        participantIds: Joi.array().items(Joi.string()).min(1).required().messages({
            'array.min': 'At least one participant is required',
            'any.required': 'Participant IDs are required',
        }),
        type: Joi.string().valid('AUDIO', 'VIDEO').default('AUDIO').messages({
            'any.only': 'Call type must be either AUDIO or VIDEO',
        }),
        channelId: Joi.string().allow('', null),
    }),
};
//# sourceMappingURL=call.validation.js.map