import { findUserProfileByEmailOrID } from "../users/users.services.js";



export const getUserBankAccounts = async (req, res) => {
    try {

        const loggedInUser = req.user;

        if(!loggedInUser) return res.status(401).json({error: `Unathorized! Kindly login to access this endpoint.`});

        const userBankAccounts = await findUserProfileByEmailOrID({id: loggedInUser.id});

        return res.status(200).json(userBankAccounts);
        
    } catch (error) {

        console.error(`Error getting user accounts. Error: ${error.message}`);
        
        return res.status(500).json({error: `Internal Server Error`});
        
    }
};