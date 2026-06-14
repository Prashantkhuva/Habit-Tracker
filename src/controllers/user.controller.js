import { User } from "../models/user.model.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        400,
        "User does not found. Please register the User..",
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while generating access & refresh token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists with this username and email");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    isEmailVerified: false,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found, Kindly register user.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while log in user");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null, // ✅ fix
      },
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { user }, "Access token refreshed successfully"),
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token",
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(500, "Old Password is Incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body || {};

  if (!username && !email) {
    throw new ApiError(400, "Username or email required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updateFields = {};

  // 🔥 USERNAME FIX
  if (username) {
    const cleanUsername = username.toLowerCase().trim();

    // same username skip
    if (cleanUsername !== user.username) {
      const existed = await User.findOne({ username: cleanUsername });

      if (existed && existed._id.toString() !== user._id.toString()) {
        throw new ApiError(409, "Username already taken");
      }

      updateFields.username = cleanUsername;
    }
  }

  // 🔥 EMAIL
  if (email) {
    updateFields.email = email.trim();
  }

  // 🔥 UPDATE
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true }, // important
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user: updatedUser }, "Updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userHabits = await Habit.find({ user: userId });
  const habitIds = userHabits.map((h) => h._id);

  if (habitIds.length > 0) {
    await HabitLog.deleteMany({ habit: { $in: habitIds } });
    await Habit.deleteMany({ user: userId });
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If the email exists, a reset link will be sent."));
  }
  const resetToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || process.env.CORS_ORIGIN?.split(",")[0] || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetUrl, message: "Use this link to reset your password (dev mode)" },
        "Reset link generated",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw new ApiError(400, "Token and new password are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  const user = await User.findById(decoded._id);
  if (
    !user ||
    user.resetPasswordToken !== token ||
    user.resetPasswordExpiry < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateUserDetails,
  getCurrentUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
