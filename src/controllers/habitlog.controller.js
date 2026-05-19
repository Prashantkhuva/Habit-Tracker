import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/* ------------------------------------------------ */
/* COMPLETE HABIT */
/* ------------------------------------------------ */

const completeHabitLog = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const { note } = req.body;

  const habit = await Habit.findOne({
    _id: habitId,
    user: req.user._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  /* TODAY START */
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dayTimestamp = today.getTime();

  /* CHECK DUPLICATE */
  const alreadyCompleted = await HabitLog.findOne({
    habit: habitId,
    user: req.user._id,
    date: dayTimestamp,
  });

  if (alreadyCompleted) {
    throw new ApiError(400, "Habit already completed today");
  }

  /* CREATE LOG */
  const habitLog = await HabitLog.create({
    habit: habitId,

    user: req.user._id,

    date: dayTimestamp,

    completedAt: new Date(),

    completed: true,

    note: note || "",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, habitLog, "Habit completed successfully"));
});

/* ------------------------------------------------ */
/* GET SINGLE HABIT LOGS */
/* ------------------------------------------------ */

const getHabitLogs = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 10;

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

/* ------------------------------------------------ */
/* GET HABIT STREAK */
/* ------------------------------------------------ */

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
    completed: true,
  }).sort({ date: -1 });

  /* NO LOGS */
  if (logs.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          currentStreak: 0,
        },
        "No streak yet",
      ),
    );
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentStreak: streak,
      },
      "Habit streak fetched successfully",
    ),
  );
});

/* ------------------------------------------------ */
/* GET ALL LOGS */
/* ------------------------------------------------ */

const getAllHabitLogs = asyncHandler(async (req, res) => {
  const logs = await HabitLog.find({
    user: req.user._id,
  }).sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
      },
      "All logs fetched",
    ),
  );
});

export { completeHabitLog, getHabitLogs, getHabitStreak, getAllHabitLogs };
