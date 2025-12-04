import { BankAccount } from "../models/bankAccount.js"


export const findAccountByNumberOrUser = async (attribute) => {
    return await BankAccount.findAll({where: attribute})
};

export const createAccount = async (data, options = {}) => {
    return await BankAccount.create(data, options);
};

export const deleteAccount = async (data, options) => {
    return await BankAccount.destroy({where: data}, options);
};