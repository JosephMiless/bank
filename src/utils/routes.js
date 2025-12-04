import { Router } from "express";
import { userRouter } from "../users/users.routes.js";
import { tokenRouter } from "../tokens/tokens.routes.js";
import { accountRouter } from "../accounts/accounts.routes.js";
import { transactionRouter } from "../transactions/transactions.routes.js";

export const routes = Router()

routes.use('/users', userRouter);
routes.use('/tokens', tokenRouter);
routes.use('/accounts', accountRouter);
routes.use('/transactions', transactionRouter);