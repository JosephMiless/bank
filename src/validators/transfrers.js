import joi from 'joi';

export const transferSchema = joi.object({
    sourceAccount: joi.string().required(),
    destinationAccount: joi.string().required(),
    note: joi.string(),
    amount: joi.number().required().min(100)
});