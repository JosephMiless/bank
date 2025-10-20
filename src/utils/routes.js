import { Router } from "express";
import { userRouter } from "../users/users.routes.js";
import { tokenRouter } from "../tokens/tokens.routes.js";

export const routes = Router()

routes.use('/users', userRouter);
routes.use('/tokens', tokenRouter);