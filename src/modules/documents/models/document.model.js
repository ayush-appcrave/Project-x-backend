import { Schema, model } from 'mongoose';
const companyDocumentSchema = Schema(
  {
    documentname: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    typeid: {
      type: Schema.Types.ObjectId,
      refPath: 'type',
      required: true,
    },
    documentfileurl: {
      type: String,
      required: true,
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
  { timestamps: true },
);

export const CompanyDocument = model('CompanyDocument', companyDocumentSchema);
