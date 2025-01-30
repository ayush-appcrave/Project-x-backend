import { ApiError } from '../../utils/ApiError.js';
import { Company } from './models/company.model.js';

const CompanyService = {

  //Used to create a new company
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
  }
};

export { CompanyService };
