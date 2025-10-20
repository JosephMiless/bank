import { Router } from "express";
import * as tokensControllers from "./tokens.controllers.js";
import { auth } from "../middleware/auth.js";


export const tokenRouter = Router();

tokenRouter.post('/refreshUser', tokensControllers.refreshUserTokenController);
tokenRouter.delete('/logoutUser', auth, tokensControllers.logoutUserController);