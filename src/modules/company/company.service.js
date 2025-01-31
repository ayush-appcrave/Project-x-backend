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
};

export { CompanyService };
