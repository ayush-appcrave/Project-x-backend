import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { RequirementService } from './requirement.service.js';
import { createRequirementSchema } from './requirement.validation.js';

const createRequirement = asyncHandler(async (req, res) => {
  // Validate request body using Joi schema
  const { error } = createRequirementSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw new ApiError(400, error.details.map((e) => e.message).join(', '));
  }

  // Create the requirement
  const requirement = await RequirementService.createRequirement(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, requirement, 'Requirement created successfully'));
});

const getRequirementDetail = asyncHandler(async (req, res) => {
  const { requirementID } = req.params;

  if (!requirementID) {
    throw new ApiError(400, 'Requirement ID is required');
  }

  const requirementDetail = await RequirementService.getRequirementDetail(requirementID);
  return res
    .status(200)
    .json(new ApiResponse(200, requirementDetail, 'Fetched Requirement Detail successfully'));
});

const updateRequirement = asyncHandler(async (req, res) => {
  const { requirementID } = req.params;
  const updateData = req.body;
  const modifiedBy = req.user?.id || 'System';

  if (!requirementID) {
    throw new ApiError(400, 'Requirement ID is required');
  }

  const updatedRequirement = await RequirementService.updateRequirement(
    requirementID,
    updateData,
    modifiedBy
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRequirement, 'Requirement updated successfully'));
});

const getRequirementListing = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    contract_type,
    requirement_by,
    page = 1,
    limit = 50,
    search = '',
  } = req.query;

  // Ensure `page` and `limit` are valid numbers
  const pageNum = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  if (pageNum < 1 || isNaN(pageNum)) {
    throw new ApiError(400, 'Page number must be a positive integer');
  }
  if (pageSize < 1 || isNaN(pageSize)) {
    throw new ApiError(400, 'Limit must be a positive integer');
  }

  const requirements = await RequirementService.getRequirementListing({
    status,
    priority,
    contract_type,
    requirement_by,
    page: pageNum,
    limit: pageSize,
    search,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, requirements, 'Fetched Requirement Listing successfully'));
});

const deleteRequirement = asyncHandler(async (req, res) => {
  const { requirementID } = req.params;

  if (!requirementID) {
    throw new ApiError(400, 'Requirement ID is required');
  }

  await RequirementService.deleteRequirement(requirementID);

  return res.status(200).json(new ApiResponse(200, {}, 'Requirement deleted successfully'));
});

export {
  createRequirement,
  deleteRequirement,
  getRequirementDetail,
  getRequirementListing,
  updateRequirement,
};
