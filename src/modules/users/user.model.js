import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import { config } from '../../config/appConfig.js';
import { userRole } from '../../constants/userRole.constants.js';

const userSchema = new Schema(
  {
    fullname: {
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
      required: true,
      min: 8,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      required: [true, "Please provide the user's role"],
    },
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

userSchema.methods.isPasswordMatch = async function (candidatePassword) {
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
    },
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
    },
  );
};

export const User = model('User', userSchema);
