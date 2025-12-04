import joi from 'joi';

export const createAccountSchema = joi.object({
    accountType: joi.string().required(),
    currency: joi.string().required()
});