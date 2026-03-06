import mongoose from "mongoose";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1️⃣ total habits
  // const totalHabits = await Habit.countDocuments({
  //   user: userId,
  // });

  // // 2️⃣ completed today
  // const completedToday = await HabitLog.countDocuments({
  //   user: userId,
  //   date: today,
  // });

  // // 3️⃣ total completions
  // const totalCompletions = await HabitLog.countDocuments({
  //   user: userId,
  // });

  const [totalHabits, completedToday, totalCompletions] = await Promise.all([
    Habit.countDocuments({
      user: userId,
    }),

    HabitLog.countDocuments({
      user: userId,
      date: today,
    }),

    HabitLog.countDocuments({
      user: userId,
    }),
  ]);

  const completionRate =
    totalHabits === 0 ? 0 : Math.floor((completedToday / totalHabits) * 100);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalHabits,
        completedToday,
        totalCompletions,
        completionRate,
      },
      "Dashboard stats fetched successfully",
    ),
  );
});

const weeklyChart = asyncHandler(async (req, res) => {
  const today = new Date();

  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay() + 1);
  firstDay.setHours(0, 0, 0, 0);

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);

  const weeklyData = await HabitLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
        completed: true,
        date: {
          $gte: firstDay,
          $lte: lastDay,
        },
      },
    },
    {
      $addFields: {
        dayofWeek: { $dayofWeek: "$date" },
      },
    },
    {
      $group: {
        _id: "$dayofWeek",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const result = days.map((day, index) => {
    const found = weeklyData.find((d) => d._id === index + 1);

    return {
      day,
      count: found ? found.count : 0,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Weekly data fetched successfully"));
});

const longestStreak = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const { habitId } = req.params;

  const habit = await HabitLog.find({
    userId,
    habitId,
    completed: true,
  }).sort({ date: -1 });

  const uniqueDates = [
    ...new Set(
      logs.map((log) => new Date(log.date).toISOString().split("T")[0]),
    ),
  ];

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate = null;

  for (const log of logs) {
    const currentDate = new Date(log.date);

    if (!previousDate) {
      currentStreak = 1;
    } else {
      let diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
    }

    if (diff === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    previousDate = currentDate;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentStreak,
        longestStreak,
      },
      "Streak calculated successfully",
    ),
  );
});

export { getDashboardStats, weeklyChart, longestStreak };
