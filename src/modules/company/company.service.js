import { ApiError } from '../../utils/ApiError.js';
import { Company } from './models/company.model.js';

const CompanyService = {
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
};

export { CompanyService };
