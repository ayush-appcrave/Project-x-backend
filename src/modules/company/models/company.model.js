import { Schema, model } from 'mongoose';
import { companyStatus } from '../../../constants/company.constants.js';
const companySchema = Schema(
  {
    companyname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    companyemail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    companyaddress: [
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
    companysociallinks: {
      linkedin: {
        type: String,
        trim: true,
        required: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    companygst: {
      type: String,
      trim: true,
      unique: true,
      length: 15,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    },
    companystatus: {
      type: String,
      enum: Object.values(companyStatus),
      required: true,
    },
    companytypeid: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyType',
      required: true,
    },
    //company tyep - client vendor 
    //company mode of opertion  - c2c c2h , fte [can be slecte ]
    companydocuments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CompanyDocument',
      },
    ],
    pocname: {
      type: String,
    },
    poccontact: {
      type: String,
      trim: true,
      lowercase: true,
    },
    pocemail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    createdby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modifiedby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Company = model('Company', companySchema);
