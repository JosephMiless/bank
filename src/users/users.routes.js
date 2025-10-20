import {Router} from "express";
import * as userControllers from "./users.controllers.js";

export const userRouter = Router();

userRouter.post("/", userControllers.signUpUser);
userRouter.post("/login", userControllers.loginUserController);