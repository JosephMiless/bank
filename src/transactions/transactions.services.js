import { Transaction } from "../models/transaction.js";
import {BankAccount} from "../models/bankAccount.js";



export const createDeposit = async (balance, accountNumber, options = {}) => {
    return await BankAccount.update(balance, {where: accountNumber}, options);
};

export const findAccount = async (attribute) => {
    return await BankAccount.findOne({where: attribute});
};

export const getTransactions = async (data) => {
    return await Transaction.findAll({where: data});
};

export const recordTransaction = async (data) => {
    return await Transaction.create(data);
};