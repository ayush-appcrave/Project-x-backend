import { isValidObjectId } from 'mongoose';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UserService } from './user.service.js';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserRoleSchema,
} from './user.validation.js';

const optionsForAccessTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: parseInt(config.access_token_expiry),
};
const optionsForRefreshTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: parseInt(config.refresh_token_expiry),
};

const createUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { FullName, Email, Password, Role } = req.body;
  const user = await UserService.createUser(FullName, Email, Password, Role);

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { Email, Password } = req.body;
  const user = await UserService.loginUser(Email, Password);

  return res
    .status(200)
    .cookie('AccessToken', user.AccessToken, optionsForAccessTokenCookie) 
    .cookie('RefreshToken', user.RefreshToken, optionsForRefreshTokenCookie) 
    .json(new ApiResponse(200, user, 'User Logged In Successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await UserService.logoutUser(req.user._id);

  if (!user) {
    throw new ApiError(400, 'Unable to logout user');
  }

  return res
    .status(200)
    .clearCookie('AccessToken') 
    .clearCookie('RefreshToken') 
    .json(new ApiResponse(200, {}, 'User Logout successfully'));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { OldPassword, NewPassword } = req.body;
  const user = await UserService.changeUserPassword(
    req.user._id,
    OldPassword,
    NewPassword,
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
  const { Role } = req.body;
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid Mongoose Id');
  }
  const updateUserRole = await UserService.updateUserRole(userId, Role);
  if (!updateUserRole) {
    throw new ApiError(500, 'Unable To Update User Role');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updateUserRole, 'User role updated successfully'),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const receivedRefreshToken =
    req.cookies.refreshToken || req.body.RefreshToken;

  if (!receivedRefreshToken) {
    throw new ApiError(401, 'Unauthorized request: Refresh token is missing');
  }

  const { AccessToken, RefreshToken } = await UserService.refreshAccessToken(
    receivedRefreshToken,
  );

  return res
    .status(200)
    .cookie('accessToken', AccessToken, optionsForAccessTokenCookie)
    .cookie('refreshToken', RefreshToken, optionsForRefreshTokenCookie)
    .json(
      new ApiResponse(
        200,
        { AccessToken, RefreshToken },
        'Successfully generated Access and Refresh Token',
      ),
    );
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
      FullName: req.user.FullName,
      Email: req.user.Email,
      Role: req.user.Role,
    },
  });
});

export {
  changeUserPassword,
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserRole,
  verifyToken,
};
