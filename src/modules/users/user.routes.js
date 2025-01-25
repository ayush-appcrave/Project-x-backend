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

import { VerifyJwt } from '../../middlewares/auth.middleware.js';
const router = Router();

router.route('/create-user').post(createUser);
router.route('/logout').post(VerifyJwt, logoutUser);
router.route('/change-password').patch(VerifyJwt, changeUserPassword);
router.route('/update-role/:userId').patch(VerifyJwt, updateUserRole);
router.route('/login').post(loginUser);
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/verify-token').post(VerifyJwt, verifyToken);

export default router;
