import joi from 'joi';

export const signUpUserSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    state: joi.string().required(),
    postalCode: joi.string().required(),
    DOB: joi.string().required(),
    SSN: joi.string().required(),
    accountType: joi.string().required(),
    password: joi.string().required().min(6)
});

export const loginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6)
});