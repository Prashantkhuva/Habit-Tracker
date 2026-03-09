import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Password hasing

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// for compare the password is the correct or not

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// AccessToken Generation

userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry =
    process.env.ACCESS_TOKEN_EXPIRY || process.env.ACCESS_TOKEN_EXPIRE;

  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  if (!accessTokenExpiry) {
    throw new Error(
      "ACCESS_TOKEN_EXPIRY or ACCESS_TOKEN_EXPIRE is not configured",
    );
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry },
  );
};
userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry =
    process.env.REFRESH_TOKEN_EXPIRY || process.env.REFRESH_TOKEN_EXPIRE;

  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not configured");
  }

  if (!refreshTokenExpiry) {
    throw new Error(
      "REFRESH_TOKEN_EXPIRY or REFRESH_TOKEN_EXPIRE is not configured",
    );
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry },
  );
};

export const User = mongoose.model("User", userSchema);
