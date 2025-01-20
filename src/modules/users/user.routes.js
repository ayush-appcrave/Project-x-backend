import { Router } from 'express';
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
} from './user.controller.js';

import { VerifyJwt, authorizeRole } from '../../middlewares/auth.middleware.js';
import { UserRole } from './user.model.js';
const router = Router();

router.route('/register').post(registerUser);
router.route('/logout').post(VerifyJwt, logoutUser);
router.route('/login').post(loginUser);
router.route('/refreshAccessToken').post(refreshAccessToken);

export default router;
