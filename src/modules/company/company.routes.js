import { Router } from 'express';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
import {
  createCompany,
  getCompanyDetail,
  getCompanyListing,
  updateCompany,
} from './company.controller.js';

const router = Router();

router.use(VerifyJwt);

router.route('/create-company').post(createCompany);
router.route('/company-detail/:companyID').get(getCompanyDetail);
router.route('/update-company/:companyID').put(updateCompany); // New PUT route
router.route('/').get(getCompanyListing);

router.route('/');

export default router;
