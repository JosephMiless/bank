import { getTransactions } from "./transactions.services.js";


export const getTransactionsController = async (req, res) => {
    try {

        const loggedInUser = req.user;

        const id = loggedInUser.id;

        if(!loggedInUser) return res.status(401).json({error: `Unauthorized! Kindly login to access this endpoint.`});

        const transactions = await getTransactions({id});

        if(transactions.length === 0) return res.status(404).json({message: `No available transactions.`});

        return res.status(200).json({transactions});
        
    } catch (error) {

        console.error(`Error getting all transactions. Error: ${error}`);
        
        return res.status(500).json({error: `Internal Server Error.`});
        
    }
};