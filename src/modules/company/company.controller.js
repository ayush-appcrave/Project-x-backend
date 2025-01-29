import { asyncHandler } from '../../utils/asyncHandler.js';

const createCompanyType = asyncHandler(async (req, res) => {
  const company_request = req.body;
  console.log(company_request);
});

const getCompanyList = asyncHandler(async (req, res) => {});

const getCompanyDetailsById = asyncHandler(async (req, res) => {});

const updateCompanyDetails = asyncHandler(async (req, res) => {});

const updateCompanyStatus = asyncHandler(async (req, res) => {});

export {
  createCompanyType,
  getCompanyList,
  getCompanyDetailsById,
  updateCompanyDetails,
  updateCompanyStatus,
};
