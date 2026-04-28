import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const completeHabitLog = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const habit = await Habit.findOne({
    _id: habitId,
    user: req.user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  // 🔥 streak ke liye (same as before)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayTimestamp = today.getTime();

  const alreadyCompleted = await HabitLog.findOne({
    habit: habitId,
    user: req.user._id,
    date: dayTimestamp,
  });

  if (alreadyCompleted) {
    throw new ApiError(400, "Habit already completed today");
  }

  // 🔥 IMPORTANT FIX
  const habitLog = await HabitLog.create({
    habit: habitId,
    user: req.user._id,
    date: dayTimestamp, // ✅ streak ke liye
    completedAt: new Date(), // ✅ REAL TIME 🔥
    completed: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, habitLog, "Habit completed successfully"));
});

const getHabitLogs = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // this is the number of documents to skip based on the current page and limit==>>

  const skip = (page - 1) * limit;

  const habit = await Habit.findOne({
    _id: habitId,
    user: req.user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  const [logs, totalLogs] = await Promise.all([
    HabitLog.find({
      habit: habitId,
      user: req.user._id,
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),

    HabitLog.countDocuments({
      habit: habitId,
      user: req.user._id,
    }),
  ]);

  const totalPages = Math.ceil(totalLogs / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          totalLogs,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      "Habit log fetched successfully",
    ),
  );
});

const getHabitStreak = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const habit = await Habit.findOne({
    _id: habitId,
    user: req.user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  const logs = await HabitLog.find({
    habit: habitId,
    user: req.user._id,
  }).sort({ date: -1 });

  if (logs.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { streak: 0 }, "No streak yet"));
  }

  let streak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(today);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { streak }, "Habit streak fetched successfully"),
    );
});

const getAllHabitLogs = asyncHandler(async (req, res) => {
  const logs = await HabitLog.find({
    user: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { logs }, "All logs fetched"));
});

export { completeHabitLog, getHabitLogs, getHabitStreak, getAllHabitLogs };
