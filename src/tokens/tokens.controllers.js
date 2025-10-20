import jwt from "jsonwebtoken";
import {config} from "../config/env.js";
import * as tokens from "./jwt.js"; // assuming this creates access tokens

export const refreshUserTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.userRefreshToken;

    // check if token exists
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // verify refresh token
    jwt.verify(refreshToken, config.rsecret, (error, decoded) => {
      if (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ error: "Session expired. Please log in again." });
      };

      // issue new access token
      const newAccessToken = tokens.aToken({ id: decoded.id});

      // reissue a new refresh token for rotation
      const newRefreshToken = tokens.rToken({ id: decoded.id});
      res.cookie("userRefreshToken", newRefreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? "None" : "Lax",
        path: "/",
        maxAge: 6 * 30 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
      });
    });

  } catch (error) {
    console.error("Error refreshing user token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUserController = async (req, res) => {
    try {
        const loggedInStaff = req.user;

        if (!loggedInStaff) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        // Clear the refresh token cookie
        res.clearCookie("userRefreshToken");

        return res.status(200).json({
            Message: "User logged out successfully"
        });

    } catch (error) {
        console.error("Error logging out user", error);

        return res.status(400).json({
            error: "Error logging out user"
        });
    }
};