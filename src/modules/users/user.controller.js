import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { User } from './user.model.js';
import { loginSchema, registerSchema } from './user.validation.js';
const optionsForAccessTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 2000, // 120 minutes
};
const optionsForRefreshTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    const accessToken = await user.generateAccessToken();
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

const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { username, fullname, email, password, role } = req.body;

  const userExisted = await User.findOne({ email: email });

  if (userExisted) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({ username, fullname, email, password, role });
  const userResponse = await User.findById(user._id).select(
    '-password -refreshToken  -__v',
  ); //remove password & refresh token

  return res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully', userResponse));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(401, 'User does not exist !!');

  const isPasswordValid = await user.isPasswordMatch(password);

  if (!isPasswordValid) throw new ApiError(401, 'Invalid User Password'); //refer user model for isPasswordCorrect Checked is not inverse

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

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
    username: loggedInUser.username,
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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const receivedRefreshedToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!receivedRefreshedToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedRefreshToken = await jwt.verify(
      receivedRefreshedToken,
      process.env.REFRESH_TOKEN_SECRET,
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
    const { generatedAccessToken, generatedRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie('accessToken', generatedAccessToken, optionsForAccessTokenCookie)
      .cookie(
        'refreshToken',
        generatedRefreshToken,
        optionsForRefreshTokenCookie,
      )
      .json(
        new ApiResponse(
          200,
          {
            accessToken: generatedAccessToken,
            refreshToken: generatedRefreshToken,
          },
          'successfully generated Access and refresh token',
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Refresh Token');
  }
});

export { registerUser, logoutUser, loginUser, refreshAccessToken };
