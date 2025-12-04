import { createDeposit, findAccount, recordTransaction } from "./transactions.services.js";
import { transferSchema } from "../validators/transfrers.js";
import { sequelize } from "../config/sequelize.js";
import { convertCurrency } from "../utils/currency.converter.js";


export const transferController = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to access this endpoint.`});

        const {error, value} = transferSchema.validate(req.body);

        if(error) return res.status(400).json({error: error.message});

        let {sourceAccount, destinationAccount, note, category, status, amount} = value;

        const senderAccount = await findAccount({accountNumber: sourceAccount});

        if(!senderAccount){
            await t.rollback();
            return res.status(404).json({
            error: `Sender account not found with number: ${sourceAccount}. Kindly check the number and try again.`
        });
        };

        const receiverAccount = await findAccount({accountNumber: destinationAccount});

        if(!receiverAccount){
            await t.rollback();
            return res.status(404).json({
            error: `Destination account not found with number: ${destinationAccount}. Kindly check the number and try again.`
        });
        };

        if(senderAccount.userID !== loggedInUser.id) return res.status(403).json({error: `You are not authorized to perfom this transaction; na tiff you be!`});

        if(typeof(amount) === 'string' || amount < 0) return res.status(400).json({error: `Invalid amount! Enter a numeric amount`});
        
        if( parseFloat(senderAccount.balance) < parseFloat(amount)) return res.status(404).json({error: `Insufficent funds. Current balance: ${senderAccount.balance}`});
        
        const senderBalance = parseFloat(senderAccount.balance) - parseFloat(amount);

        // check for varying currencies transaction
        if(senderAccount.currency !== receiverAccount.currency) {
            amount = await convertCurrency(senderAccount.currency, receiverAccount.currency, amount);
        };

        const receiverBalance = parseFloat(receiverAccount.balance) + parseFloat(amount);

        await createDeposit({balance: senderBalance}, {accountNumber: sourceAccount});

        await createDeposit({balance: receiverBalance}, {accountNumber: destinationAccount});

        value.category = 'transfer';
        value.status = 'successful';
        value.sourceAccount = senderAccount.id;
        value.destinationAccount = receiverAccount.id;

        const transaction = await recordTransaction(value);

        value.category = 'deposit';

        await recordTransaction(value);
        
        await t.commit();

        return res.status(201).json({message: `Transaction successful! 🎉`, transaction});
        
    } catch (error) {

        await t.rollback();

        console.error(`Error creating transfer. Error: ${error.message}`);
        
        return res.status(500).json({error: `Internal Server Error.`});
        
    }
};