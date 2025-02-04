import { ApiError } from '../../utils/ApiError.js';
import { Requirement } from './models/requirement.model.js';

const RequirementService = {
  // Create a new requirement
  createRequirement: async (requirementData, createdBy) => {
    console.log(requirementData);
    const { requirement_by, priority, status, contract_type, ...rest } = requirementData;

    // Create the requirement
    const requirement = await Requirement.create({
      ...rest,
      requirement_by: requirement_by, // Reference to company
      priority: Number(priority),
      status: Number(status),
      contract_type: Number(contract_type),
      created_by: createdBy,
      modified_by: createdBy,
    });

    if (!requirement) {
      throw new ApiError(500, 'Failed to create requirement');
    }

    return requirement;
  },

  // Fetch requirement details by ID
  getRequirementDetail: async (requirementID) => {
    console.log('Getting Requirement Detail with ID', requirementID);

    if (!requirementID) {
      throw new ApiError(400, 'Requirement ID is required');
    }

    try {
      const requirement = await Requirement.findById(requirementID).populate('requirement_by');

      if (!requirement) {
        throw new ApiError(404, 'Requirement not found');
      }

      return requirement;
    } catch (error) {
      throw new ApiError(500, 'Error fetching requirement details');
    }
  },

  // Update an existing requirement
  updateRequirement: async (requirementID, updateData, modifiedBy) => {
    if (!requirementID) {
      throw new ApiError(400, 'Requirement ID is required');
    }

    try {
      const updatedRequirement = await Requirement.findByIdAndUpdate(
        requirementID,
        {
          ...updateData,
          modified_by: modifiedBy,
        },
        { new: true, runValidators: true }
      );

      if (!updatedRequirement) {
        throw new ApiError(404, 'Requirement not found');
      }

      return updatedRequirement;
    } catch (error) {
      throw new ApiError(500, `Error updating requirement: ${error.message}`);
    }
  },

  // Fetch requirement listing with filters and pagination
  getRequirementListing: async ({ status, page = 1, limit = 50, search = '' }) => {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 50;

      const matchStatus = status ? { status: Number(status) } : {};

      // Keyword search across multiple fields
      const searchQuery = search
        ? {
            $or: [
              { requirement_title: { $regex: search, $options: 'i' } },
              { location: { $regex: search, $options: 'i' } },
              { job_description: { $regex: search, $options: 'i' } },
              { skills: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const requirementsPipeline = [
        { $match: { ...matchStatus, ...searchQuery } },
        {
          $lookup: {
            from: 'companies',
            localField: 'requirement_by',
            foreignField: '_id',
            as: 'companyDetails',
          },
        },
        { $unwind: { path: '$companyDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            requirement_title: 1,
            requirement_by: '$companyDetails.CompanyName',
            number_of_positions: 1,
            assigned_to: 1,
            location: 1,
            job_description: 1,
            skills: 1,
            budget: 1,
            experience: 1,
            priority: 1,
            status: 1,
            contract_type: 1,
            payroll: 1,
            remarks: 1,
            updatedAt: 1, // Required for sorting
          },
        },
        { $sort: { updatedAt: -1 } },
      ];

      const options = {
        page: pageNum,
        limit: pageSize,
      };

      const result = await Requirement.aggregatePaginate(Requirement.aggregate(requirementsPipeline), options);
      return {
        data: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages,
        totalRecords: result.totalDocs,
      };
    } catch (error) {
      throw new ApiError(500, `Error fetching requirement listings: ${error.message}`);
    }
  },
};

export { RequirementService };