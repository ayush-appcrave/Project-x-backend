import { Schema, model } from 'mongoose';
import { compnayTypes } from '../../../constants/company.constants.js';
const companyTypeSchema = Schema(
  {
    companytype: {
      type: String,
      enum: Object.values(compnayTypes.type),
      required: [true, 'Please provide the company type name'],
      trim: true,
      unique: true
    },
    companyvendortype: {
      type: String,
      enum: Object.values(compnayTypes.subtypes),
      required: function () {
        return this.companytype === compnayTypes.type.VENDOR;
      },
    },
  },
  { timestamps: true }
);

export const CompanyType = model('CompanyType', companyTypeSchema);
