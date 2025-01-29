import { ApiError } from '../../utils/ApiError.js';
import { Company } from './models/company.model.js';
import { CompanyType } from './models/companyType.model.js';

const CompanyService = {
  createCompany: async (companyData) => {
    const { CompanyTypeID, ...rest } = companyData;

    // Check if CompanyType exists
    const companyType = await CompanyType.findById(CompanyTypeID);
    if (!companyType) {
      throw new ApiError(404, 'CompanyType not found');
    }

    const company = await Company.create({ ...rest, CompanyTypeID });

    return company;
  },
};

export { CompanyService };
