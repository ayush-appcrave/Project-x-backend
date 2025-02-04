import { Router } from 'express';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
import {
  createRequirement,
  getRequirementDetail,
  getRequirementListing,
  updateRequirement,
  deleteRequirement
} from './requirement.controller.js';

const router = Router();

router.use(VerifyJwt);

router.route('/create-requirement').post(createRequirement);
router.route('/requirement-detail/:requirementID').get(getRequirementDetail);
router.route('/update-requirement/:requirementID').put(updateRequirement);
router.route('/delete-requirement/:requirementID').delete(deleteRequirement);
router.route('/').get(getRequirementListing);

export default router;
