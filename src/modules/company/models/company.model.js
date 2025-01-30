import { Schema, model } from 'mongoose';
import {
  companyStatus,
  compnayTypes,
} from '../../../constants/company.constants.js';

const companySchema = new Schema(
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
    CompanyGst: {
      type: String,
      trim: true,

      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    },
    CompanyType: {
      type: Number,
      enum: Object.keys(compnayTypes.CompanyType).map(Number),
      required: true,
    },
    CompanyStatus: {
      type: Number, // Store the key (number) from the constants
      enum: Object.keys(companyStatus).map(Number), // Validate against the keys
      required: true,
    },
    ModeOfOperations: {
      type: [Number],
      enum: Object.keys(compnayTypes.ModeOfOperations).map(Number),
      required: true,
    },
    CompanyAddress: {
      City: { type: String, trim: true },
      State: { type: String, trim: true },
    },
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
    PocName: {
      type: String,
      trim: true,
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
    CompanyDocument: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CompanyDocument',
      },
    ],
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
  { timestamps: true },
);

export const Company = model('Company', companySchema);
