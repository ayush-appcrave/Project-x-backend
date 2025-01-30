import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { createCompanySchema } from './company.validation.js';
import { CompanyService } from './company.service.js';

const createCompany = asyncHandler(async (req, res) => {
  const { error } = createCompanySchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const company = await CompanyService.createCompany(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, company, 'Company created successfully'));
});

export { createCompany };
