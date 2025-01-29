import { Schema, model } from 'mongoose';
import { compnayTypes } from '../../../constants/company.constants.js';

const companyTypeSchema = new Schema(
  {
    CompanyType: {
      type: Number, // Store the key (number) from the constants
      enum: Object.keys(compnayTypes.CompanyType).map(Number), // Validate against the keys
      required: [true, 'Please provide the company type name'],
      trim: true,
      unique: true,
    },
    CompanyModeOfOperation: [{
      type: Number, // Store the key (number) from the constants
      enum: Object.keys(compnayTypes.ModeOfOperations).map(Number), // Validate against the keys
      required: [true, 'Please provide the company mode of operation'],
    }],
  },
  { timestamps: true },
);

export const CompanyType = model('CompanyType', companyTypeSchema);
