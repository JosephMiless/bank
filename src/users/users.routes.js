import {Router} from "express";
import * as userLoginControllers from "./users.login.controllers.js";
import * as userProfileControllers from "./users.profile.controllers.js";
import { auth } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.post("/", userLoginControllers.signUpUser);
userRouter.post("/login", userLoginControllers.loginUserController);
userRouter.get("/", auth, userProfileControllers.getUserProfileController);
userRouter.patch("/", auth, userProfileControllers.editUserProfileController);