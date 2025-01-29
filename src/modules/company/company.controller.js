import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CompanyService } from './company.service.js';

const createCompany = asyncHandler(async (req, res) => {
  const companyData = req.body;
  const createdBy = req.user._id;

  const company = await CompanyService.createCompany({
    ...companyData,
    CreatedBy: createdBy,
  });

  if (!company) {
    throw new ApiError(500, 'Failed to create company');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, company, 'Company created successfully'));
});

export { createCompany };
