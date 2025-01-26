import jwt from 'jsonwebtoken';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { User } from './user.model.js';
export const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user)
      throw new ApiError(500, 'User not found during token generation');

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Token generation failed');
  }
};

export const UserService = {
  createUser: async (fullname, email, password, role) => {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new ApiError(400, 'User already exists');

    const user = await User.create({
      fullname: fullname.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
    });
    if (!user) throw new ApiError(500, 'User not created');

    return User.findById(user._id).select('-password -refreshToken -__v');
  },

  loginUser: async (email, password) => {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) throw new ApiError(401, 'User Does not exist');

    const isPasswordValid = await user.isPasswordMatch(password);
    if (!isPasswordValid) throw new ApiError(401, 'Invalid User Password');

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    if (!accessToken || !refreshToken)
      throw new ApiError(500, 'Token generation failed');

    const authResponse = {
      accessToken,
      refreshToken,
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return authResponse;
  },

  logoutUser: async (userId) => {
    const loggedInUser = await User.findOneAndUpdate(
      {
        _id: userId,
        refreshToken: { $exists: true },
      },
      { $unset: { refreshToken: 1 } },
      { new: true },
    );
    if (!loggedInUser) throw new ApiError(500, 'User not found');

    return true;
  },

  changeUserPassword: async (userId, oldPassword, newPassword) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, 'User account not found');
    }

    const isOldPasswordValid = await existingUser.isPasswordMatch(oldPassword);
    if (!isOldPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    existingUser.password = newPassword;
    const savedUser = await existingUser.save();

    if (!savedUser) {
      throw new ApiError(500, 'Failed to save new password');
    }

    return true;
  },

  updateUserRole: async (userId, newRole) => {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        role: newRole,
      },
      { new: true },
    ).select('-password -refreshToken -__v');

    if (!updatedUser) {
      throw new ApiError(400, 'User Not Found');
    }
    return updatedUser;
  },

  refreshAccessToken: async (receivedRefreshToken) => {
    const decodedRefreshToken = jwt.verify(
      receivedRefreshToken,
      config.refresh_token_secret,
    );

    if (!decodedRefreshToken) {
      throw new ApiError(401, 'Refresh token is not decoded');
    }

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh token');
    }

    if (receivedRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user?._id);

    return { accessToken, refreshToken };
  },
};
