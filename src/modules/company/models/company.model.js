import { Schema, model } from 'mongoose';

const companySchema = Schema(
  {
    companyTypeId: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Company = model('Company', companySchema);
