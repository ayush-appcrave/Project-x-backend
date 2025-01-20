import { Router } from 'express';
import {
  createUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeUserPassword,
  updateUserRole
} from './user.controller.js';

import { VerifyJwt, authorizeRole } from '../../middlewares/auth.middleware.js';
import { UserRole } from './user.model.js';
const router = Router();

router.route('/create-user').post(createUser);
router.route('/logout').post(VerifyJwt, logoutUser);
router.route('/change-password').patch(VerifyJwt, changeUserPassword);
router.route('/update-role/:userId').patch(VerifyJwt, updateUserRole);
router.route('/login').post(loginUser);
router.route('/refresh-access-token').post(refreshAccessToken);

export default router;
