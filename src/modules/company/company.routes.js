import { Router } from 'express';
import {
  createCompanyType,
  getCompanyList,
  getCompanyDetailsById,
  updateCompanyDetails,
  updateCompanyStatus,
} from './company.controller.js';

import { VerifyJwt } from '../../middlewares/auth.middleware.js';
const router = Router();

router.post('/create-company-type', VerifyJwt, createCompanyType);
router.get('/get-company-list', VerifyJwt, getCompanyList);
router.get('/get-company-details-by-id/:id', VerifyJwt, getCompanyDetailsById);
router.patch('/update-company-details/:id', VerifyJwt, updateCompanyDetails);
router.patch('/update-company-status/:id', VerifyJwt, updateCompanyStatus);

export default router;
