import jwt from 'jsonwebtoken';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { User } from './user.model.js';

export const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(500, 'User not found during token generation');

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.RefreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(500, 'Token generation failed');
  }
};

export const UserService = {
  createUser: async (FullName, Email, Password, Role) => {
    const existingUser = await User.findOne({ Email });
    if (existingUser) throw new ApiError(400, 'User already exists');

    const user = await User.create({
      FullName: FullName.toLowerCase(),
      Email: Email.toLowerCase(),
      Password,
      Role: Number(Role),
    });
    if (!user) throw new ApiError(500, 'User not created');

    return User.findById(user._id).select('-Password -RefreshToken -__v');
  },

  loginUser: async (Email, Password) => {
    const user = await User.findOne({ Email });
    if (!user) throw new ApiError(401, 'User Does not exist');

    const isPasswordValid = await user.isPasswordMatch(Password);
    if (!isPasswordValid) throw new ApiError(401, 'Invalid User Password');

    const { AccessToken, RefreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    if (!AccessToken || !RefreshToken) throw new ApiError(500, 'Token generation failed');

    const authResponse = {
      AccessToken,
      RefreshToken,
      _id: user._id,
      FullName: user.FullName,
      Email: user.Email,
      Role: user.Role,
    };

    return authResponse;
  },

  logoutUser: async (userId) => {
    const loggedInUser = await User.findOneAndUpdate(
      {
        _id: userId,
        RefreshToken: { $exists: true },
      },
      { $unset: { RefreshToken: 1 } },
      { new: true }
    );
    if (!loggedInUser) throw new ApiError(500, 'User not found');

    return true;
  },

  changeUserPassword: async (userId, OldPassword, NewPassword) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, 'User account not found');
    }

    const isOldPasswordValid = await existingUser.isPasswordMatch(OldPassword);
    if (!isOldPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    existingUser.Password = NewPassword;
    const savedUser = await existingUser.save();

    if (!savedUser) {
      throw new ApiError(500, 'Failed to save new password');
    }

    return true;
  },

  updateUserRole: async (userId, NewRole) => {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        Role: Number(NewRole),
      },
      { new: true }
    ).select('-Password -RefreshToken -__v');

    if (!updatedUser) {
      throw new ApiError(400, 'User Not Found');
    }
    return updatedUser;
  },

  refreshAccessToken: async (receivedRefreshToken) => {
    const decodedRefreshToken = jwt.verify(receivedRefreshToken, config.refresh_token_secret);

    if (!decodedRefreshToken) {
      throw new ApiError(401, 'Refresh token is not decoded');
    }

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh token');
    }

    if (receivedRefreshToken !== user?.RefreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { AccessToken, RefreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

    return { AccessToken, RefreshToken };
  },
  getAllUsers: async () => {
    const users = await User.find(null).select(
      '-Password -RefreshToken -__v -Role -createdAt -updatedAt'
    );
    if (!users) throw new ApiError(500, 'Unable to fetch users');
    return users;
  },
};
