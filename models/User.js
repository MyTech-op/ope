import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import crypto from "crypto";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 32,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "rider"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Generate access & refresh tokens
userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { id: this._id, phone: this.phone },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { id: this._id, phone: this.phone },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
