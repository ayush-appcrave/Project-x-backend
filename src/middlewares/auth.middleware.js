import jwt from 'jsonwebtoken';
import { config } from '../config/appConfig.js';
import { userRole as UserRole } from '../constants/userRole.constants.js';
import { User } from '../modules/users/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const VerifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header('Authorization')?.replace('Bearer ', ''); // Get access token

    if (!token || typeof token !== 'string') {
      throw new ApiError(401, 'Authorization token is missing or invalid');
    }

    const decodedToken = jwt.verify(token, config.access_token_secret);

    const user = await User.findById(decodedToken?._id).select(
      '-Password -RefreshToken',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const UserRole = req.user?.Role;
    if (!UserRole || !allowedRoles.includes(UserRole)) {
      throw new ApiError(403, 'You are not authorized to access this resource');
    }
    next();
  };
};
