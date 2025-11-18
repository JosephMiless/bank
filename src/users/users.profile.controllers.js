import { sanitize } from "../utils/sanititzer.js";
import { findUserProfileByEmailOrID } from "./users.services.js";


export const getUserProfileController = async (req, res) => {
    try {

        const user = req.user;

        if(!user) return res.status(401).json({error: `unauthorized. kidly login to access this endpoint`});

        let userDetails = await findUserProfileByEmailOrID({id: user.id});

        if(!userDetails) return res.status(404).json({error: `user not found`});

        userDetails = await sanitize(userDetails.toJSON());

        return res.status(200).json({userDetails});
        
    } catch (error) {

        console.error(`Error getting user profile. Error: ${error.message}`);

        return res.status(500).json({error: `Internal server error: getting user profilee`,});
        
    }
};