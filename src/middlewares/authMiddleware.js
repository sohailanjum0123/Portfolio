import { User } from "../models/userModel.js";
import { apiError } from "../utils/apiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHnadler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Beared", "");

    if (!token) {
      throw new apiError(401, "Unauthorized requeset");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
    
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Access Token");
  }
});




