import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { User } from './user.model.js';
import {
  generateAccessTokenAndRefreshToken,
  UserService,
} from './user.service.js';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserRoleSchema,
} from './user.validation.js';
const optionsForAccessTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: parseInt(config.access_token_expiry), // 1 day in milliseconds
};
const optionsForRefreshTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: parseInt(config.refresh_token_expiry), // 7 days in milliseconds
};

const createUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { fullname, email, password, role } = req.body;
  const user = await UserService.createUser(fullname, email, password, role);

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User register successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = req.body;
  const user = await UserService.loginUser(email, password);

  return res
    .status(200)
    .cookie('accessToken', user.accessToken, optionsForAccessTokenCookie)
    .cookie('refreshToken', user.refreshToken, optionsForRefreshTokenCookie)
    .json(new ApiResponse(200, user, 'User Logged In Successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await UserService.logoutUser(req.user._id);

  if (!user) {
    throw new ApiError(400, 'Unable to logout user');
  }

  return res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, {}, 'User Logout successfully'));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { oldPassword, newPassword } = req.body;
  const user = await UserService.changeUserPassword(
    req.user._id,
    oldPassword,
    newPassword,
  );

  if (!user) {
    throw new ApiError(400, 'Unable to change password');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Password changed successfully'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { error } = updateUserRoleSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { role } = req.body;
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid User ID');
  }

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { role: role },
    { new: true },
  ).select('-password -refreshToken -__v');

  if (!user) {
    throw new ApiError(400, 'User not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User role updated successfully'));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const receivedRefreshedToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!receivedRefreshedToken) {
    throw new ApiError(401, 'Unauthorized request: Refresh token is missing');
  }

  try {
    const decodedRefreshToken = jwt.verify(
      receivedRefreshedToken,
      config.refresh_token_secret,
    );

    if (!decodedRefreshToken) {
      throw new ApiError(401, 'Refresh token is not decoded');
    }
    const user = await User.findById(decodedRefreshToken?._id); //refer user model for this

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh token');
    }
    if (receivedRefreshedToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user?._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, optionsForAccessTokenCookie)
      .cookie('refreshToken', refreshToken, optionsForRefreshTokenCookie)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          'successfully generated Access and refresh token',
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Refresh Token');
  }
});

const verifyToken = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      valid: false,
      message: 'Token validation failed',
    });
  }

  return res.status(200).json({
    valid: true,
    user: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
export {
  changeUserPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  createUser,
  updateUserRole,
  verifyToken,
};
