import { Schema, model } from 'mongoose';

export const compnayTypes = {
  VENDOR: 'vendor',
  CLIENT: 'client',
  STAFFING: 'staffing',
};
const companyTypeSchema = Schema(
  {
    companyTypeName: {
      type: String,
      enum: Object.values(compnayTypes),
      required: [true, 'Please provide the company type name'],
      trim: true,
      unqiue: true,
    },
  },
  { timestamps: true },
);

export const CompanyType = model('CompanyType', companyTypeSchema);
