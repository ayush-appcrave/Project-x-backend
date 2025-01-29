import { asyncHandler } from '../../utils/asyncHandler.js';

const createClientTypeCompany = asyncHandler(async (req, res) => {
    
});

const createVendorTypeCompany = asyncHandler(async (req, res) => {});

const getClientCompanyList = asyncHandler(async (req, res) => {});

const getVendorCompanyList = asyncHandler(async (req, res) => {});

const getClientCompanyDetailsById = asyncHandler(async (req, res) => {});

const getVendorCompanyDetailsById = asyncHandler(async (req, res) => {});

const updateClientCompanyDetails = asyncHandler(async (req, res) => {});

const updateVendorCompanyDetails = asyncHandler(async (req, res) => {});

const updateClientCompanyStatus = asyncHandler(async (req, res) => {});

const updateVendorCompanyStatus = asyncHandler(async (req, res) => {});
export {
  createClientTypeCompany,
  createVendorTypeCompany,
  getClientCompanyDetailsById,
  getClientCompanyList,
  getVendorCompanyDetailsById,
  getVendorCompanyList,
  updateClientCompanyDetails,
  updateClientCompanyStatus,
  updateVendorCompanyDetails,
  updateVendorCompanyStatus,
};
