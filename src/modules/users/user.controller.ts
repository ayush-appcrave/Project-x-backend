import { Request, Response } from 'express';
import { User } from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UserRole } from './user.model.js';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (role === UserRole.CLIENT || role === UserRole.VENDOR) {
    throw new ApiError(400, 'Invalid role');
  }
  const user = await User.create({ name, email, password, role });
  const userResponse = await User.findById(user._id).select(
    '-password -refreshToken  -__v',
  ); //remove password & refresh token

  return res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully', userResponse));
});





export { registerUser };