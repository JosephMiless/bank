import * as tokens from "../tokens/jwt.js";
import * as bcrypt from "../utils/bcrypt.js";
import * as userSchema from "../validators/user.js";
import * as userService from "./users.services.js";
import { sanitize } from "../utils/sanititzer.js";
import { config } from "../config/env.js";


export const signUpUser = async (req, res) => {
  try {

    const {error, value} = userSchema.signUpUserSchema.validate(req.body);

    if(error) return res.status(400).json({error:error.message});

    const { firstName, lastName, email, address, state, postalCode, DOB, SSN, password } = value;

    // Check if user exists
    const userExists = await userService.findUserByEmail(email);
    
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Account already exists" });
    };
    
    // encrypt user's password before storing to DB
    const hashedPassword = await bcrypt.hashPassword(password);

    let user = await userService.createUser({ firstName, lastName, email, address, state, postalCode, DOB, SSN, password: hashedPassword});

    user = await sanitize(user.toJSON());

    return res.status(201).json(user);
    
  } catch (error) {

    console.log("Error signing up User", error.message);
    
    return res.status(500).json({ error: "Internal Server Error"});
  }
};

export const loginUserController = async (req, res) => {
  try {

    const {error, value} = userSchema.loginUserSchema.validate(req.body);

    if(error) return res.status(400).json({error: error.message});

    const {email, password} = value;

    // check if user exists
    const userExists = await userService.findUserByEmail(email);

    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found. Kindly create an account to login" });
    };

    // compare password
    const passwordMatch = await bcrypt.comparePassword(password, userExists[0].password);

    if(!passwordMatch) return res.status(400).json({error: "Invalid credentials"});

    // sign the access and refreesh tokens with user details
    const accessToken = tokens.aToken({id: userExists[0].id});
    const refreshToken = tokens.rToken({id: userExists[0].id});

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
      user: userExists[0].firstName
    });
    
  } catch (error) {

    console.log("Error logging in user", error);

    return res.status(500).json({error: "Internal Server Error"});
    
  }
};