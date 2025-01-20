// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { config } from "../config/appConfig.js";
import { UserRole } from "../modules/users/user.model.js";
import { User } from "../modules/users/user.model.js";
export const VerifyJwt = asyncHandler(async (req, res,next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //get access token

    if (!token || typeof token !== "string") {
      throw new ApiError(401, "authorization token is missing or invalid");
    }
    const decodedToken = jwt.verify(token, config.access_token_secret);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});



 export const authorizeRole = (...allowedRoles)=>{
  return (req,res,next)=>{
    const userRole = req.user?.role;
    if(!userRole || !allowedRoles.includes(userRole)){
      throw new ApiError(403,"You are not authorized to access this resource")
    }
    next();
  }
 }