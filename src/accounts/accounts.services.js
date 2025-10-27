import { BankAccount } from "../models/bankAccount.js"


export const findAccountByNumberOrUser = async (attribute) => {
    return await BankAccount.findAll({where: {attribute}})
};

export const createAccount = async (data) => {
    return await BankAccount.create(data)
};