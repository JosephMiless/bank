import * as tokens from "../tokens/jwt.js";
import * as bcrypt from "../utils/bcrypt.js";
import * as userSchema from "../validators/user.js";
import * as userService from "./users.services.js";
import * as walletService from "../accounts/accounts.services.js";
import { generateUniqueNumber } from "../utils/uniqueNumber.js";
import { sanitize } from "../utils/sanititzer.js";
import { config } from "../config/env.js";
import { BankAccount } from "../models/bankAccount.js";
import { sequelize } from "../config/sequelize.js";


export const signUpUser = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const {error, value} = userSchema.signUpUserSchema.validate(req.body);

    if(error) return res.status(400).json({error:error.message});

    let { firstName, lastName, email, address, state, postalCode, DOB, SSN, accountType, password } = value;

    // Check if user exists
    const userExists = await userService.findUserByEmailOrID({email: value.email});
    
    if (userExists) {

      await t.rollback();

      return res.status(400).json({ message: "Account already exists" });

    };
    
    // encrypt user's password before storing to DB
    value.password = await bcrypt.hashPassword(value.password);

    let user = await userService.createUser(value, {transaction: t});

    // create a bank account using the user's data

    const accountNumber = await generateUniqueNumber(10, BankAccount);
    
    let wallet = await walletService.createAccount({userID: user.id, accountNumber, accountType}, {transaction: t});

    await t.commit();
    
    user = await sanitize(user.toJSON());

    return res.status(201).json({user, wallet});
    
  } catch (error) {

    await t.rollback();

    console.error("Error signing up User", error);
    
    return res.status(500).json({ error: "Internal Server Error"});
  }
};

export const loginUserController = async (req, res) => {
  try {

    const {error, value} = userSchema.loginUserSchema.validate(req.body);

    if(error) return res.status(400).json({error: error.message});

    const {email, password} = value;

    // check if user exists
    const userExists = await userService.findUserByEmailOrID({email});

    if (!userExists) {
      return res.status(404).json({ message: "User not found. Kindly create an account to login" });
    };

    // compare password
    const passwordMatch = await bcrypt.comparePassword(password, userExists.password);

    if(!passwordMatch) return res.status(400).json({error: "Invalid credentials"});

    // sign the access and refreesh tokens with user details
    const accessToken = tokens.aToken({id: userExists.id});
    const refreshToken = tokens.rToken({id: userExists.id});

    // save the refresh token as an http cookie
    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      user: userExists.firstName
    });
    
  } catch (error) {

    console.error("Error logging in user", error);

    return res.status(500).json({error: "Internal Server Error"});
    
  }
};