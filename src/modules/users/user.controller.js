import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { User } from './user.model.js';
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
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); // user object from model

    if (!user) {
      throw new ApiError(
        500,
        'Something went wrong while generating Refresh & Access Token due to user not found',
      );
    }
    const accessToken = await user.generateRefreshToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false }); //off auto validation
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating Refresh & Access Token',
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { fullname, email, password, role } = req.body;

  const userExisted = await User.findOne({ email: email });
  
  if (userExisted) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({ fullname, email, password, role });
  const userResponse = await User.findById(user._id).select(
    '-password -refreshToken  -__v',
  ); //remove password & refresh token

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, 'User register successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(401, 'User does not exist');

  const isPasswordValid = await user.isPasswordMatch(password);

  if (!isPasswordValid) throw new ApiError(401, 'Invalid User Password'); //refer user model for isPasswordCorrect Checked is not inverse

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const loggedInUser = await User.findById(user?._id).select(
    '-password -refreshToken  -__v',
  );

  const responseData = {
    accessToken,
    refreshToken,
    _id: loggedInUser._id,
    fullname: loggedInUser.fullname,
    email: loggedInUser.email,
    name: loggedInUser.name,
    role: loggedInUser.role,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, optionsForAccessTokenCookie)
    .cookie('refreshToken', refreshToken, optionsForRefreshTokenCookie)
    .json(new ApiResponse(200, responseData, 'User Logged In Successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'User is not logged in or session has expired');
  }
  if (user && user.refreshToken) {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true },
    );
  } else {
    throw new ApiError(401, 'Unauthorized request for LOGOUT');
  }

  return res
    .status(200)
    .clearCookie('accessToken', optionsForAccessTokenCookie)
    .clearCookie('refreshToken', optionsForRefreshTokenCookie)
    .json(new ApiResponse(200, {}, 'User Logout successfully'));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  //validate the request body
  // then check the old password is correct or not
  // if correct then update the password
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }
  const isPasswordCorrect = await user.isPasswordMatch(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Old Password is not correct');
  }
  user.password = newPassword;
  await user.save();
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

export {
  changeUserPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  register,
  updateUserRole,
};
