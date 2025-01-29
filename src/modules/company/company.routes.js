import { Router } from 'express';
import { CompanyController } from './company.controller.js';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-company').post(VerifyJwt,createCompany);

export default router;
