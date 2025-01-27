import { Schema, model } from 'mongoose';
import { companyDocumentType } from '../../../constants/company.constants.js';
const companyDocumentSchema = Schema(
  {
    documentname: {
      type: String,
      enum: Object.values(companyDocumentType),
      required: true,
    },
    documentfileurl: {
      type: string,
      required: true,
    },
    uploadedby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const CompanyDocument = model('CompanyDocument', companyDocumentSchema);
