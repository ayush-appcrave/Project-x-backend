// modules/company/company.service.js
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { ApiError } from '../../utils/ApiError.js';
import { Company } from './models/company.model.js';
import { CompanyDocument } from '../documents/models/document.model.js';
import { CompanyType } from './models/companyType.model.js';

export class CompanyService {
  static async createUploadDirectory() {
    const env = process.env.NODE_ENV;
    const baseDir = env === 'production' 
      ? '/var/www/uploads/companies'
      : path.join(process.cwd(), 'uploads', 'companies');
    
    await fs.mkdir(baseDir, { recursive: true });
    return baseDir;
  }

  static async uploadFiles(files, companyId) {
    const baseDir = await this.createUploadDirectory();
    const companyDir = path.join(baseDir, companyId.toString());
    await fs.mkdir(companyDir, { recursive: true });

    const uploadedDocs = [];
    for (const file of files) {
      const uniqueFilename = `${uuidv4()}-${file.originalname}`;
      const filePath = path.join(companyDir, uniqueFilename);
      await fs.rename(file.path, filePath);

      const doc = await CompanyDocument.create({
        documentname: file.originalname,
        type: 'Company',
        typeid: companyId,
        documentfileurl: `/uploads/companies/${companyId}/${uniqueFilename}`,
        createdby: file.user._id,
        modifiedby: file.user._id
      });
      uploadedDocs.push(doc._id);
    }
    return uploadedDocs;
  }

  static async createCompany(companyData, files, userId) {
    // Validate company type exists
    const companyType = await CompanyType.findById(companyData.companytypeid);
    if (!companyType) {
      throw new ApiError(400, 'Invalid company type');
    }

    // Create company
    const company = await Company.create({
      ...companyData,
      createdby: userId,
      modifiedby: userId,
    });

    // Upload and link documents if any
    if (files?.length > 0) {
      const documentIds = await this.uploadFiles(files, company._id);
      company.companydocuments = documentIds;
      await company.save();
    }

    return company;
  }

  static async updateCompany(companyId, updateData, files, userId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    // Update company data
    Object.assign(company, updateData);
    company.modifiedby = userId;

    // Handle new documents if any
    if (files?.length > 0) {
      const documentIds = await this.uploadFiles(files, company._id);
      company.companydocuments.push(...documentIds);
    }

    await company.save();
    return company;
  }
}

// modules/company/company.controller.js
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CompanyService } from './company.service.js';
import { companyValidation } from './company.validation.js';

export const createCompany = asyncHandler(async (req, res) => {
  const { error } = companyValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const company = await CompanyService.createCompany(
    req.body,
    req.files,
    req.user._id
  );

  return res
    .status(201)
    .json(new ApiResponse(201, company, 'Company created successfully'));
});

// modules/seeder/companyType.seeder.js
import { CompanyType } from '../company/models/companyType.model.js';
import { companyTypes } from '../../constants/company.constants.js';

export const seedCompanyTypes = async () => {
  try {
    // Create vendor type
    await CompanyType.create({
      CompanyType: companyTypes.CompanyType["2"],
      CompanyModeOfOperation: [
        companyTypes.ModeOfOperations["1"],
        companyTypes.ModeOfOperations["2"],
        companyTypes.ModeOfOperations["3"],
      ]
    });

    // Create client type
    await CompanyType.create({
      CompanyType: companyTypes.CompanyType["1"],
      CompanyModeOfOperation: [
        companyTypes.ModeOfOperations["1"],
        companyTypes.ModeOfOperations["2"],
        companyTypes.ModeOfOperations["3"],
      ]
    });

    console.log('Company types seeded successfully');
  } catch (error) {
    console.error('Error seeding company types:', error);
  }
};

// middlewares/multer.middleware.js
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, 'uploads/temp'); // Temporary storage
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new ApiError(400, 'Invalid file type. Only PDF and DOC files are allowed'), false);
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});