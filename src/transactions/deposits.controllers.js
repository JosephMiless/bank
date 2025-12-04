import { sequelize } from "../config/sequelize.js";
import { recordTransaction, createDeposit, findAccount } from "./transactions.services.js";
import { createDepositSchema } from "../validators/deposits.js";
import {sanitize} from "../utils/sanititzer.js";

export const createDepositController = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to access this endpoint.`});

        const {error, value} = createDepositSchema.validate(req.body);

        if(error) return res.status(400).json({error: error.message});

        let {accountNumber, amount, balance, destinationAccount, status, category} = value;

        if(typeof(amount) === 'string') return res.status(400).json({error: `Enter a valid amount.`});

        const accountExists = await findAccount({accountNumber});

        if(accountExists.length === 0) return res.status(404).json({errror: `Account not found with account number: ${accountNumber}. Kindly re-check and try again.`});
      
        if(loggedInUser.id !== accountExists.userID) return res.status(403).json({error: `You do not have access to perform this transaction.`});
        
        value.balance = parseFloat(accountExists.balance) + parseFloat(value.amount);

        value.destinationAccount = accountExists.id;

        value.status = 'successful';

        value.category = 'deposit';

        await createDeposit({balance: value.balance}, {accountNumber}, {transaction: t});

        const transaction = await sanitize((await recordTransaction(value)).toJSON());

        await t.commit();

        return res.status(201).json({message: `Transaction Successful!🎉`, transaction});
        
    } catch (error) {

        await t.rollback();

        console.error(`Error creating deposit. Error: ${error.message}`);
        
        return res.status(500).json({error: `Internal Server Error.`});
        
    }
};