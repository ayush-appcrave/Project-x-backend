import { Schema, model } from 'mongoose';
import { companyStatus } from '../../../constants/company.constants.js';
const companySchema = Schema(
  {
    CompanyName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    CompanyEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    CompanyAddress: [
      {
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
       
      },
    ],
    CompanySocialLinks: {
      Linkedin: {
        type: String,
        trim: true,
        required: true,
      },
      Website: {
        type: String,
        trim: true,
      },
    },
    CompanyGst: {
      type: String,
      trim: true,
      unique: true,
      length: 15,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    },
    CompanyStatus: {
      type: String,
      enum: Object.values(companyStatus),
      required: true,
    },
    CompanyTypeID: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyType',
      required: true,
    },
    //company tyep - client vendor 
    //company mode of opertion  - c2c c2h , fte [can be slecte ]
    CompanyDocuments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CompanyDocument',
      },
    ],
    PocName: {
      type: String,
    },
    PocContact: {
      type: String,
      trim: true,
      lowercase: true,
    },
    PocEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Company = model('Company', companySchema);
