import { Router } from 'express';
import {
  changeUserPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  register,
  updateUserRole,
} from './user.controller.js';

import { VerifyJwt } from '../../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(register);
router.route('/logout').post(VerifyJwt, logoutUser);
router.route('/change-password').patch(VerifyJwt, changeUserPassword);
router.route('/update-role/:userId').patch(VerifyJwt, updateUserRole);
router.route('/login').post(loginUser);
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/verify-token').post(VerifyJwt, (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      valid: false,
      message: "Token validation failed"
    });
  }

  return res.status(200).json({
    valid: true,
    user: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;
