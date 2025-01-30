import { Router } from 'express';
import { createCompany,getCompanyDetail,updateCompany } from './company.controller.js';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-company').post(VerifyJwt,createCompany);
router.route('/company-detail/:companyID').get(VerifyJwt,getCompanyDetail);
router.route('/update-company/:companyID').put(VerifyJwt, updateCompany); // New PUT route


export default router;
