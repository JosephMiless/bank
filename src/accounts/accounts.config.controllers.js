import { sequelize } from "../config/sequelize.js";
import { BankAccount } from "../models/bankAccount.js";
import { generateUniqueNumber } from "../utils/uniqueNumber.js";
import { createAccountSchema } from "../validators/accounts.js";
import * as accountServices from "./accounts.services.js";


export const createAccountController = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to acces this endpoint.`});

        const {error, value} = createAccountSchema.validate(req.body);

        if(error) return res.status(404).json({error: error.message});

        let {accountType, currency, userID, accountNumber} = value;

        if(!['USD', 'NGN'].includes(currency)) return res.status(400).json({error: `Invalid currency. Input one of USD or NGN`});

        value.userID = loggedInUser.id;

        value.accountNumber = await generateUniqueNumber(10, BankAccount);

        const accountDetails = await accountServices.createAccount(value, {transaction: t});

        await t.commit();

        return res.status(201).json({message: `Account Created Successfully!`, accountDetails});
         
    } catch (error) {

        await t.rollback();

        console.error(`Error creating bank account. Error: ${error.message}`);

        return res.status(500).json({error: `Internal Server Error.`});
        
    }
};

export const deleteAccountController = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unathorized! KIndly login to access this endpoint`});

        const id = req.params.id;

        if(!id) return res.status(400).json({error: `id is required`});
        
        const accountExists = await accountServices.findAccountByNumberOrUser({id});

        if(accountExists.length === 0) return res.status(404).json({error: `Account not found with id: ${id}. Kindly re-check the id, and try again.`});

        await accountServices.deleteAccount({id}, {transaction: t});

        await t.commit();

        return res.status(200).json({message: `Account Deleted Succeessfully!`});
        
    } catch (error) {

        await t.rollback();

        console.error(`Error deleting bank account. Error: ${error.message}`);

        return res.status(500).json({error: `Internal Server Error`});
        
    }
};