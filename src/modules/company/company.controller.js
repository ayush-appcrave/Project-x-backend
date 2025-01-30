import {asyncHandler} from '../../utils/asyncHandler.js';
import {ApiResponse} from '../../utils/ApiResponse.js';
import {ApiError} from '../../utils/ApiError.js';
import {createCompanySchema} from './company.validation.js';
import {CompanyService} from './company.service.js';

const createCompany = asyncHandler(async (req, res) => {
    // Validate request body using Joi schema
    const { error } = createCompanySchema.validate(req.body, { abortEarly: false });
    if (error) {
        throw new ApiError(400, error.details.map((e) => e.message).join(', '));
    }

    // Create the company
    const company = await CompanyService.createCompany(req.body, req.user._id);

    return res
        .status(201)
        .json(new ApiResponse(201, company, 'Company created successfully'));
});

const getCompanyDetail = asyncHandler(async (req, res) => {
    const { companyID } = req.params;  // Fetching from params instead of body

    if (!companyID) {
        throw new ApiError(400, 'Company ID is required');
    }

    const companyDetail = await CompanyService.getCompanyDetail(companyID);
    console.log(companyDetail);
    return res
        .status(200)  // Changed from 201 to 200
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
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedCompany, 'Company updated successfully'));
  });

export {createCompany,getCompanyDetail ,updateCompany};
