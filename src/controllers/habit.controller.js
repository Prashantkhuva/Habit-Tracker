import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const createHabit = asyncHandler(async (req, res) => {
  const { title, description, frequency, category, color, type } = req.body;

  if (!title || !description || !frequency) {
    throw new ApiError(400, "Title, Description and Frequency are required");
  }

  const allowedFrequency = ["daily", "weekly"];

  if (
    typeof frequency !== "string" ||
    !allowedFrequency.includes(frequency.toLowerCase())
  ) {
    throw new ApiError(400, "Frequency must be 'daily' or 'weekly'");
  }

  const habit = await Habit.create({
    title: title.trim(),
    description: description?.trim() || "",
    frequency: frequency.toLowerCase(),
    category: category.trim(),
    color,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, habit, "Habit created successfully"));
});

const getUserHabit = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, habits, "Habits fetched successfully"));
});

const deleteHabit = asyncHandler(async (req, res) => {
  const habitId = req.params.habitId || req.query.habitId || req.body.habitId;

  if (!habitId) {
    throw new ApiError(400, "habitId is required");
  }

  const habit = await Habit.findOneAndDelete({
    _id: habitId,
    user: req.user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  await HabitLog.deleteMany({
    habit: habitId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Habit deleted successfully"));
});

const updateHabitDetails = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const { title, description, frequency } = req.body;

  const allowedFrequency = ["daily", "weekly"];

  if (
    frequency &&
    (typeof frequency !== "string" ||
      !allowedFrequency.includes(frequency.toLowerCase()))
  ) {
    throw new ApiError(400, "Frequency must be 'daily' or 'weekly'");
  }

  const updateFields = {};

  if (title) updateFields.title = title.trim();
  if (description) updateFields.description = description.trim();
  if (frequency) updateFields.frequency = frequency.toLowerCase();

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: req.user._id,
    },
    {
      $set: updateFields,
    },
    {
      returnDocument: "after",
    },
  );

  if (!habit) {
    throw new ApiError(400, "Habit not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "habit details updated successfully"));
});

const pauseHabit = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: req.user._id,
    },
    {
      status: "paused",
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit paused successfully"));
});

const resumeHabit = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: req.user._id,
    },
    {
      status: "active",
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit resumed successfully"));
});

const archiveHabit = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: req.user._id,
    },
    {
      status: "archived",
    },
    {
      returnDocument: "after",
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, habit, "Habit archived  successfully"));
});

export {
  createHabit,
  getUserHabit,
  deleteHabit,
  updateHabitDetails,
  pauseHabit,
  resumeHabit,
  archiveHabit,
};
