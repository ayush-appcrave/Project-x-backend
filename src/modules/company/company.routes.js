import { Router } from 'express';
import { createCompany,getCompanyDetail } from './company.controller.js';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-company').post(VerifyJwt,createCompany);
router.route('/get-company-detail').get(VerifyJwt,getCompanyDetail);

export default router;
