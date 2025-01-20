import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../../config/appConfig.js';
export const UserRole = {
  SYSTEM_ADMIN: 'systemAdmin',
  SALES_LEAD: 'salesLead',
  SALES_MEMBER: 'salesMember',
  RECRUITMENT_LEAD: 'recruitmentLead',
  RECRUITMENT_MEMBER: 'recruitmentMember',
  ORG_MANAGER: 'organizationManager',
  CLIENT: 'client', // No password required
  VENDOR: 'vendor' // No password required
};
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the user's name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide the user's email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.role !== UserRole.CLIENT && this.role !== UserRole.VENDOR;
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "Please provide the user's role"],
    },
    assignedClients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        default: [],
      },
    ],
    assignedVendors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        default: [],
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordMatch = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      email: this.email,
    },
    config.access_token_secret,
    {
      expiresIn: config.access_token_expiry,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.refresh_token_secret,
    {
      expiresIn: config.refresh_token_expiry,
    }
  );
};

export  const User = model('User', userSchema);


