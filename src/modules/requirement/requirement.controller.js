import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CompanyService } from './company.service.js';
import { createCompanySchema } from './company.validation.js';

const createCompany = asyncHandler(async (req, res) => {
  // Validate request body using Joi schema
  const { error } = createCompanySchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details.map((e) => e.message).join(', '));
  }

  // Create the company
  const company = await CompanyService.createCompany(req.body, req.user._id);

  return res.status(201).json(new ApiResponse(201, company, 'Company created successfully'));
});

const getCompanyDetail = asyncHandler(async (req, res) => {
  const { companyID } = req.params; // Fetching from params instead of body

  if (!companyID) {
    throw new ApiError(400, 'Company ID is required');
  }

  const companyDetail = await CompanyService.getCompanyDetail(companyID);
  console.log(companyDetail);
  return res
    .status(200) // Changed from 201 to 200
    .json(new ApiResponse(200, companyDetail, 'Fetched Company Detail successfully'));
});

const updateCompany = asyncHandler(async (req, res) => {
  const { companyID } = req.params;
  const updateData = req.body;
  const modifiedBy = req.user?.id || 'System'; // Assuming user ID is available from auth middleware

  if (!companyID) {
    throw new ApiError(400, 'Company ID is required');
  }

  const updatedCompany = await CompanyService.updateCompany(companyID, updateData, modifiedBy);

  return res.status(200).json(new ApiResponse(200, updatedCompany, 'Company updated successfully'));
});

const getCompanyListing = asyncHandler(async (req, res) => {
  const { type, status, page = 1, limit = 50, search = '' } = req.query; // Get filters

  // Ensure `type` is provided and is a valid number
  if (!type || isNaN(type)) {
    throw new ApiError(400, 'Company type is required and must be a valid number');
  }

  // Ensure `page` and `limit` are valid numbers
  const pageNum = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  if (pageNum < 1 || isNaN(pageNum)) {
    throw new ApiError(400, 'Page number must be a positive integer');
  }
  if (pageSize < 1 || isNaN(pageSize)) {
    throw new ApiError(400, 'Limit must be a positive integer');
  }

  const companies = await CompanyService.getCompanyListing({
    type,
    status,
    page: pageNum,
    limit: pageSize,
    search,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, companies, 'Fetched Company Listing successfully'));
});
export { createCompany, getCompanyDetail, getCompanyListing, updateCompany };
