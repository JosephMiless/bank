import { Router } from "express";
import * as accountConfig from "./accounts.config.controllers.js";
import * as accountInfo from "./accounts.profile.controllers.js";
import { auth } from "../middleware/auth.js";

export const accountRouter = Router();

accountRouter.post('/', auth, accountConfig.createAccountController);
accountRouter.get('/', auth, accountInfo.getUserBankAccounts);
accountRouter.delete('/:id', auth, accountConfig.deleteAccountController);