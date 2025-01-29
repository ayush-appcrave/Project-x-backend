import { Schema, model } from 'mongoose';
import { compnayTypes } from '../../../constants/company.constants.js';
const companyTypeSchema = Schema(
  {
    companytype: {
      type: String,
      enum: Object.values(compnayTypes.type),
      required: [true, 'Please provide the company type name'],
      trim: true,
      unique: true,
    },
    companymodeofoperation: [{
      type: String,
      enum: Object.values(compnayTypes.subtypes),
      required: [true, 'Please provide the company mode of operation'],
    }],
  },
  { timestamps: true },
);

export const CompanyType = model('CompanyType', companyTypeSchema);
