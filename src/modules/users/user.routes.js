import { Router } from 'express';
import {
  changeUserPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  createUser,
  updateUserRole,
  verifyToken,
} from './user.controller.js';
import { User } from './user.model.js'; // Import the User model
import { asyncHandler } from '../../utils/asyncHandler.js';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
const router = Router();

router.route('/create-user').post(createUser);
router.route('/logout').post(VerifyJwt, logoutUser);
router.route('/change-password').patch(VerifyJwt, changeUserPassword);
router.route('/update-role/:userId').patch(VerifyJwt, updateUserRole);
router.route('/login').post(loginUser);
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/verify-token').post(VerifyJwt, verifyToken);


router.get('/find-null-emails', asyncHandler(async (req, res) => {
  const usersWithNullEmail = await User.find({ email: null });
  return res.status(200).json(usersWithNullEmail);
}));

export default router;
