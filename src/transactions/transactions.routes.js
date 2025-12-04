import { Router } from "express";
import { getTransactionsController } from "./transactions.controllers.js";
import {auth} from "../middleware/auth.js";
import { createDepositController } from "./deposits.controllers.js";
import { transferController } from "./transfers.controllers.js";

export const transactionRouter = Router();

transactionRouter.get('/', auth, getTransactionsController);
transactionRouter.post('/deposit', auth, createDepositController);
transactionRouter.post('/transfer', auth, transferController);