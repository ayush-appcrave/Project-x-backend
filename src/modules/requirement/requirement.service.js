import { ApiError } from '../../utils/ApiError.js';
import { Company } from './models/company.model.js';

const CompanyService = {
  // Used to create a new company
  createCompany: async (companyData, createdBy) => {
    console.log(companyData);
    const { CompanyType, ModeOfOperations, ...rest } = companyData;

    // Create the company
    const company = await Company.create({
      ...rest,
      CompanyType: Number(CompanyType),
      ModeOfOperations: ModeOfOperations.map(Number),
      CreatedBy: createdBy,
      ModifiedBy: createdBy,
    });

    if (!company) {
      throw new ApiError(500, 'Failed to create company');
    }

    return company;
  },

  // Fetches company details by ID
  getCompanyDetail: async (companyID) => {
    console.log('Getting Company Detail with ID', companyID);

    if (!companyID) {
      throw new ApiError(400, 'Company ID is required');
    }

    try {
      const company = await Company.findById(companyID);

      if (!company) {
        throw new ApiError(404, 'Company not found');
      }

      return company;
    } catch (error) {
      throw new ApiError(500, 'Error fetching company details');
    }
  },

  // Updates an existing company
  updateCompany: async (companyID, updateData, modifiedBy) => {
    if (!companyID) {
      throw new ApiError(400, 'Company ID is required');
    }

    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        companyID,
        {
          ...updateData,
          ModeOfOperations: updateData.ModeOfOperations.map(Number), // Ensure it's an array of numbers
          ModifiedBy: modifiedBy, // Track who modified it
        },
        { new: true, runValidators: true } // Return the updated document & enforce validation
      );

      if (!updatedCompany) {
        throw new ApiError(404, 'Company not found');
      }

      return updatedCompany;
    } catch (error) {
      throw new ApiError(500, `Error updating company: ${error.message}`);
    }
  },
  getCompanyListing: async ({ type, status, page = 1, limit = 50, search = '' }) => {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 50;

      // Filtering by type and status
      const matchType = { CompanyType: Number(type) };
      if (status) matchType.CompanyStatus = Number(status);

      // Keyword search across multiple fields
      const searchQuery = search
        ? {
            $or: [
              { CompanyName: { $regex: search, $options: 'i' } }, // Case-insensitive search
              { CompanyEmail: { $regex: search, $options: 'i' } },
              { PocName: { $regex: search, $options: 'i' } },
              { PocEmail: { $regex: search, $options: 'i' } },
              { PocContact: { $regex: search, $options: 'i' } },
              { 'CompanyAddress.City': { $regex: search, $options: 'i' } },
              { 'CompanyAddress.State': { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const companiesPipeline = [
        { $match: { ...matchType, ...searchQuery } },
        {
          $project: {
            _id: 1,
            CompanyName: 1,
            CompanyEmail: 1,
            ModeOfOperations: 1,
            'CompanyAddress.City': 1,
            'CompanyAddress.State': 1,
            CompanyStatus: 1,
            PocName: 1,
            PocEmail: 1,
            PocContact: 1,
            updatedAt: 1, // Required for sorting
          },
        },
        { $sort: { updatedAt: -1 } }, // Sort by latest updated
      ];

      const options = {
        page: pageNum,
        limit: pageSize,
      };

      const result = await Company.aggregatePaginate(Company.aggregate(companiesPipeline), options);
      console.log('Result:', result);
      return {
        data: result.docs, // Paginated data
        currentPage: result.page,
        totalPages: result.totalPages,
        totalRecords: result.totalDocs,
      };
    } catch (error) {
      throw new ApiError(500, `Error fetching company listings: ${error.message}`);
    }
  },
};

export { CompanyService };
