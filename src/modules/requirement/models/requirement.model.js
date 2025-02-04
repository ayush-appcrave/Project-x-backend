import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { requirementPriority, requirementStatus, requirementContractType } from '../../../constants/requirement.constants.js';
import { Company } from './Company.Model.js';
import { User } from './User.Model.js';

const RequirementSchema = new Schema(
  {
    requirement_title: {
      type: String,
      required: true,
      trim: true,
    },
    requirement_by: {
      type: Schema.Types.ObjectId,
      ref: Company,
      required: true,
    },
    number_of_positions: {
      type: Number,
      required: true,
    },
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    job_description: {
      type: String,
      trim: true,
    },
    skills: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    priority: {
      type: Number,
      enum: Object.keys(requirementPriority).map(Number),
      required: true,
    },
    status: {
      type: Number,
      enum: Object.keys(requirementStatus).map(Number),
      required: true,
    },
    contract_type: {
      type: Number,
      enum: Object.keys(requirementContractType).map(Number),
      required: true,
    },
    payroll: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modified_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

RequirementSchema.plugin(aggregatePaginate);

export const Requirement = model('Requirement', RequirementSchema);
