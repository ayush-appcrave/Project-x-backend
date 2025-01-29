import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import { config } from '../../config/appConfig.js';
import { userRole } from '../../constants/userRole.constants.js';

const userSchema = new Schema(
  {
    FullName: {
      type: String,
      required: [true, "Please provide the user's name"],
      trim: true,
    },
    Email: {
      type: String,
      required: [true, "Please provide the user's email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
      min: 8,
    },
    Role: {
      type: Number, // Change to Number to store the key
      enum: Object.keys(userRole).map(Number), // Use keys as enum
      required: [true, "Please provide the user's role"],
    },
    RefreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) {
    next();
  }
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

userSchema.methods.isPasswordMatch = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      FullName: this.FullName,
      Email: this.Email,
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
