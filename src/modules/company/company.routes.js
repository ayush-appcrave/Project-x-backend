import { Router } from 'express';
import {
  createClientTypeCompany,
  createVendorTypeCompany,
  getClientCompanyDetailsById,
  getClientCompanyList,
  getVendorCompanyDetailsById,
  getVendorCompanyList,
  updateClientCompanyDetails,
  updateVendorCompanyDetails,
} from './company.controller.js';

import { VerifyJwt } from '../../middlewares/auth.middleware.js';
const router = Router();

router.post('/create-client-type-company', VerifyJwt, createClientTypeCompany);
router.post('/create-vendor-type-company', VerifyJwt, createVendorTypeCompany);
router.get('/get-client-company-list', VerifyJwt, getClientCompanyList);
router.get('/get-vendor-company-list', VerifyJwt, getVendorCompanyList);

router.get('/get-client-company-details-by-id/:id', VerifyJwt, getClientCompanyDetailsById);
router.get('/get-vendor-company-details-by-id/:id', VerifyJwt, getVendorCompanyDetailsById);
router.patch('/update-client-company-details/:id', VerifyJwt, updateClientCompanyDetails);
router.patch('/update-vendor-company-details/:id', VerifyJwt, updateVendorCompanyDetails);

export default router;
