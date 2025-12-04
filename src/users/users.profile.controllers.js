import { sequelize } from "../config/sequelize.js";
import { sanitize } from "../utils/sanititzer.js";
import { findUserProfileByEmailOrID, updateUserProfile } from "./users.services.js";


export const getUserProfileController = async (req, res) => {
    try {

        const user = req.user;

        if(!user) return res.status(401).json({error: `unauthorized! kidly login to access this endpoint.`});

        let userDetails = await findUserProfileByEmailOrID({id: user.id});

        if(!userDetails) return res.status(404).json({error: `user not found`});

        userDetails = await sanitize(userDetails.toJSON());

        return res.status(200).json({userDetails});
        
    } catch (error) {

        console.error(`Error getting user profile. Error: ${error.message}`);

        return res.status(500).json({error: `Internal server error: getting user profilee`,});
        
    }
};

export const editUserProfileController = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const user = req.user;

        if(!user) return res.status(401).json({error: `unauthorized! kidly login to access this endpoint.`});

        let userDetails = await findUserProfileByEmailOrID({id: user.id});

        if(!userDetails) return res.status(404).json({error: `user not found`});

        const {firstName, lastName} = req.body;

        const value = req.body;

        if(firstName || lastName) await updateUserProfile(value, user.id, {transaction: t});

        const updatedUser = await findUserProfileByEmailOrID({ id: user.id });

        await t.commit();

        return res.status(200).json({message: `Profile updated successfully!`, updatedUser});
        
    } catch (error) {

        await t.rollback();

        console.error(`Error editing user prfofile. Error: ${error.message}`);

        return res.status(500).json({error: `Internal server error`});
        
    }
};