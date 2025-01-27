import { Schema, model } from 'mongoose';

const companyCommentSchema = Schema(
  {
    companyid: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const CompanyComment = model('CompanyComment', companyCommentSchema);
